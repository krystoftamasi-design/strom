import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const url = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const threeUrl = url(await readFile(new URL('../web_assets/vendor/three.module.js', import.meta.url), 'utf8'));
const controlsSource = await readFile(new URL('../web_assets/jsm/controls/OrbitControls.js', import.meta.url), 'utf8');
const { PerspectiveCamera } = await import(threeUrl);
const { OrbitControls } = await import(url(controlsSource.replace("from 'three'", `from '${threeUrl}'`)));

for (const pixelRatio of [0.8, 1, 1.25, 2]) {
  globalThis.window = { devicePixelRatio: pixelRatio };
  const listeners = {};
  const canvas = { style: {}, addEventListener(type, fn) { listeners[type] = fn; }, removeEventListener() {} };
  const camera = new PerspectiveCamera();
  camera.position.set(0, 0, 50);
  const controls = new OrbitControls(camera, canvas);
  controls.minDistance = 17;
  controls.maxDistance = 140;
  const wheel = deltaY => listeners.wheel({ deltaY, preventDefault() {} });
  wheel(-100);
  assert.ok(camera.position.length() > 17 && camera.position.length() < 50, `zoom in at pixel ratio ${pixelRatio}`);
  wheel(100);
  assert.ok(Math.abs(camera.position.length() - 50) < 1e-8, `zoom out at pixel ratio ${pixelRatio}`);
  controls.dispose();
}
console.log('PASS: wheel zoom stays gradual at different pixel ratios.');
