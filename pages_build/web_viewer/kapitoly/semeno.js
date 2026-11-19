import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createSeedModel, loadSeedAssets } from './seed_model.js';

const PARTS = 3;
const PLAY_DURATION = 6000;

async function init() {
  const stage = document.querySelector('#stage');
  const canvas = document.querySelector('#model');
  const slider = document.querySelector('#maturity');
  const progress = document.querySelector('#progress');
  const opening = document.querySelector('#opening');
  const play = document.querySelector('#play');
  const cycle = document.querySelector('#cycle-textures');
  const reset = document.querySelector('#reset-view');
  const swatches = [...document.querySelectorAll('#texture-list li')];

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const assets = await loadSeedAssets(anisotropy);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
  camera.position.set(3.4, 2.9, 4.8);
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0.98, 0);
  controls.enablePan = false;
  controls.minDistance = 2.8;
  controls.maxDistance = 11;
  controls.minPolarAngle = 0.12;
  controls.maxPolarAngle = Math.PI / 2;
  controls.update();
  controls.saveState();

  const key = new THREE.DirectionalLight(0xfff3df, 2.2);
  key.position.set(3, 5, 4);
  const fill = new THREE.DirectionalLight(0xe2f3ff, 1.1);
  fill.position.set(-4, 2, -3);
  scene.add(key, fill, new THREE.HemisphereLight(0xf5f9ef, 0xb8ab8a, 1.7));

  const grid = new THREE.GridHelper(4.8, 12, 0x8aaa95, 0x8aaa95);
  grid.position.y = -0.025;
  grid.material.transparent = true;
  grid.material.opacity = 0.22;
  scene.add(grid);

  const model = createSeedModel(assets);
  scene.add(model.group);

  const render = () => renderer.render(scene, camera);
  controls.addEventListener('change', render);

  function resize() {
    const { clientWidth: width, clientHeight: height } = stage;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.zoom = Math.min(1, camera.aspect);
    camera.updateProjectionMatrix();
    render();
  }
  new ResizeObserver(resize).observe(stage);

  let maturity = 0;
  let frame = 0;
  let textureOffset = 0;

  function setMaturity(value) {
    maturity = value;
    const angle = model.setMaturity(value / 100);
    slider.value = Math.round(value);
    progress.value = `${slider.value} %`;
    opening.textContent = `Otevření ${Math.round(angle)}°`;
    render();
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    play.textContent = 'Přehrát dozrávání';
  }

  slider.addEventListener('input', () => {
    stop();
    setMaturity(slider.valueAsNumber);
  });

  play.addEventListener('click', () => {
    if (frame) {
      stop();
      return;
    }
    if (maturity >= 100) setMaturity(0);
    const startedAt = performance.now() - maturity / 100 * PLAY_DURATION;
    play.textContent = 'Pozastavit';

    function tick(now) {
      setMaturity(Math.min(100, (now - startedAt) / PLAY_DURATION * 100));
      if (maturity >= 100) stop();
      else frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  });

  cycle.addEventListener('click', () => {
    textureOffset = (textureOffset + 1) % swatches.length;
    swatches.forEach((swatch, index) => {
      const part = (index - textureOffset + swatches.length) % swatches.length;
      const reserve = part >= PARTS;
      swatch.toggleAttribute('data-reserve', reserve);
      swatch.querySelector('span').textContent = reserve ? 'Rezerva' : `Díl ${part + 1}`;
    });
    model.setTextureOffset(textureOffset);
    render();
  });

  reset.addEventListener('click', () => {
    controls.reset();
    resize();
  });

  canvas.addEventListener('keydown', event => {
    const orbit = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    switch (event.key) {
      case 'ArrowLeft': orbit.theta -= 0.12; break;
      case 'ArrowRight': orbit.theta += 0.12; break;
      case 'ArrowUp': orbit.phi -= 0.12; break;
      case 'ArrowDown': orbit.phi += 0.12; break;
      case '+': case '=': orbit.radius /= 1.12; break;
      case '-': orbit.radius *= 1.12; break;
      default: return;
    }
    event.preventDefault();
    orbit.phi = THREE.MathUtils.clamp(orbit.phi, controls.minPolarAngle, controls.maxPolarAngle);
    orbit.radius = THREE.MathUtils.clamp(orbit.radius, controls.minDistance, controls.maxDistance);
    camera.position.setFromSpherical(orbit).add(controls.target);
    controls.update();
  });

  resize();
  setMaturity(0);
  for (const control of [slider, play, cycle, reset]) control.disabled = false;
  document.querySelector('#scene-status').hidden = true;
}

init().catch(error => {
  console.error(error);
  document.querySelector('#scene-status').textContent =
    'Model se nepodařilo načíst. Zkontroluj podporu WebGL v Chromu a obnov stránku.';
});
