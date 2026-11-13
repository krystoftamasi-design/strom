import * as THREE from 'three';

const MODEL_URL = new URL('../web_assets/ptak/sojka.glb?v=wings', import.meta.url).href;
const MASK_URL = new URL('../web_assets/ptak/sojka-alfa.svg', import.meta.url).href;
const LENGTH = 1.4;
const FOLDED_WING = 0.86;
const ground = (angle, radius) => new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
const heading = (x, z) => Math.atan2(-z, x); // The beak points along +X.
const face = ({ from, to }) => heading(to.x - from.x, to.z - from.z);

function findPerch(branches, angle, radius) {
  branches.updateWorldMatrix(true, false);
  const box = new THREE.Box3().setFromObject(branches);
  const ray = new THREE.Raycaster();
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(branches.matrixWorld);
  const normal = new THREE.Vector3();
  let best, bestScore = Infinity;
  // Probe the camera side of the crown. Favor usable branches below the top
  // foliage, away from the trunk, with an upward-facing landing surface.
  for (const offset of [0, -0.34, 0.34, -0.68, 0.68, -1.02, 1.02]) {
    for (const distance of [0.41, 0.55, 0.69, 0.27]) {
      const origin = ground(angle + offset, radius * distance);
      origin.y = box.max.y + 1;
      ray.set(origin, new THREE.Vector3(0, -1, 0));
      for (const hit of ray.intersectObject(branches, false)) {
        const level = (hit.point.y - box.min.y) / (box.max.y - box.min.y);
        if (level < 0.35 || level > 0.82 || !hit.face) continue;
        if (normal.copy(hit.face.normal).applyNormalMatrix(normalMatrix).y < 0.48) continue;
        const score = Math.abs(level - 0.51) * 3 + Math.abs(offset) * 0.35 + Math.abs(distance - 0.55);
        if (score >= bestScore) continue;
        bestScore = score;
        best = hit.point;
      }
    }
  }
  return best;
}

function stylize(material, mask, lighting) {
  const result = new THREE.MeshLambertMaterial({
    map: material.map,
    alphaMap: mask,
    alphaToCoverage: true,
    side: THREE.DoubleSide
  });
  result.onBeforeCompile = shader => {
    shader.uniforms.uBirdSun = lighting.uSunDirection;
    shader.uniforms.uBirdIllumination = lighting.uSceneIllumination;
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform vec3 uBirdSun;
        uniform float uBirdIllumination;`)
      .replace('#include <shadowmap_pars_fragment>', '#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>')
      .replace('#include <alphamap_fragment>', `
        #include <alphamap_fragment>
        float edgeWidth = clamp(fwidth(diffuseColor.a), 0.05, 0.45);
        diffuseColor.a = smoothstep(0.5 - edgeWidth, 0.5 + edgeWidth, diffuseColor.a);
        if (diffuseColor.a <= 0.0) discard;`)
      .replace('#include <opaque_fragment>', `
        float facing = dot(normalize(normal), normalize(mat3(viewMatrix) * uBirdSun));
        float band = 0.56 + 0.21 * smoothstep(-0.20, -0.12, facing)
                          + 0.23 * smoothstep(0.38, 0.46, facing);
        float daylight = clamp(uBirdIllumination / 2.7, 0.0, 1.0);
        vec3 plumage = mix(vec3(dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722))), diffuseColor.rgb, 0.87);
        outgoingLight = plumage * mix(vec3(0.13, 0.17, 0.25), vec3(band * mix(0.62, 1.0, getShadowMask())), daylight);
        #undef OPAQUE
        #include <opaque_fragment>`);
  };
  return result;
}

