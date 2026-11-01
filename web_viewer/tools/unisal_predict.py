import sys,json,argparse,types
from pathlib import Path
import numpy as np
import torch
from PIL import Image
import cv2
p=argparse.ArgumentParser(description='Local UNISAL prediction, not measured eye tracking')
p.add_argument('image',type=Path); p.add_argument('--output',type=Path,required=True)
a=p.parse_args()
repo=Path(__file__).resolve().parents[1]/'old/unisal'
pkg=types.ModuleType('unisal'); pkg.__path__=[str(repo/'unisal')]; sys.modules['unisal']=pkg
from unisal.model import UNISAL
cfg=json.loads((repo/'training_runs/pretrained_unisal/UNISAL.json').read_text())
cfg['cnn_cfg']['pretrained']=False
cfg['verbose']=0
model=UNISAL(**cfg).eval()
model.load_state_dict(torch.load(repo/'training_runs/pretrained_unisal/weights_best.pth',map_location='cpu',weights_only=True))
im=Image.open(a.image).convert('RGB'); w,h=im.size
# UNISAL expects ImageNet-normalized RGB and dimensions divisible by 32.
height=384; width=max(32,round(w/h*height/32)*32)
x=np.asarray(im.resize((width,height)),dtype=np.float32)/255
x=(x-np.array([.485,.456,.406],dtype=np.float32))/np.array([.229,.224,.225],dtype=np.float32)
x=torch.from_numpy(x.transpose(2,0,1).copy())[None,None]
torch.set_num_threads(4)
with torch.inference_mode():
 sal=model(x,source='SALICON',target_size=(h,w)).exp().squeeze().numpy()
a.output.mkdir(parents=True,exist_ok=True)
np.save(a.output/'saliency.npy',sal)
heat=((sal-sal.min())/(sal.max()-sal.min()+1e-12)*255).astype(np.uint8)
colors=cv2.cvtColor(cv2.applyColorMap(heat,cv2.COLORMAP_TURBO),cv2.COLOR_BGR2RGB)
Image.fromarray(colors).save(a.output/'heatmap.png')
Image.blend(im,Image.fromarray(colors),.45).save(a.output/'overlay.png')
(a.output/'metadata.json').write_text(json.dumps({'model':'UNISAL','weights':'weights_best.pth','source':'SALICON','input':str(a.image),'resize':[width,height],'meaning':'Relative model saliency; not observed gaze, comprehension, or cognitive load.'},indent=2))
print(a.output.resolve())
