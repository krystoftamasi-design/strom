import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { applyGasLeafStyle } from '../vykreslovani/gas_material.js';

const PARTS = 3;
const HEIGHT = 2.3;
const SECTOR = 2 * Math.PI / PARTS;
const OPEN_START = 0.42;
const OPEN_ANGLE = 54;
const PLAY_DURATION = 6000;

function openingAt(maturity) {
  return OPEN_ANGLE * THREE.MathUtils.smoothstep(maturity, OPEN_START, 1);
}

function makeOuterMaterial(map, ripeness) {
  const material = applyGasLeafStyle(new THREE.MeshStandardMaterial({ map, roughness: 0.88, side: THREE.DoubleSide }));
  const addAlpha = material.onBeforeCompile;
  material.customProgramCacheKey = () => 'seed_leaf_alpha_color_v1';
  material.onBeforeCompile = shader => {
    addAlpha(shader);
    shader.uniforms.seedRipeness = ripeness;
    shader.fragmentShader = 'uniform float seedRipeness;\n' + shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#include <map_fragment>
      float seedTone = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
      vec3 greenSeed = seedTone * vec3(0.72, 1.75, 0.33);
      diffuseColor.rgb = mix(greenSeed, diffuseColor.rgb, seedRipeness);`
    );
  };
  return material;
}

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
  const loader = new THREE.TextureLoader();
  const [model, ...maps] = await Promise.all([
    new GLTFLoader().loadAsync('./web_assets/semena/kvet.glb'),
    ...swatches.map(swatch => loader.loadAsync(swatch.querySelector('img').src))
  ]);
  for (const map of maps) {
    map.colorSpace = THREE.SRGBColorSpace;
    map.flipY = false;
    map.anisotropy = anisotropy;
  }

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

  const ripeness = { value: 0 };
  const shells = [];
  const source = model.scene;
  source.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(source);
  const center = bounds.getCenter(new THREE.Vector3());
  const scale = HEIGHT / (bounds.max.y - bounds.min.y);
  source.traverse(object => {
    if (!object.isMesh) return;
    const geometry = object.geometry.clone().applyMatrix4(object.matrixWorld);
    geometry.translate(-center.x, -bounds.min.y, -center.z);
    geometry.scale(scale, scale, scale);
    geometry.computeBoundingBox();
    const partCenter = geometry.boundingBox.getCenter(new THREE.Vector3());
    const axis = new THREE.Vector3(partCenter.z, 0, -partCenter.x).normalize();
    const shell = new THREE.Mesh(geometry, makeOuterMaterial(maps[shells.length], ripeness));
    shell.userData.openAxis = axis;
    scene.add(shell);
    shells.push(shell);
  });
  if (shells.length !== PARTS) throw new Error('Model must contain three parts');

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
    const amount = value / 100;
    const angle = openingAt(amount);
    ripeness.value = THREE.MathUtils.smoothstep(amount, 0, 1);
    for (const shell of shells) {
      shell.quaternion.setFromAxisAngle(shell.userData.openAxis, THREE.MathUtils.degToRad(angle));
    }
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
    textureOffset = (textureOffset + 1) % maps.length;
    swatches.forEach((swatch, index) => {
      const part = (index - textureOffset + maps.length) % maps.length;
      const reserve = part >= PARTS;
      swatch.toggleAttribute('data-reserve', reserve);
      swatch.querySelector('span').textContent = reserve ? 'Rezerva' : `Díl ${part + 1}`;
      if (!reserve) shells[part].material.map = maps[index];
    });
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