export function createTreeBird({ scene, loader, textureLoader, camera, lighting, reducedMotion }) {
  const bird = new THREE.Group();
  const pose = new THREE.Group();
  bird.name = 'Sojka';
  bird.visible = false;
  bird.add(pose);
  scene.add(bird);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.42), new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { opacity: { value: 0.13 } },
    vertexShader: `varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec2 vUv;
      uniform float opacity;
      void main() { gl_FragColor = vec4(0.15, 0.13, 0.12, opacity * (1.0 - smoothstep(0.05, 0.5, distance(vUv, vec2(0.5))))); }`
  }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.visible = false;
  scene.add(shadow);

  let parts, loading = false, failed = false;
  let attached, route, step = 0, elapsed = 0;
  function load() {
    if (loading || failed) return;
    loading = true;
    Promise.all([loader.loadAsync(MODEL_URL), textureLoader.loadAsync(MASK_URL)]).then(([{ scene: model }, mask]) => {
      const nodes = ['Body', 'Tail', 'LegA', 'LegB', 'Beak', 'WingA', 'WingB'].map(name => model.getObjectByName(name));
      if (nodes.some(node => !node?.isMesh)) throw new Error('V modelu chybí část sojky.');
      const box = new THREE.Box3().setFromObject(model);
      const scale = LENGTH / (box.max.x - box.min.x);
      model.scale.setScalar(scale);
      model.position.y = -box.min.y * scale;
      const [body, tail, legA, legB, beak, wingA, wingB] = nodes;
      mask.flipY = false; // Use the same glTF UVs as the plumage texture.
      mask.needsUpdate = true;
      const material = stylize(body.material, mask, lighting);
      for (const node of nodes) {
        node.material = material;
        node.receiveShadow = true;
      }
      // All four parts follow the torso and retain their own joint pivots.
      model.updateMatrixWorld(true);
      for (const node of [tail, beak, wingA, wingB]) body.attach(node);
      pose.add(model);
      parts = { body, tail, legA, legB, wingA, wingB };
    }).catch(error => {
      failed = true;
      console.warn('Model sojky se nepodařilo načíst.', error);
    }).finally(() => { loading = false; });
  }

  function setRoute(branches) {
    const box = new THREE.Box3().setFromObject(branches);
    const angle = Math.atan2(camera.position.z, camera.position.x);
    const radius = Math.max(3, Math.min(box.max.x - box.min.x, box.max.z - box.min.z) * 0.5);
    const start = ground(angle - 0.52, radius * 0.62);
    const forage = ground(angle + 0.11, radius * 0.51);
    const end = ground(angle + 0.59, radius * 0.64);
    const perch = findPerch(branches, angle, radius);
    route = [
      { kind: 'walk', from: start, to: forage, seconds: 5 },
      { kind: 'peck', from: forage, to: end, seconds: 4 },
      { kind: 'walk', from: forage, to: end, seconds: 4 }
    ];
    if (perch) route.push(
      { kind: 'fly', from: end, to: perch, seconds: 3.8 },
      { kind: 'rest', from: perch, to: start, seconds: 12 },
      { kind: 'fly', from: perch, to: start, seconds: 4.2 }
    );
    else route.push({ kind: 'walk', from: end, to: start, seconds: 7 });
    route.push({ kind: 'rest', from: start, to: forage, seconds: 6 });
    attached = branches;
    step = elapsed = 0;
  }

  return {
    update(active, branches, delta) {
      bird.visible = shadow.visible = false;
      if (!active || !branches?.visible) return;
      if (!parts) { load(); return; }
      if (attached !== branches) setRoute(branches);
      const still = reducedMotion.matches;
      if (!still) elapsed += delta;
      while (elapsed >= route[step].seconds) {
        elapsed -= route[step].seconds;
        step = (step + 1) % route.length;
      }
      const { kind, from, to, seconds } = route[still ? 0 : step];
      const t = still ? 0 : elapsed / seconds;
      const walking = kind === 'walk' && !still;
      const flight = kind === 'fly' && !still;
      const stride = walking ? Math.sin(elapsed * Math.PI * 5.6) : 0;
      const approach = Math.sin(Math.PI * t);
      const dip = kind === 'peck' ? Math.max(0, Math.sin(elapsed * Math.PI * 2.8)) ** 5 * 0.62 : 0;
      const yaw = face(route[still ? 0 : step]);
      const previousYaw = face(route[(step + route.length - 1) % route.length]);
      const turn = THREE.MathUtils.euclideanModulo(yaw - previousYaw + Math.PI, 2 * Math.PI) - Math.PI;
      bird.position.copy(from);
      if (walking || flight) bird.position.lerp(to, flight ? THREE.MathUtils.smoothstep(t, 0, 1) : t);
      if (flight) bird.position.y += approach * 2.2;
      if (walking) bird.position.y += Math.abs(stride) * 0.043;
      bird.rotation.y = still ? yaw : previousYaw + turn * THREE.MathUtils.smoothstep(elapsed, 0, 0.42);
      if (kind === 'rest' && !still) bird.rotation.y += Math.sin(elapsed * 0.85) * 0.23;
      pose.rotation.z = flight ? Math.atan2(to.y - from.y, from.distanceTo(to) + 0.01) * approach * 0.7 : 0;
      parts.body.rotation.z = -dip + stride * 0.045;
      parts.tail.rotation.z = still ? 0 : Math.sin(elapsed * (flight ? 14 : 3.4)) * (flight ? 0.18 : 0.07);
      parts.legA.rotation.z = flight ? -approach * 0.95 : stride * 0.34;
      parts.legB.rotation.z = flight ? -approach * 0.95 : -stride * 0.34;
      const spread = flight ? THREE.MathUtils.smoothstep(Math.min(t, 1 - t), 0, 0.16) : 0;
      const flap = Math.sin(elapsed * Math.PI * 11) * 0.62;
      parts.wingA.rotation.x = THREE.MathUtils.lerp(FOLDED_WING, flap, spread);
      parts.wingB.rotation.x = -parts.wingA.rotation.x;
      bird.visible = true;
      shadow.visible = !flight && from.y < 0.01;
      if (shadow.visible) {
        shadow.position.set(bird.position.x - 0.04, 0.008, bird.position.z);
        shadow.rotation.z = bird.rotation.y;
      }
    }
  };
}
