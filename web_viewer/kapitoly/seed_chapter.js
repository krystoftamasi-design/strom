import * as THREE from 'three';
import { createSeedModel, loadSeedAssets } from './seed_model.js';

const FLOWER_COUNT = 12;
const FLOWER_SCALE = 0.42;

function maturityForSeason(phase, delay) {
  if (phase < 2) return 0.42 * (phase - 0.5) / 1.5;
  const autumn = THREE.MathUtils.clamp((phase - 2 - delay) / (1 - delay), 0, 1);
  if (autumn < 0.36) return THREE.MathUtils.lerp(0.42, 0.84, autumn / 0.36);
  return THREE.MathUtils.lerp(0.84, 1, THREE.MathUtils.clamp((autumn - 0.36) / 0.58, 0, 1));
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
    flower.anchor.rotation.y = angle;
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

export function createSeedChapter({ scene, anisotropy, reducedMotion }) {
  const display = new THREE.Group();
  display.visible = false;
  scene.add(display);
  let flowers, attachedBranches;
  let loading = false;
  let failed = false;
  let lastPhase, lastHighlight, lastSettled;

  return {
    update(active, seasonPosition, branches, highlight) {
      const phase = ((seasonPosition % 4) + 4) % 4;
      display.visible = Boolean(active && phase >= 0.5 && branches && flowers);
      if (!active) failed = false;
      if (!active || !branches || phase < 0.5) return;
      if (!flowers) {
        if (loading || failed) return;
        loading = true;
        loadSeedAssets(anisotropy).then(assets => {
          flowers = Array.from({ length: FLOWER_COUNT }, (_, index) => {
            const model = createSeedModel(assets, index % assets.maps.length);
            const anchor = new THREE.Group();
            anchor.scale.setScalar(FLOWER_SCALE);
            anchor.add(model.group);
            display.add(anchor);
            return { model, anchor, delay: (index % 4) * 0.04 };
          });
        }).catch(error => {
          failed = true;
          console.error('Model Semenace se nepodařilo načíst.', error);
        }).finally(() => { loading = false; });
        return;
      }
      const settled = reducedMotion.matches && phase >= 2;
      if (attachedBranches !== branches) {
        attachToBranches(flowers, branches);
        attachedBranches = branches;
      } else if (phase === lastPhase && highlight === lastHighlight && settled === lastSettled) {
        return;
      }
      lastPhase = phase;
      lastHighlight = highlight;
      lastSettled = settled;
      for (const { model, anchor, delay } of flowers) {
        model.setMaturity(maturityForSeason(phase, delay), {
          groundY: -anchor.position.y / FLOWER_SCALE,
          highlight,
          settled,
          showShell: phase < 3
        });
      }
    }
  };
}
