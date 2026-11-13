import * as THREE from 'three';

const MODEL_URL = new URL('../web_assets/ptak/sojka.glb?v=flock', import.meta.url).href;
const MASK_URL = new URL('../web_assets/ptak/sojka-alfa.svg?v=feathers', import.meta.url).href;
const LENGTH = 1.4;
const FOLDED_WING = 0.86;
const BIRDS = [
  { angle: -0.68, distance: 0.74, size: 1, delay: 0, bend: -1 },
  { angle: 0.15, distance: 0.85, size: 0.91, delay: 15, bend: 1 },
  { angle: 0.92, distance: 0.95, size: 0.95, delay: 29, bend: 1 }
];
const ground = (angle, radius) => new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
const heading = (x, z) => Math.atan2(-z, x); // The beak points along +X.
const turnBetween = (from, to) => THREE.MathUtils.euclideanModulo(to - from + Math.PI, 2 * Math.PI) - Math.PI;

function findPerch(branches, box, angle, radius, occupied) {
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
        if (level < 0.35 || level > 0.82 || !hit.face ||
            occupied.some(point => point.distanceToSquared(hit.point) < 2.25)) continue;
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

function flightPath(from, to, radius, bend) {
  const climbing = to.y > from.y;
  // Sweep out from the trunk, climb or descend beside the canopy, then turn
  // back in. The final control point stays above the landing point.
  const departure = ground(Math.atan2(from.z, from.x) + bend * 0.65, radius * 1.75);
  const approach = ground(Math.atan2(to.z, to.x) + bend * 0.92, radius * 1.55);
  departure.y = from.y + (climbing ? 0.7 : 0.9);
  approach.y = to.y + (climbing ? 2.9 : 1.0);
  return new THREE.CubicBezierCurve3(from, departure, approach, to);
}

function stylize(material, mask, lighting, { plumageRamp, plumageBump }) {
  if (!Array.isArray(plumageRamp) || plumageRamp.length !== 12 || !plumageRamp.every(Number.isFinite)) {
    throw new Error('V modelu chybí barevná paleta sojky.');
  }
  const result = new THREE.MeshLambertMaterial({
    map: material.map,
    alphaMap: mask,
    alphaToCoverage: true,
    bumpMap: material.map,
    bumpScale: plumageBump,
    side: THREE.DoubleSide
  });
  const stops = [0, 4, 8].map(index => new THREE.Vector4(...plumageRamp.slice(index, index + 4)));
  result.onBeforeCompile = shader => {
    shader.uniforms.uBirdSun = lighting.uSunDirection;
    shader.uniforms.uBirdIllumination = lighting.uSceneIllumination;
    shader.uniforms.uPlumageRamp = { value: stops };
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform vec3 uBirdSun;
        uniform float uBirdIllumination;
        uniform vec4 uPlumageRamp[3];`)
      .replace('#include <shadowmap_pars_fragment>', '#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>')
      .replace('#include <alphamap_fragment>', `
        #include <alphamap_fragment>
        float edgeWidth = clamp(fwidth(diffuseColor.a), 0.12, 0.45);
        diffuseColor.a = smoothstep(0.5 - edgeWidth, 0.5 + edgeWidth, diffuseColor.a);
        if (diffuseColor.a <= 0.0) discard;`)
      .replace('#include <opaque_fragment>', `
        float facing = dot(normalize(normal), normalize(mat3(viewMatrix) * uBirdSun));
        float band = 0.44 + 0.28 * smoothstep(-0.22, -0.17, facing)
                          + 0.28 * smoothstep(0.37, 0.42, facing);
        float daylight = clamp(uBirdIllumination / 2.7, 0.0, 1.0);
        // Blender's CONSTANT ramp defines the plumage. Widen the two hard
        // thresholds only across the pixel footprint to keep them stable.
        float pigment = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
        float width = clamp(fwidth(pigment), 0.005, 0.055);
        float mid = uPlumageRamp[1].x;
        float high = uPlumageRamp[2].x;
        vec3 plumage = mix(uPlumageRamp[0].yzw, uPlumageRamp[1].yzw, smoothstep(mid - width, mid + width, pigment));
        plumage = mix(plumage, uPlumageRamp[2].yzw, smoothstep(high - width, high + width, pigment));
        vec3 skyTint = vec3(0.018, 0.024, 0.043);
        vec3 shade = mix(skyTint, plumage, band * mix(0.66, 1.0, getShadowMask()));
        outgoingLight = mix(plumage * vec3(0.13, 0.17, 0.25) + skyTint * 0.18, shade, daylight);
        #undef OPAQUE
        #include <opaque_fragment>`);
  };
  return result;
}

function createGroundShadow() {
  return new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.42), new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { opacity: { value: 0.13 } },
    vertexShader: `varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec2 vUv;
      uniform float opacity;
      void main() { gl_FragColor = vec4(0.15, 0.13, 0.12, opacity * (1.0 - smoothstep(0.05, 0.5, distance(vUv, vec2(0.5))))); }`
  }));
}

