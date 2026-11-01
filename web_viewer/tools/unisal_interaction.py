"""Illustrative interaction prior over UNISAL maps; not a trained gaze model."""
import argparse
import json
from pathlib import Path
import subprocess
import cv2
import numpy as np


def combine(maps, fps, events):
    result = maps.copy()
    _, h, w = maps.shape
    yy, xx = np.mgrid[:h, :w]
    xx = (xx + .5) / w
    yy = (yy + .5) / h
    for event in events:
        kind = event['type']
        if kind not in ('click', 'pointer'):
            raise ValueError('Event type must be click or pointer')
        time, x, y = (float(event[k]) for k in ('time', 'x', 'y'))
        if not all(np.isfinite(v) for v in (time,x,y)) or time < 0 or not (0 <= x <= 1 and 0 <= y <= 1):
            raise ValueError('Invalid event coordinates or time')
        prior = np.exp(-((xx-x)**2+(yy-y)**2)/(2*.045**2))
        if kind == 'click' and 'roi' in event:
            left, top, right, bottom = event['roi']
            if not (0 <= left < right <= 1 and 0 <= top < bottom <= 1):
                raise ValueError('Invalid normalized detail rectangle')
            roi = ((xx>=left)&(xx<=right)&(yy>=top)&(yy<=bottom)).astype(float)
            if roi.sum():
                prior = .35*prior/prior.sum()+.65*roi/roi.sum()
        prior /= prior.sum()
        for i in range(len(maps)):
            dt = i/fps-time
            if 0 <= dt < (6 if kind == 'click' else 1):
                weight = (.55 if kind == 'click' else .08)*np.exp(-dt/(1.5 if kind == 'click' else .3))
                result[i] = (1-weight)*result[i]+weight*prior
    return result


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('video',type=Path)
    p.add_argument('--prediction',type=Path,required=True)
    p.add_argument('--events',type=Path,required=True)
    p.add_argument('--output',type=Path,required=True)
    a=p.parse_args()
    meta=json.loads((a.prediction/'metadata.json').read_text())
    maps=np.load(a.prediction/'saliency.npy')
    if maps.ndim!=3 or not np.isfinite(maps).all() or np.any(maps<0):
        raise ValueError('Invalid saliency maps')
    events=json.loads(a.events.read_text())
    fps=float(meta['fps'])
    hybrid=combine(maps,fps,events['events'])
    a.output.mkdir(parents=True,exist_ok=True)
    np.save(a.output/'hybrid.npy',hybrid)
    low=min(float(maps.min()),float(hybrid.min()))
    high=max(float(maps.max()),float(hybrid.max()))
    cap=cv2.VideoCapture(str(a.video.resolve()))
    if abs(cap.get(cv2.CAP_PROP_FPS)-fps)>.01:
        raise ValueError('Video FPS does not match prediction')
    w,h=int(cap.get(3)),int(cap.get(4))
    # Same source image and shared colour scale in both panels.
    proc=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','bgr24',
        '-s',f'{w*2}x{h+40}','-r',str(fps),'-i','-','-an','-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2',
        '-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',str(a.output/'comparison.mp4')],stdin=subprocess.PIPE)
    try:
        for i,(original,combined) in enumerate(zip(maps,hybrid)):
            ok,frame=cap.read()
            if not ok:
                raise ValueError('Source video is shorter than prediction')
            panels=[]
            for sal,label in [(original,'UNISAL'),(combined,'UNISAL + interaction prior (heuristic)')]:
                heat=np.clip((sal-low)/max(high-low,1e-12)*255,0,255).astype(np.uint8)
                overlay=cv2.addWeighted(frame,.55,cv2.applyColorMap(cv2.resize(heat,(w,h)),cv2.COLORMAP_TURBO),.45,0)
                panel=cv2.copyMakeBorder(overlay,40,0,0,0,cv2.BORDER_CONSTANT,value=(25,25,25))
                cv2.putText(panel,f'{label} | {i/fps:.2f}s',(12,27),cv2.FONT_HERSHEY_SIMPLEX,.65,(255,255,255),1,cv2.LINE_AA)
                panels.append(panel)
            proc.stdin.write(np.concatenate(panels,axis=1).tobytes())
    finally:
        cap.release();proc.stdin.close();code=proc.wait()
    if code:
        raise RuntimeError('Video encoding failed')
    (a.output/'metadata.json').write_text(json.dumps({'events':events,'fps':fps,'frames':len(maps),
        'prior':'click .55, tau 1.5s, cutoff 6s; pointer .08, tau .3s, cutoff 1s',
        'roi':'35% click Gaussian + 65% uniform detail rectangle',
        'colour_scale':[low,high], 'meaning':'Unvalidated heuristic; not measured gaze or evidence that highlighting works'},indent=2))
    print(a.output.resolve())


if __name__=='__main__':
    main()
