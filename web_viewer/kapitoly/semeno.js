import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const PARTS = 3;
const ROWS = 36;
const COLUMNS = 24;
const HEIGHT = 2.3;
const SECTOR = 2 * Math.PI / PARTS;
const OPEN_START = 0.42;
const OPEN_ANGLE = 54;
const PLAY_DURATION = 6000;

function openingAt(maturity) {
  return OPEN_ANGLE * THREE.MathUtils.smoothstep(maturity, OPEN_START, 1);
}

function makeShellGeometry() {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const uvs = [];
  const indices = [];
  const stride = COLUMNS + 1;
  const surfaceSize = (ROWS + 1) * stride;

  function addQuad(a, b, c, d, reverse) {
    if (reverse) indices.push(a, c, b, b, c, d);
    else indices.push(a, b, c, b, d, c);
  }

  for (const inner of [false, true]) {
    const offset = inner ? surfaceSize : 0;
    const groupStart = indices.length;
    for (let row = 0; row <= ROWS; row++) {
      const t = row / ROWS;
      const profile = row === 0 || row === ROWS ? 0 : Math.sin(Math.PI * t);
      const thickness = inner ? 0.055 : 0;
      const radius = profile * (0.92 * (0.58 + 0.62 * t) - thickness);
      for (let column = 0; column <= COLUMNS; column++) {
        const u = column / COLUMNS;
        const angle = (u - 0.5) * SECTOR;
        positions.push(radius * Math.sin(angle), t * HEIGHT, radius * Math.cos(angle));
        uvs.push(u, t);
        if (row < ROWS && column < COLUMNS) {
          const a = offset + row * stride + column;
          addQuad(a, a + 1, a + stride, a + stride + 1, inner);
        }
      }
    }
    geometry.addGroup(groupStart, indices.length - groupStart, inner ? 1 : 0);
  }

  // Close the two long edges with separate vertices so the rims keep sharp normals.
  const rimStart = indices.length;
  for (const column of [0, COLUMNS]) {
    const rimOffset = positions.length / 3;
    for (let row = 0; row <= ROWS; row++) {
      const outer = row * stride + column;
      for (const index of [outer, outer + surfaceSize]) {
        positions.push(...positions.slice(index * 3, index * 3 + 3));
        uvs.push(0, row / ROWS);
      }
      if (row < ROWS) {
        const a = rimOffset + 2 * row;
        addQuad(a, a + 1, a + 2, a + 3, column === COLUMNS);
      }
    }
  }
  geometry.addGroup(rimStart, indices.length - rimStart, 2);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

async function makeTexture(img, anisotropy) {
  await img.decode();
  const source = document.createElement('canvas');
  source.width = img.naturalWidth;
  source.height = img.naturalHeight;
  const sourceContext = source.getContext('2d');
  sourceContext.drawImage(img, 0, 0);
  const { width, height } = source;
  const { data } = sourceContext.getImageData(0, 0, width, height);
  const rows = [];

  // Fit the painted body to the shell and keep its transparent margin out of the seams.
  for (let y = 0; y < height; y++) {
    let left = width;
    let right = -1;
    for (let x = 0; x < width; x++) {
      if (data[4 * (y * width + x) + 3] >= 205) {
        left = Math.min(left, x);
        right = x;
      }
    }
    if (right - left >= 8) rows.push({ y, left, width: right - left + 1 });
  }
  if (!rows.length) throw new Error('Seed texture has no opaque area');

  const surface = document.createElement('canvas');
  surface.width = surface.height = 128;
  const context = surface.getContext('2d', { alpha: false });
  context.fillStyle = '#925122';
  context.fillRect(0, 0, surface.width, surface.height);
  for (let y = 0; y < surface.height; y++) {
    const row = rows[Math.round(y * (rows.length - 1) / (surface.height - 1))];
    context.drawImage(source, row.left, row.y, row.width, 1, 0, y, surface.width, 1);
  }
  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  return texture;
}

function makeOuterMaterial(map, ripeness) {
  const material = new THREE.MeshStandardMaterial({ map, roughness: 0.88 });
  material.onBeforeCompile = shader => {
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
  const maps = await Promise.all(swatches.map(swatch => makeTexture(swatch.querySelector('img'), anisotropy)));

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

  const geometry = makeShellGeometry();
  const ripeness = { value: 0 };
  const inside = new THREE.MeshStandardMaterial({ roughness: 0.92 });
  const rim = new THREE.MeshStandardMaterial({ roughness: 0.92 });
  const insideColors = [new THREE.Color('#78924e'), new THREE.Color('#985a32')];
  const rimColors = [new THREE.Color('#9db768'), new THREE.Color('#bb8255')];
  const shells = [];
  for (let index = 0; index < PARTS; index++) {
    const base = new THREE.Group();
    base.rotation.y = index * SECTOR;
    const shell = new THREE.Mesh(geometry, [makeOuterMaterial(maps[index], ripeness), inside, rim]);
    base.add(shell);
    scene.add(base);
    shells.push(shell);
  }

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
    inside.color.copy(insideColors[0]).lerp(insideColors[1], ripeness.value);
    rim.color.copy(rimColors[0]).lerp(rimColors[1], ripeness.value);
    for (const shell of shells) shell.rotation.x = THREE.MathUtils.degToRad(angle);
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
      if (!reserve) shells[part].material[0].map = maps[index];
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