function createBirdPose(model, shadowSource, config, index) {
  const bird = new THREE.Group();
  bird.name = index === 0 ? 'Sojka' : `Sojka ${index + 1}`;
  bird.visible = false;
  const pose = new THREE.Group();
  bird.add(pose);
  pose.add(model.clone());
  pose.scale.setScalar(config.size);
  const shadow = shadowSource.clone();
  shadow.visible = false;
  shadow.rotation.x = -Math.PI / 2;
  const [body, tail, legA, legB, wingA, wingB] =
    ['Body', 'Tail', 'LegA', 'LegB', 'WingA', 'WingB'].map(name => pose.getObjectByName(name));

  const tangent = new THREE.Vector3();
  const ahead = new THREE.Vector3();
  let route, cycle, elapsed;
  return {
    bird,
    shadow,
    setRoute(angle, radius, perch) {
      const { bend, distance, delay } = config;
      const start = ground(angle - bend * 0.31, radius * distance);
      const forage = ground(angle, radius * (distance - 0.15));
      const end = ground(angle + bend * 0.40, radius * (distance + 0.05));
      const move = (kind, from, to, seconds) => {
        const path = kind === 'fly' ? flightPath(from, to, radius, bend) : null;
        const dir = path ? path.getTangent(0, tangent) : tangent.subVectors(to, from);
        return { kind, from, to, seconds, path, yaw: heading(dir.x, dir.z) };
      };
      route = [
        move('walk', start, forage, 5.5),
        move('peck', forage, end, 4),
        move('walk', forage, end, 4.5)
      ];
      if (perch) route.push(
        move('fly', end, perch, 7 + index * 0.3),
        move('rest', perch, start, 11 + index * 2),
        move('fly', perch, start, 6 + index * 0.35)
      );
      else route.push(move('walk', end, start, 8));
      route.push(move('rest', start, forage, 5 + index));
      cycle = route.reduce((sum, action) => sum + action.seconds, 0);
      elapsed = delay % cycle;
    },
    update(still, delta) {
      if (!still) elapsed = (elapsed + delta) % cycle;
      let time = still ? 0 : elapsed;
      const step = route.findIndex(action => {
        if (time < action.seconds) return true;
        time -= action.seconds;
        return false;
      });
      const { kind, from, to, seconds, path, yaw } = route[step];
      const t = time / seconds;
      const walking = kind === 'walk' && !still;
      const flight = Boolean(path);
      const stride = walking ? Math.sin(time * Math.PI * 5.6) : 0;
      const dip = kind === 'peck' ? Math.max(0, Math.sin(time * Math.PI * 2.8)) ** 5 * 0.62 : 0;
      const previous = route[(step + route.length - 1) % route.length];
      const prevTangent = previous.path?.getTangent(1, tangent);
      const prevYaw = prevTangent ? heading(prevTangent.x, prevTangent.z) : previous.yaw;
      const turn = turnBetween(prevYaw, yaw);
      bird.position.copy(from);
      bird.rotation.y = still ? yaw : prevYaw + turn * THREE.MathUtils.smoothstep(time, 0, 0.42);
      pose.rotation.set(0, 0, 0);
      if (walking) {
        bird.position.lerp(to, t);
        bird.position.y += Math.abs(stride) * 0.043;
      }
      if (kind === 'rest') bird.rotation.y += Math.sin(time * 0.85) * 0.23;
      let spread = 0, flap = 0, feetOut = 1;
      if (flight) {
        const progress = THREE.MathUtils.smoothstep(t, 0, 1);
        path.getPointAt(progress, bird.position);
        path.getTangentAt(progress, tangent);
        path.getTangentAt(Math.min(1, progress + 0.06), ahead);
        const flightYaw = heading(tangent.x, tangent.z);
        const yawAhead = heading(ahead.x, ahead.z);
        const curve = turnBetween(flightYaw, yawAhead);
        bird.rotation.y = prevYaw + turnBetween(prevYaw, flightYaw) * THREE.MathUtils.smoothstep(t, 0, 0.08);
        const airborne = Math.sin(t * Math.PI);
        const flare = THREE.MathUtils.smoothstep(t, 0.78, 0.94) * (1 - THREE.MathUtils.smoothstep(t, 0.94, 1));
        pose.rotation.x = THREE.MathUtils.clamp(curve * 2.5, -0.36, 0.36) * airborne;
        pose.rotation.z = THREE.MathUtils.clamp(Math.asin(tangent.y), -0.65, 0.85) * Math.min(1, airborne * 3)
          + flare * 0.34;
        feetOut = 1 - THREE.MathUtils.smoothstep(t, 0, 0.16) * (1 - THREE.MathUtils.smoothstep(t, 0.75, 1));
        spread = THREE.MathUtils.smoothstep(t, 0, 0.12) * (1 - THREE.MathUtils.smoothstep(t, 0.91, 1));
        const stroke = Math.sin(time * Math.PI * 10.4 + index);
        const glide = THREE.MathUtils.smoothstep(t, 0.53, 0.68) * (1 - THREE.MathUtils.smoothstep(t, 0.80, 0.91));
        flap = stroke * (0.70 - glide * 0.58) - flare * 0.16;
      }

      body.rotation.z = -dip + stride * 0.045;
      tail.rotation.z = still ? 0 : Math.sin(time * (flight ? 14 : 3.4)) * (flight ? 0.13 : 0.07);
      legA.rotation.z = flight ? -(1 - feetOut) * 0.95 : stride * 0.34;
      legB.rotation.z = flight ? legA.rotation.z : -stride * 0.34;
      wingA.rotation.x = THREE.MathUtils.lerp(FOLDED_WING, flap, spread);
      wingB.rotation.x = -wingA.rotation.x;

      bird.visible = true;
      shadow.visible = bird.position.y < 0.12;
      if (shadow.visible) {
        shadow.position.set(bird.position.x - 0.04, 0.008, bird.position.z);
        shadow.rotation.z = bird.rotation.y;
      }
    }
  };
}

