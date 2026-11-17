import * as THREE from 'three';

const MODEL_URL = new URL('../web_assets/ptak/sojka.glb?v=anatomy', import.meta.url).href;
const MASK_URL = new URL('../web_assets/ptak/sojka-alfa.svg?v=feathers', import.meta.url).href;
const LENGTH = 0.35;
const FOLDED_WING = 0.94;
const BIRDS = [
  { angle: -0.68, distance: 0.74, size: 1, delay: 0, bend: -1 },
  { angle: 0.15, distance: 0.85, size: 0.91, delay: 19, bend: 1 },
  { angle: 0.92, distance: 0.95, size: 0.95, delay: 37, bend: 1 }
];
// Scene visibility ranges in °C, from the most to the least tolerant visitor.
const FORAGING_RANGES = [[-14, 36], [-8, 32], [-2, 27]];
const FULL_TURN = 2 * Math.PI;
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

class OrbitFlight extends THREE.Curve {
  constructor(from, to, radius, bend) {
    super();
    this.from = from;
    this.to = to;
    this.radius = radius;
    this.startAngle = Math.atan2(from.z, from.x);
    this.startRadius = Math.hypot(from.x, from.z);
    this.endRadius = Math.hypot(to.x, to.z);
    const endAngle = Math.atan2(to.z, to.x);
    const sweep = THREE.MathUtils.euclideanModulo(bend * (endAngle - this.startAngle), FULL_TURN);
    this.sweep = bend * (sweep < 0.78 * FULL_TURN ? sweep + FULL_TURN : sweep);
    this.climbing = to.y > from.y;
  }

