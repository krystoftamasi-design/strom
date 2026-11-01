"""Temporal UNISAL prediction with recurrent state carried between frames."""
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import sys
import types

import cv2
import numpy as np
from PIL import Image
import torch


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('video', type=Path)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if not shutil.which('ffmpeg'):
        parser.error('ffmpeg must be available on PATH')
    cap = cv2.VideoCapture(str(args.video.resolve()))
    fps = cap.get(cv2.CAP_PROP_FPS)
    if not cap.isOpened() or not np.isfinite(fps) or fps <= 0:
        parser.error('Cannot read video or frame rate')
    repo = Path(__file__).resolve().parents[1] / 'old/unisal'
    pkg = types.ModuleType('unisal')
    pkg.__path__ = [str(repo / 'unisal')]
    sys.modules['unisal'] = pkg
    from unisal.model import UNISAL
    cfg = json.loads((repo / 'training_runs/pretrained_unisal/UNISAL.json').read_text())
    cfg['cnn_cfg']['pretrained'] = False
    cfg['verbose'] = 0
    model = UNISAL(**cfg).eval()
    weights = repo / 'training_runs/pretrained_unisal/weights_best.pth'
    model.load_state_dict(torch.load(weights, map_location='cpu', weights_only=True))
    torch.set_num_threads(4)
    args.output.mkdir(parents=True, exist_ok=True)
    maps, hidden, size = [], None, None
    mean = np.array([.485, .456, .406], dtype=np.float32)
    std = np.array([.229, .224, .225], dtype=np.float32)
    try:
        with torch.inference_mode():
            while True:
                ok, frame = cap.read()
                if not ok:
                    break
                h, w = frame.shape[:2]
                if size is None:
                    size = (w, h)
                    model_size = (max(32, round(w / h * 384 / 32) * 32), 384)
                if (w, h) != size:
                    raise ValueError('Frame dimensions changed')
                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                x = np.asarray(Image.fromarray(rgb).resize(model_size), dtype=np.float32) / 255
                x = torch.from_numpy(((x - mean) / std).transpose(2, 0, 1).copy())[None, None]
                pred, hidden = model(x, h0=hidden, return_hidden=True,
                                     source='DHF1K', static=False,
                                     target_size=(model_size[1], model_size[0]))
                sal = pred.exp().squeeze().numpy()
                if not np.isfinite(sal).all():
                    raise ValueError('Non-finite model prediction')
                maps.append(sal)
    finally:
        cap.release()
    if not maps:
        raise ValueError('Video has no decodable frames')
    maps = np.stack(maps)
    np.save(args.output / 'saliency.npy', maps)
    # One common colour scale for the whole clip avoids per-frame rescaling.
    low, high = float(maps.min()), float(maps.max())
    cap = cv2.VideoCapture(str(args.video.resolve()))
    command = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo',
               '-pix_fmt', 'bgr24', '-s', f'{size[0]}x{size[1]}', '-r', str(fps),
               '-i', '-', '-an', '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2',
               '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
               str(args.output / 'overlay.mp4')]
    proc = subprocess.Popen(command, stdin=subprocess.PIPE)
    try:
        for sal in maps:
            ok, frame = cap.read()
            if not ok:
                raise ValueError('Source video ended during rendering')
            intensity = np.clip((sal - low) / max(high - low, 1e-12) * 255, 0, 255).astype(np.uint8)
            heat = cv2.applyColorMap(cv2.resize(intensity, size), cv2.COLORMAP_TURBO)
            proc.stdin.write(cv2.addWeighted(frame, .55, heat, .45, 0).tobytes())
    finally:
        cap.release()
        proc.stdin.close()
        result = proc.wait()
    if result:
        raise RuntimeError('ffmpeg failed to encode the overlay')
    (args.output / 'metadata.json').write_text(json.dumps({
        'model': 'UNISAL', 'weights': 'weights_best.pth', 'source': 'DHF1K',
        'static': False, 'recurrent_state': 'carried across all frames',
        'fps': fps, 'frames': len(maps), 'seconds': len(maps) / fps,
        'input': str(args.video), 'model_size': model_size,
        'colour_scale': {'min': low, 'max': high, 'scope': 'whole clip'},
        'meaning': 'Predicted saliency, not measured gaze, click intent or comprehension'
    }, indent=2), encoding='utf-8')
    print(args.output.resolve())


if __name__ == '__main__':
    main()