export function createTreeBird({ scene, loader, textureLoader, camera, lighting, reducedMotion }) {
  let flock, loading = false, failed = false, attached;
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
      const [body, tail, , , beak, wingA, wingB] = nodes;
      mask.flipY = false; // Use the same glTF UVs as the plumage texture.
      mask.needsUpdate = true;
      const material = stylize(body.material, mask, lighting, body.userData);
      for (const node of nodes) {
        node.material = material;
        node.receiveShadow = true;
      }
      model.updateMatrixWorld(true);
      for (const node of [tail, beak, wingA, wingB]) body.attach(node);
      const shadow = createGroundShadow();
      flock = BIRDS.map((config, index) => createBirdPose(model, shadow, config, index));
      for (const { bird, shadow } of flock) scene.add(bird, shadow);
    }).catch(error => {
      failed = true;
      console.warn('Model sojky se nepodařilo načíst.', error);
    }).finally(() => { loading = false; });
  }

  return {
    update(active, branches, delta) {
      if (!active || !branches?.visible) {
        for (const { bird, shadow } of flock || []) bird.visible = shadow.visible = false;
        return;
      }
      if (!flock) { load(); return; }
      if (attached !== branches) {
        branches.updateWorldMatrix(true, false);
        const box = new THREE.Box3().setFromObject(branches);
        const radius = Math.max(3, Math.min(box.max.x - box.min.x, box.max.z - box.min.z) * 0.5);
        const centerAngle = Math.atan2(camera.position.z, camera.position.x);
        const occupied = [];
        flock.forEach((bird, index) => {
          const angle = centerAngle + BIRDS[index].angle;
          const perch = findPerch(branches, box, angle, radius, occupied);
          if (perch) occupied.push(perch);
          bird.setRoute(angle, radius, perch);
        });
        attached = branches;
      }
      for (const bird of flock) bird.update(reducedMotion.matches, delta);
    }
  };
}
