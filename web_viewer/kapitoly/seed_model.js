import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const PARTS = 3;
const HEIGHT = 2.3;
const OPEN_START = 0.42;
const OPEN_ANGLE = 54;
const SEED_DETAILS = [
  { file: '1.png', crop: [40, 32, 22, 36], height: 0.31, direction: 0.17, release: 0.84, land: 0.97, distance: 1.95 },
  { file: '2.png', crop: [36, 30, 24, 30], height: 0.27, direction: 2.33, release: 0.88, land: 1, distance: 1.75 }
];

function openingAt(maturity) {
  return OPEN_ANGLE * THREE.MathUtils.smoothstep(maturity, OPEN_START, 1);
}

function makeOuterMaterial(map, ripeness) {
  const material = new THREE.MeshStandardMaterial({
    map, roughness: 0.88, side: THREE.DoubleSide, alphaToCoverage: true
  });
  material.onBeforeCompile = shader => {
    shader.uniforms.seedRipeness = ripeness;
    shader.fragmentShader = 'uniform float seedRipeness;\n' +
      shader.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
        float seedAlpha = diffuseColor.a;
        vec3 shellColor = texture2D(map, vec2(0.5)).rgb;
        diffuseColor.rgb = mix(shellColor, diffuseColor.rgb, smoothstep(0.0, 0.8, seedAlpha));
        diffuseColor.a = smoothstep(0.02, 0.9, seedAlpha);
        if (diffuseColor.a <= 0.0) discard;
        float seedTone = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
        vec3 greenSeed = seedTone * vec3(0.72, 1.75, 0.33);
        diffuseColor.rgb = mix(greenSeed, diffuseColor.rgb, seedRipeness);`
      ).replace('#include <opaque_fragment>', '#undef OPAQUE\n#include <opaque_fragment>');
  };
  return material;
}

function makeSeed(map, details, anisotropy) {
  const [left, top, cropWidth, cropHeight] = details.crop;
  const { width, height } = map.image;
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = anisotropy;
  map.offset.set(left / width, 1 - (top + cropHeight) / height);
  map.repeat.set(cropWidth / width, cropHeight / height);

  const seedWidth = details.height * cropWidth / cropHeight;
  const geometry = new THREE.PlaneGeometry(seedWidth, details.height);
  const material = makeOuterMaterial(map, { value: 1 });
  const seed = new THREE.Group();
  const cross = new THREE.Mesh(geometry, material);
  cross.rotation.y = Math.PI / 2;
  seed.add(new THREE.Mesh(geometry, material), cross);
  return { seed, width: seedWidth, ...details };
}

function poseSeed({ seed, width, height, direction, release, land, distance }, maturity, groundY, highlight) {
  const fall = THREE.MathUtils.clamp((maturity - release) / (land - release), 0, 1);
  const radius = THREE.MathUtils.lerp(0.14, distance, THREE.MathUtils.smoothstep(fall, 0, 0.9));
  const roll = Math.PI * 2.5 * fall;
  const size = highlight && maturity >= release ? 2 : 1;
  seed.scale.setScalar(size);
  const clearance = size * (Math.abs(Math.sin(roll)) * width + Math.abs(Math.cos(roll)) * height) / 2;
  // Clear the shell first, then fall from the branch to the ground.
  const descent = THREE.MathUtils.clamp((fall - 0.25) / 0.75, 0, 1);
  seed.position.set(
    radius * Math.cos(direction),
    Math.max(groundY + clearance, 0.72 * (1 - fall * fall) + groundY * descent * descent),
    radius * Math.sin(direction)
  );
  seed.rotation.set(0, direction + fall * Math.PI, roll, 'YXZ');
}

const assetsUrl = new URL('../web_assets/semena/', import.meta.url);
const shellFiles = ['1.png', '2.png', '3.png', '4.png'];

export async function loadSeedAssets(anisotropy) {
  const loader = new THREE.TextureLoader();
  const loadTexture = file => loader.loadAsync(new URL(file, assetsUrl).href);
  const [model, maps, seedMaps] = await Promise.all([
    new GLTFLoader().loadAsync(new URL('kvet.glb', assetsUrl).href),
    Promise.all(shellFiles.map(loadTexture)),
    Promise.all(SEED_DETAILS.map(({ file }) => loadTexture(`smena/${file}`)))
  ]);
  for (const map of maps) {
    map.colorSpace = THREE.SRGBColorSpace;
    map.flipY = false;
    map.anisotropy = anisotropy;
  }

  const source = model.scene;
  source.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(source);
  const scale = HEIGHT / (bounds.max.y - bounds.min.y);
  const panels = [];
  source.traverse(object => {
    if (!object.isMesh) return;
    // The export places the shared bottom tip at the model origin.
    const geometry = object.geometry.clone().applyMatrix4(object.matrixWorld);
    geometry.scale(scale, scale, scale);
    geometry.computeBoundingBox();
    const center = geometry.boundingBox.getCenter(new THREE.Vector3());
    const axis = new THREE.Vector3(center.z, 0, -center.x).normalize();
    panels.push({ geometry, axis });
  });
  if (panels.length !== PARTS) throw new Error('Model must contain three parts');
  const seeds = seedMaps.map((map, index) => makeSeed(map, SEED_DETAILS[index], anisotropy));
  return { maps, panels, seeds };
}

export function createSeedModel({ maps, panels, seeds }, textureOffset = 0) {
  const group = new THREE.Group();
  const ripeness = { value: 0 };
  const shells = panels.map(({ geometry }, index) =>
    new THREE.Mesh(geometry, makeOuterMaterial(maps[(index + textureOffset) % maps.length], ripeness))
  );
  const kernels = seeds.map(details => ({ ...details, seed: details.seed.clone() }));
  group.add(...shells, ...kernels.map(({ seed }) => seed));

  return {
    group,
    setTextureOffset(offset) {
      shells.forEach((shell, index) => { shell.material.map = maps[(index + offset) % maps.length]; });
    },
    setMaturity(amount, { groundY = -0.025, highlight = false, settled = false, showShell = true } = {}) {
      const angle = openingAt(amount);
      const growth = THREE.MathUtils.lerp(0.12, 1, THREE.MathUtils.smoothstep(amount, 0, 0.65));
      group.scale.setScalar(growth);
      ripeness.value = THREE.MathUtils.smoothstep(amount, 0, 1);
      shells.forEach((shell, index) => {
        shell.visible = showShell;
        shell.quaternion.setFromAxisAngle(panels[index].axis, THREE.MathUtils.degToRad(angle));
      });
      for (const kernel of kernels) poseSeed(kernel, settled ? 1 : amount, groundY / growth, highlight);
      return angle;
    }
  };
}
