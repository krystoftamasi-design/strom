import * as THREE from 'three';
import { createSeedModel, loadSeedAssets } from './seed_model.js';
import { beechLeafFallProgress } from '../obdobi/beech_phenology.js';

const FLOWER_COUNT = 48;
const FLOWER_SCALE = 0.27;
const SEED_FALL_SECONDS = 3.6;
const SHELL_FALL_SECONDS = 2.4;
const LAST_RELEASE_DELAY = 0.45;

function maturityForSeason(phase) {
  if (phase < 2) return 0.42 * (phase - 0.5) / 1.5;
  return THREE.MathUtils.lerp(0.42, 0.84, THREE.MathUtils.smoothstep(phase, 2, 2.36));
}

function attachToBranches(flowers, branches) {
  branches.updateWorldMatrix(true, false);
  const bounds = new THREE.Box3().setFromObject(branches);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const targets = flowers.map((flower, index) => {
    const angle = index * 2 * Math.PI / flowers.length;
    const level = index % 3;
    const radius = 0.44 - level * 0.07;
    // The shared tip is the attachment point. Aim the seed paths out of the crown.
    flower.anchor.rotation.set(Math.PI, -angle - 1.25, 0, 'YXZ');
    return {
      anchor: flower.anchor,
      distance: Infinity,
      point: new THREE.Vector3(
        center.x + Math.cos(angle) * size.x * radius,
        bounds.min.y + size.y * (0.56 + level * 0.11),
        center.z + Math.sin(angle) * size.z * radius
      )
    };
  });
  const position = branches.geometry.attributes.position;
  const posArr = position.array;
  const e = branches.matrixWorld.elements;
  const isIdentity = e[0] === 1 && e[1] === 0 && e[2] === 0 && e[3] === 0 &&
    e[4] === 0 && e[5] === 1 && e[6] === 0 && e[7] === 0 &&
    e[8] === 0 && e[9] === 0 && e[10] === 1 && e[11] === 0 &&
    e[12] === 0 && e[13] === 0 && e[14] === 0 && e[15] === 1;
  const minY = bounds.min.y + size.y * 0.45;
  const maxY = bounds.min.y + size.y * 0.90;
  const targetCount = targets.length;
  if (posArr && position.itemSize === 3 && !position.isInterleavedBufferAttribute) {
    for (let index = 0, n = position.count; index < n; index++) {
      const i3 = index * 3;
      let vx = posArr[i3], vy = posArr[i3 + 1], vz = posArr[i3 + 2];
      if (!isIdentity) {
        const tx = e[0] * vx + e[4] * vy + e[8] * vz + e[12];
        const ty = e[1] * vx + e[5] * vy + e[9] * vz + e[13];
        const tz = e[2] * vx + e[6] * vy + e[10] * vz + e[14];
        vx = tx; vy = ty; vz = tz;
      }
      if (vy < minY || vy > maxY) continue;
      for (let t = 0; t < targetCount; t++) {
        const target = targets[t];
        const dx = vx - target.point.x;
        const dy = vy - target.point.y;
        const dz = vz - target.point.z;
        const distance = dx * dx + dy * dy + dz * dz;
        if (distance >= target.distance) continue;
        target.distance = distance;
        target.anchor.position.set(vx, vy, vz);
      }
    }
  } else {
    const vertex = new THREE.Vector3();
    for (let index = 0; index < position.count; index++) {
      vertex.fromBufferAttribute(position, index).applyMatrix4(branches.matrixWorld);
      for (const target of targets) {
        const distance = vertex.distanceToSquared(target.point);
        if (distance >= target.distance) continue;
        target.distance = distance;
        target.anchor.position.copy(vertex);
      }
    }
  }
}

export function createSeedChapter({ scene, anisotropy, reducedMotion, illumination }) {
  const display = new THREE.Group();
  display.visible = false;
  scene.add(display);
  let flowers, attachedBranches;
  let loading = false;
  let failed = false;
  let seedTime = 0, shellTime = 0;
  let lastPhase, lastHighlight, lastSettled, lastSeedTime, lastShellTime;

  return {
    update(active, seasonPosition, branches, highlight, delta) {
      const phase = ((seasonPosition % 4) + 4) % 4;
      display.visible = Boolean(active && phase >= 0.5 && branches && flowers);
      if (!active) {
        failed = false;
        seedTime = shellTime = 0;
      }
      if (phase < 0.5) seedTime = shellTime = 0;
      if (!active || !branches || phase < 0.5) return;
      if (!flowers) {
        if (loading || failed) return;
        loading = true;
        loadSeedAssets(anisotropy, illumination).then(assets => {
          flowers = Array.from({ length: FLOWER_COUNT }, (_, index) => {
            const model = createSeedModel(assets, index % assets.maps.length);
            const anchor = new THREE.Group();
            anchor.scale.setScalar(FLOWER_SCALE);
            anchor.add(model.group);
            display.add(anchor);
            return { model, anchor, delay: (index % 4) * LAST_RELEASE_DELAY / 3 };
          });
        }).catch(error => {
          failed = true;
          console.error('Model Semenace se nepodařilo načíst.', error);
        }).finally(() => { loading = false; });
        return;
      }
      const settled = reducedMotion.matches && phase >= 2;
      const seedEnd = SEED_FALL_SECONDS + LAST_RELEASE_DELAY;
      const shellEnd = SHELL_FALL_SECONDS + LAST_RELEASE_DELAY;
      if (phase < 2.4) seedTime = 0;
      else if (phase >= 3 || settled) seedTime = seedEnd;
      else seedTime = Math.min(seedTime + delta, seedEnd);

      const dropShells = phase >= 2 && beechLeafFallProgress(seasonPosition) > 0 && seedTime >= seedEnd;
      if (!dropShells) shellTime = 0;
      else shellTime = settled ? shellEnd : Math.min(shellTime + delta, shellEnd);

      if (attachedBranches !== branches) {
        attachToBranches(flowers, branches);
        attachedBranches = branches;
      } else if (phase === lastPhase && highlight === lastHighlight && settled === lastSettled &&
                 seedTime === lastSeedTime && shellTime === lastShellTime) {
        return;
      }
      lastPhase = phase;
      lastHighlight = highlight;
      lastSettled = settled;
      lastSeedTime = seedTime;
      lastShellTime = shellTime;
      for (const { model, anchor, delay } of flowers) {
        const seedFall = THREE.MathUtils.clamp((seedTime - delay) / SEED_FALL_SECONDS, 0, 1);
        const shellFall = THREE.MathUtils.clamp((shellTime - delay) / SHELL_FALL_SECONDS, 0, 1);
        const groundY = anchor.position.y / FLOWER_SCALE;
        const maturity = phase < 2.4 ? maturityForSeason(phase) : THREE.MathUtils.lerp(0.84, 1, seedFall);
        model.setMaturity(maturity, {
          groundY,
          highlight,
          settled,
          hanging: true
        });
        model.setShellFall(shellFall, groundY);
      }
    }
  };
}