  getPoint(t, target = new THREE.Vector3()) {
    if (t === 0) return target.copy(this.from);
    if (t === 1) return target.copy(this.to);
    const { lerp, smoothstep } = THREE.MathUtils;
    // Gain speed on the low arc, climb outside the crown, then turn in to land.
    const angle = this.startAngle + this.sweep * t;
    const outside = lerp(this.startRadius, this.radius, smoothstep(t, 0, 0.20));
    const radius = lerp(outside, this.endRadius, smoothstep(t, 0.83, 1));
    const altitude = lerp(this.from.y, this.to.y, smoothstep(t, 0.17, 0.83));
    const lift = (this.climbing ? 0.55 : 0.8) * smoothstep(t, 0, 0.15) * (1 - smoothstep(t, 0.28, 0.48));
    const clearance = (this.climbing ? 0.8 : 0.4) * smoothstep(t, 0.64, 0.82) * (1 - smoothstep(t, 0.86, 1));
    return target.set(Math.cos(angle) * radius, altitude + lift + clearance, Math.sin(angle) * radius);
  }
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
  return new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.11), new THREE.ShaderMaterial({
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

function lowestFoot(leg, angle) {
  const points = leg.geometry.attributes.position;
  const sin = Math.sin(angle), cos = Math.cos(angle);
  let lowest = Infinity;
  for (let i = 0; i < points.count; i++) {
    lowest = Math.min(lowest, points.getX(i) * sin + points.getY(i) * cos);
  }
  return lowest;
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
  const legRestA = legA.position.y;
  const legRestB = legB.position.y;
  const soleA = lowestFoot(legA, 0);
  const soleB = lowestFoot(legB, 0);
  const bodyRest = body.position.y;

  const tangent = new THREE.Vector3();
  const ahead = new THREE.Vector3();
  let route, cycle, elapsed, perchStep = -1;
  return {
    bird,
    shadow,
    get canRoost() { return perchStep >= 0; },
    setRoute(angle, radius, orbitRadius, perch) {
      const { bend, distance, delay } = config;
      const start = ground(angle - bend * 0.31, radius * distance);
      const forage = ground(angle, radius * (distance - 0.15));
      const end = ground(angle + bend * 0.40, radius * (distance + 0.05));
      const move = (kind, from, to, seconds, path = null) => {
        const dir = path ? path.getTangent(0, tangent) : tangent.subVectors(to, from);
        return { kind, from, to, seconds, path, yaw: heading(dir.x, dir.z) };
      };
      const fly = (from, to) => {
        const path = new OrbitFlight(from, to, orbitRadius, bend);
        return move('fly', from, to, path.getLength() / (5.7 + index * 0.22), path);
      };
      route = [
        move('walk', start, forage, 5.5),
        move('peck', forage, end, 4),
        move('walk', forage, end, 4.5)
      ];
      perchStep = perch ? route.length + 1 : -1;
      if (perch) route.push(
        fly(end, perch),
        move('rest', perch, start, 11 + index * 2),
        fly(perch, start)
      );
      else route.push(move('walk', end, start, 8));
      route.push(move('rest', start, forage, 5 + index));
      cycle = route.reduce((sum, action) => sum + action.seconds, 0);
      elapsed = delay % cycle;
    },
    update(still, delta, roosting) {
      if (!still && !roosting) elapsed = (elapsed + delta) % cycle;
      let time = still || roosting ? 0 : elapsed;
      const step = roosting ? perchStep : route.findIndex(action => {
        if (time < action.seconds) return true;
        time -= action.seconds;
        return false;
      });
      const { kind, from, to, seconds, path, yaw } = route[step];
      const t = time / seconds;
      const walking = kind === 'walk' && !still;
      const flight = Boolean(path);
      const stepPhase = time * Math.PI * 2.8;
      const stepAmount = walking ? Math.min(1, time * 5, (seconds - time) * 5) : 0;
      const stride = Math.sin(stepPhase) * stepAmount;
      const dip = kind === 'peck' ? Math.max(0, Math.sin(time * Math.PI * 2.8)) ** 5 * 0.62 : 0;
      const previous = route[(step + route.length - 1) % route.length];
      const prevTangent = previous.path?.getTangent(1, tangent);
      const prevYaw = prevTangent ? heading(prevTangent.x, prevTangent.z) : previous.yaw;
      const turn = turnBetween(prevYaw, yaw);
      bird.position.copy(from);
      bird.rotation.y = still ? yaw : prevYaw + turn * THREE.MathUtils.smoothstep(time, 0, 0.42);
      pose.rotation.set(0, 0, 0);
      if (walking) bird.position.lerp(to, t);
      if (kind === 'rest') bird.rotation.y += Math.sin(time * 0.85) * 0.23;
      let spread = 0, flap = 0, recovery = 0, tucked = 0, reach = 0, flare = 0;
      if (flight) {
        const progress = THREE.MathUtils.smoothstep(t, 0, 1);
        path.getPointAt(progress, bird.position);
        path.getTangentAt(progress, tangent);
        path.getTangentAt(Math.min(1, progress + 0.025), ahead);
        const flightYaw = heading(tangent.x, tangent.z);
        const yawAhead = heading(ahead.x, ahead.z);
        const curve = turnBetween(flightYaw, yawAhead);
        bird.rotation.y = prevYaw + turnBetween(prevYaw, flightYaw) * THREE.MathUtils.smoothstep(t, 0, 0.08);
        const airborne = Math.sin(t * Math.PI);
        flare = THREE.MathUtils.smoothstep(t, 0.78, 0.94) * (1 - THREE.MathUtils.smoothstep(t, 0.94, 1));
        pose.rotation.x = THREE.MathUtils.clamp(curve * 2.5, -0.36, 0.36) * airborne;
        pose.rotation.z = THREE.MathUtils.clamp(Math.asin(tangent.y), -0.52, 0.64) * Math.min(1, airborne * 3)
          + flare * 0.34;
        tucked = THREE.MathUtils.smoothstep(t, 0.03, 0.16) * (1 - THREE.MathUtils.smoothstep(t, 0.76, 0.94));
        reach = flare;
        spread = THREE.MathUtils.smoothstep(t, 0, 0.12) * (1 - THREE.MathUtils.smoothstep(t, 0.91, 1));
        const glide = THREE.MathUtils.smoothstep(t, 0.53, 0.68) * (1 - THREE.MathUtils.smoothstep(t, 0.80, 0.91));
        const beat = (time * (4.6 + 0.22 * index) + index / 3) % 1;
        const downstroke = beat < 0.42;
        const strokePhase = downstroke ? beat / 0.42 : (beat - 0.42) / 0.58;
        const stroke = Math.cos(Math.PI * strokePhase) * (downstroke ? -1 : 1);
        flap = stroke * (0.76 - glide * 0.66) - flare * 0.14;
        recovery = downstroke ? 0 : Math.sin(Math.PI * strokePhase) * (1 - glide);
      }

      const settle = !still && !roosting && !flight && previous.path && time < 0.35
        ? Math.sin(Math.PI * time / 0.35) : 0;
      body.position.y = bodyRest + Math.abs(stride) * 0.035 - settle * 0.085;
      body.rotation.z = -dip + stride * 0.045;
      tail.rotation.z = -flare * 0.24 + dip * 0.25 + stride * 0.075;
      tail.scale.z = 1 + flare * 0.30;
      legA.rotation.z = flight ? -tucked * 0.78 + reach * 0.36 : stride * 0.25;
      legB.rotation.z = flight ? legA.rotation.z : -stride * 0.25;
      const swing = Math.cos(stepPhase) * stepAmount;
      legA.position.y = legRestA - (flight ? 0 : lowestFoot(legA, legA.rotation.z) - soleA)
        + Math.max(0, swing) * 0.14 + tucked * 0.15;
      legB.position.y = legRestB - (flight ? 0 : lowestFoot(legB, legB.rotation.z) - soleB)
        + Math.max(0, -swing) * 0.14 + tucked * 0.15;
      const wingPitch = THREE.MathUtils.lerp(FOLDED_WING, flap, spread);
      const sweepBack = THREE.MathUtils.lerp(0.34, 0.06 + recovery * 0.29, spread);
      const wingSpan = THREE.MathUtils.lerp(0.34, 1 - recovery * 0.17, spread);
      wingA.rotation.set(wingPitch, -sweepBack, recovery * 0.13, 'YXZ');
      wingB.rotation.set(-wingPitch, sweepBack, recovery * 0.13, 'YXZ');
      wingA.scale.z = wingB.scale.z = wingSpan;

      bird.visible = true;
      shadow.visible = bird.position.y < 0.12;
      if (shadow.visible) {
        shadow.position.set(bird.position.x - 0.01, 0.008, bird.position.z);
        shadow.rotation.z = bird.rotation.y;
      }
    }
  };
}

export function createTreeBird({ scene, loader, textureLoader, camera, lighting, reducedMotion }) {
  let flock, loading = false, failed = false, attached, roostingBird;
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
    update(active, branches, delta, airTemperature, sunElevation) {
      let visibleCount = 0;
      for (const [low, high] of FORAGING_RANGES) {
        if (!(airTemperature >= low && airTemperature <= high)) break;
        visibleCount++;
      }
      if (!active || !branches?.visible || visibleCount === 0) {
        for (const { bird, shadow } of flock || []) bird.visible = shadow.visible = false;
        return;
      }
      if (!flock) { load(); return; }
      if (attached !== branches) {
        branches.updateWorldMatrix(true, false);
        const box = new THREE.Box3().setFromObject(branches);
        const radius = Math.max(3, Math.min(box.max.x - box.min.x, box.max.z - box.min.z) * 0.5);
        const orbitRadius = Math.hypot(
          Math.max(Math.abs(box.min.x), Math.abs(box.max.x)),
          Math.max(Math.abs(box.min.z), Math.abs(box.max.z))
        ) + 1.0;
        const centerAngle = Math.atan2(camera.position.z, camera.position.x);
        const occupied = [];
        flock.forEach((bird, index) => {
          const angle = centerAngle + BIRDS[index].angle;
          const perch = findPerch(branches, box, angle, radius, occupied);
          if (perch) occupied.push(perch);
          bird.setRoute(angle, radius, orbitRadius + index * 0.45, perch);
        });
        roostingBird = flock.find(bird => bird.canRoost);
        attached = branches;
      }
      const night = sunElevation <= 0;
      const pace = 0.45 + 0.55 * THREE.MathUtils.smoothstep(sunElevation, 0, 10);
      flock.forEach((pose, index) => {
        if (night ? pose === roostingBird : index < visibleCount) {
          pose.update(reducedMotion.matches, delta * pace, night);
        } else {
          pose.bird.visible = pose.shadow.visible = false;
        }
      });
    }
  };
}
