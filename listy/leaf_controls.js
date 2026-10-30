import * as THREE from 'three';
import { createBranchDryingProfile } from './leaf_branch_drying.js?v=3';

// Two layers are enough for the requested ~20,000 visible leaves while
// avoiding the extra memory and geometry cost of a third duplicate layer.
const LEAF_MULTIPLIER = 2;

function leafKey(uv, index, atlas) {
  const x = Math.floor(uv.getX(index) * atlas.size / atlas.tile);
  const y = Math.floor((1 - uv.getY(index)) * atlas.size / atlas.tile);
  return y * Math.floor(atlas.size / atlas.tile) + x;
}

function hash(value) {
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return (value ^ (value >>> 16)) >>> 0;
}

// A leaf is an atlas tile, not four consecutive vertices: the GLBs contain
// seam duplicates, and their vertex orders differ between the two models.
function prepareMesh(mesh, atlas, materialIndex) {
  const geometry = mesh.geometry;
  const positions = geometry.attributes.position;
  const uv = geometry.attributes.referenceUv;
  const original = new Float32Array(positions.count * 3);
  const groups = new Map();
  for (let i = 0; i < positions.count; i++) {
    original.set([positions.getX(i), positions.getY(i), positions.getZ(i)], i * 3);
    const key = leafKey(uv, i, atlas);
    if (!groups.has(key)) groups.set(key, { key, vertices: [], indices: [] });
    groups.get(key).vertices.push(i);
  }
  const index = geometry.index;
  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i), b = index.getX(i + 1), c = index.getX(i + 2);
    const key = leafKey(uv, a, atlas);
    if (leafKey(uv, b, atlas) !== key || leafKey(uv, c, atlas) !== key) throw Error('Trojúhelník propojuje více listů');
    groups.get(key).indices.push(a, b, c);
  }
  const leaves = [...groups.values()].sort((a, b) => hash(a.key + materialIndex * 7919) - hash(b.key + materialIndex * 7919));
  const sorted = new index.array.constructor(index.count);
  let offset = 0;
  const ends = [0];
  for (const leaf of leaves) {
    const box = new THREE.Box3();
    for (const i of leaf.vertices) box.expandByPoint(new THREE.Vector3().fromArray(original, i * 3));
    leaf.center = box.getCenter(new THREE.Vector3());
    sorted.set(leaf.indices, offset);
    offset += leaf.indices.length;
    ends.push(offset);
  }
  const baseCount = leaves.length;
  // Keep the original leaves unchanged, then add decorative layers near
  // their source leaves. Copies retain that type's UVs, alpha and season data.
  const expanded = new THREE.BufferGeometry();
  for (const [name, attribute] of Object.entries(geometry.attributes)) {
    const values = new Float32Array(attribute.count * attribute.itemSize * LEAF_MULTIPLIER);
    const getters = ['getX', 'getY', 'getZ', 'getW'];
    for (let i = 0; i < attribute.count; i++) {
      for (let component = 0; component < attribute.itemSize; component++) {
        values[i * attribute.itemSize + component] = attribute[getters[component]](i);
      }
    }
    const layerSize = attribute.count * attribute.itemSize;
    for (let layer = 1; layer < LEAF_MULTIPLIER; layer++) values.copyWithin(layer * layerSize, 0, layerSize);
    expanded.setAttribute(name, new THREE.BufferAttribute(values, attribute.itemSize));
  }
  const expandedIndices = new Uint32Array(sorted.length * LEAF_MULTIPLIER);
  expandedIndices.set(sorted);
  const expandedPositions = expanded.attributes.position;
  const vector = new THREE.Vector3();
  for (let layer = 1; layer < LEAF_MULTIPLIER; layer++) {
    const vertexOffset = layer * positions.count;
    for (let i = 0; i < sorted.length; i++) expandedIndices[layer * sorted.length + i] = sorted[i] + vertexOffset;
    for (const source of leaves.slice(0, baseCount)) {
      const random = salt => hash(source.key + materialIndex * 7919 + layer * 104729 + salt) / 4294967296;
      const a = new THREE.Vector3().fromArray(original, source.indices[0] * 3);
      const b = new THREE.Vector3().fromArray(original, source.indices[1] * 3);
      const c = new THREE.Vector3().fromArray(original, source.indices[2] * 3);
      const u = b.sub(a).normalize();
      const normal = new THREE.Vector3().crossVectors(u, c.sub(a)).normalize();
      const v = new THREE.Vector3().crossVectors(normal, u).normalize();
      const extent = Math.max(...source.vertices.map(i => vector.fromArray(original, i * 3).distanceTo(source.center))) * 2;
      const center = source.center.clone()
        .addScaledVector(u, (random(13) - 0.5) * extent * 0.65)
        .addScaledVector(v, (random(29) - 0.5) * extent * 0.65)
        .addScaledVector(normal, (random(47) - 0.5) * extent * 0.18);
      const rotation = new THREE.Quaternion().setFromAxisAngle(normal, (random(61) - 0.5) * 1.1)
        .multiply(new THREE.Quaternion().setFromAxisAngle(u, (random(83) - 0.5) * 0.4));
      const variation = 0.9 + random(101) * 0.2;
      const vertices = source.vertices.map(i => i + vertexOffset);
      source.vertices.forEach((i, j) => {
        vector.fromArray(original, i * 3).sub(source.center).applyQuaternion(rotation).multiplyScalar(variation).add(center);
        expandedPositions.setXYZ(vertices[j], vector.x, vector.y, vector.z);
        if (expanded.attributes.normal) {
          vector.fromBufferAttribute(geometry.attributes.normal, i).applyQuaternion(rotation).normalize();
          expanded.attributes.normal.setXYZ(vertices[j], vector.x, vector.y, vector.z);
        }
        if (expanded.attributes.tangent) {
          vector.fromBufferAttribute(geometry.attributes.tangent, i).applyQuaternion(rotation).normalize();
          expanded.attributes.tangent.setXYZ(vertices[j], vector.x, vector.y, vector.z);
        }
      });
      leaves.push({ key: source.key, vertices, center });
      ends.push(ends[ends.length - 1] + source.indices.length);
    }
  }
  expanded.setIndex(new THREE.BufferAttribute(expandedIndices, 1));
  mesh.geometry = expanded;
  // The sorted indices place the original layer first. Limit only the shadow
  // draw call, then restore the full visible range without copying GPU buffers.
  const originalIndexCount = ends[baseCount];
  const beforeShadow = mesh.onBeforeShadow;
  const afterShadow = mesh.onAfterShadow;
  let visibleStart = 0, visibleCount = 0;
  mesh.onBeforeShadow = function (...args) {
    beforeShadow.apply(this, args);
    visibleStart = this.geometry.drawRange.start;
    visibleCount = this.geometry.drawRange.count;
    this.geometry.setDrawRange(visibleStart,
      Math.max(0, Math.min(visibleCount, originalIndexCount - visibleStart)));
  };
  mesh.onAfterShadow = function (...args) {
    this.geometry.setDrawRange(visibleStart, visibleCount);
    afterShadow.apply(this, args);
  };
  geometry.dispose();
  return { mesh, original: new Float32Array(expandedPositions.array), leaves, ends, baseCount };
}

export class LeafControls {
  constructor({ sizeInput, countInput, sizeLabel, countLabel, canopyLabel, typeButtons = [], onChange, branchDryingReference }) {
    Object.assign(this, { sizeInput, countInput, sizeLabel, countLabel, canopyLabel, typeButtons, onChange });
    this.models = [];
    this.branchDryingProfile = createBranchDryingProfile(branchDryingReference);
    this.type = 'all';
    this.visible = true;
    this.scale = Number(sizeInput.value) / 100;
    this.growthProgress = 1.0;
    this.count = Number(countInput.value);
    sizeInput.addEventListener('input', () => { this.scale = Number(sizeInput.value) / 100; this.applySize(); this.notify(); });
    countInput.addEventListener('input', () => { this.count = Number(countInput.value); this.applyCount(); this.notify(); });
    typeButtons.forEach(button => button.addEventListener('click', () => this.setType(button.dataset.leafType)));
  }

  setMeshes(meshes, atlas = { size: 4096, tile: 56 }) {
    this.models = meshes.map((mesh, i) => prepareMesh(mesh, atlas, i));
    this.prepareBranchSeason();
    this.total = this.models.reduce((n, model) => n + model.baseCount, 0);
    this.applySize();
    this.applyCount();
  }

  prepareBranchSeason() {
    const profile = this.branchDryingProfile;
    this.seasonOrigin = profile.origin;
    this.dryingStats = profile.stats;
    this.models.forEach(({ mesh, leaves, baseCount }, type) => {
      const priorities = new Float32Array(mesh.geometry.attributes.position.count);
      const regionPriorities = new Float32Array(priorities.length);
      const redResponses = new Float32Array(priorities.length);
      const seasonalDelays = new Float32Array(priorities.length);
      const fallSeeds = new Float32Array(priorities.length);
      const fallDelays = new Float32Array(priorities.length);
      const fallCenters = new Float32Array(priorities.length * 3);
      const fallLandings = new Float32Array(priorities.length * 3);
      mesh.updateWorldMatrix(true, false);
      const fallStartTimes = new Float32Array(priorities.length);
      fallStartTimes.fill(1000000.0);
      leaves.forEach((leaf, index) => {
        const { priority, regionPriority, region, distance } = profile.leaf(type, leaf.key, Math.floor(index / baseCount));
        leaf.dryingPriority = priority;
        leaf.dryingRegionPriority = regionPriority;
        leaf.dryingRegion = region;
        leaf.pathDistanceMeters = distance;
        // Stable pigment variation: some leaves respond less to the red autumn pigment.
        const seed = hash(leaf.key + type * 7919 + Math.floor(index / baseCount) * 104729 + 0x51ed270b);
        const randomValue = seed / 4294967296;
        const redResponse = 0.25 + Math.pow(randomValue, 0.75) * 0.75;
        leaf.seasonalRedResponse = redResponse;
        // Roughly 25% of leaves receive a stable, delayed color transition.
        const delaySeed = hash(leaf.key + type * 15401 + Math.floor(index / baseCount) * 130363 + 0x2a7f19d3);
        const delayRandom = delaySeed / 4294967296;
        const seasonalDelay = delayRandom < 0.25
          ? 0.18 + (hash(delaySeed + 0x6d2b79f5) / 4294967296) * 0.22
          : 0.0;
        const fallSeed = hash(leaf.key + type * 22441 + Math.floor(index / baseCount) * 170141 + 0x7f4a7c15) / 4294967296;
        const fallDelay = hash(leaf.key + type * 31847 + Math.floor(index / baseCount) * 196613 + 0x3c6ef372) / 4294967296;
        const landing = mesh.localToWorld(leaf.center.clone());
        const height = Math.max(0.01, landing.y - 0.045);
        landing.y = 0.045;
        mesh.worldToLocal(landing);
        leaf.fallBaseSpeed = 2.1 + fallSeed * 1.5;
        leaf.fallHeight = height;
        leaf.fallDuration = height / leaf.fallBaseSpeed + 0.65 + 7.0;
        // A red leaf stays on the branch for five seconds, then the batch
        // rolls out over roughly one second according to the rate slider.
        leaf.fallDelay = 0;
        leaf.seasonalDelay = seasonalDelay;
        leaf.fallStartTime = 1000000.0;
        // All corners of a leaf share a value: color changes per whole leaf.
        for (const index of leaf.vertices) {
          priorities[index] = priority;
          regionPriorities[index] = regionPriority;
          redResponses[index] = redResponse;
          seasonalDelays[index] = seasonalDelay;
          fallSeeds[index] = fallSeed;
          fallDelays[index] = fallDelay;
          leaf.center.toArray(fallCenters, index * 3);
          landing.toArray(fallLandings, index * 3);
          fallStartTimes[index] = leaf.fallStartTime;
        }
      });
      mesh.geometry.setAttribute('dryingPriority', new THREE.BufferAttribute(priorities, 1));
      mesh.geometry.setAttribute('dryingRegionPriority', new THREE.BufferAttribute(regionPriorities, 1));
      mesh.geometry.setAttribute('seasonalRedResponse', new THREE.BufferAttribute(redResponses, 1));
      mesh.geometry.setAttribute('seasonalDelay', new THREE.BufferAttribute(seasonalDelays, 1));
      mesh.geometry.setAttribute('leafFallSeed', new THREE.BufferAttribute(fallSeeds, 1));
      mesh.geometry.setAttribute('leafFallDelay', new THREE.BufferAttribute(fallDelays, 1));
      mesh.geometry.setAttribute('leafFallCenter', new THREE.BufferAttribute(fallCenters, 3));
      mesh.geometry.setAttribute('leafFallLanding', new THREE.BufferAttribute(fallLandings, 3));
      mesh.frustumCulled = false; // Leaves can drift outside the original crown bounds.
      mesh.geometry.setAttribute('leafFallStartTime', new THREE.BufferAttribute(fallStartTimes, 1));
    });
    this.fallSeasonProgress = 0.0;
    this.fallEmissionTokens = 0;
    this.lastFallUpdateTime = null;
    this.fallWasEnabled = false;
    this.hasScheduledFall = false;
    this.foliageCache = null;
    this.photosyntheticFoliageCache = null;
  }

  updateLeafFall(seasonProgress, time, { dryingSpeed, dryingSharpness, dryingFrontWidth, fallSpeed = 1, maxAirborne = 700, enabled, calendarFallProgress }) {
    const hasCalendar = Number.isFinite(calendarFallProgress);
    const calendarProgress = hasCalendar ? THREE.MathUtils.clamp(calendarFallProgress, 0, 1) : 0;
    // Changing leaf colour during hydration must not restart a calendar-driven fall.
    const movingBackwards = hasCalendar
      ? calendarProgress < (this.fallCalendarProgress ?? calendarProgress) - 0.0001
      : seasonProgress < this.fallSeasonProgress - 0.0001;
    this.fallCalendarProgress = hasCalendar ? calendarProgress : undefined;
    this.fallSeasonProgress = seasonProgress;
    // maxAirborne is kept as the public option name for compatibility, but its
    // value now means leaves per second. Falling leaves never block new ones.
    const requestedRate = Number(maxAirborne);
    const emissionRate = Math.max(1, Math.min(30000, Math.round(Number.isFinite(requestedRate) ? requestedRate : 700)));
    const dt = this.lastFallUpdateTime === null ? 0 : THREE.MathUtils.clamp(time - this.lastFallUpdateTime, 0, 0.1);
    this.lastFallUpdateTime = time;
    // One token is one leaf. Accumulating tokens makes the control a true
    // time-based rate instead of a cap waiting for previous leaves to land.
    const tokenCapacity = Math.max(2, emissionRate * 1.5);
    this.fallEmissionTokens = Math.min(tokenCapacity, this.fallEmissionTokens + dt * emissionRate);
    if (movingBackwards || !enabled) this.fallEmissionTokens = 0;
    this.fallWasEnabled = Boolean(enabled && !movingBackwards);
    if (!enabled) {
      if (this.hasScheduledFall) this.resetLeafFall();
      return;
    }
    // Before leaf drop begins, neither the calendar nor the shader needs a
    // per-leaf CPU scan. The calendar still advances and activates it on time.
    if (hasCalendar && calendarProgress <= 0 && !this.hasScheduledFall && !movingBackwards) return false;
    if (movingBackwards) this.hasScheduledFall = false;
    let animating = false;
    const speed = Math.max(dryingSpeed, 0.05);
    const fallMultiplier = THREE.MathUtils.clamp(Number(fallSpeed) || 1, 0.25, 3.0);
    this.models.forEach(({ leaves }) => leaves.forEach(leaf => {
      if (leaf.fallHeight && leaf.fallBaseSpeed) {
        leaf.fallDuration = leaf.fallHeight / (leaf.fallBaseSpeed * fallMultiplier) + 0.65 + 7.0;
      }
    }));
    const sharpness = THREE.MathUtils.clamp(dryingSharpness, 0, 1);

    this.models.forEach(({ mesh, leaves, ends }) => {
      const startTimes = mesh.geometry.attributes.leafFallStartTime;
      let changed = false;
      leaves.forEach((leaf, index) => {
        const priority = THREE.MathUtils.clamp(leaf.dryingPriority, 0, 1);
        const regionPriority = THREE.MathUtils.clamp(leaf.dryingRegionPriority, 0, 1);
        const dryingPriority = THREE.MathUtils.lerp(priority, regionPriority, sharpness);
        const leafStart = 0.385 + (1 - dryingPriority) * 0.38;
        const leafDuration = Math.min(0.12 / speed, 1 - leafStart);
        const frontWidth = THREE.MathUtils.lerp(leafDuration, Math.min(leafDuration, dryingFrontWidth), sharpness);
        const frontEdge = leafStart + 0.5 * leafDuration + 0.5 * frontWidth;
        const delay = leaf.seasonalDelay || 0;
        const redTriggerSeason = delay + frontEdge * (1 - delay);
        // The calendar supplies the October–November fall window separately
        // from pigment colour, so a colour adjustment cannot move its dates.
        const releaseOrder = THREE.MathUtils.clamp((1 - dryingPriority - 0.1) / 0.9, 0, 1);
        const releasedByCalendar = hasCalendar && calendarProgress > 0
          && (calendarProgress >= 0.9995 || calendarProgress >= releaseOrder);
        const readyToFall = hasCalendar
          ? releasedByCalendar
          : seasonProgress >= redTriggerSeason;

        const visible = mesh.visible && ends[index + 1] <= mesh.geometry.drawRange.count;
        if (!visible || movingBackwards || !readyToFall) {
          if (leaf.fallStartTime !== 1000000.0) {
            leaf.fallStartTime = 1000000.0;
            for (const vertex of leaf.vertices) startTimes.setX(vertex, leaf.fallStartTime);
            changed = true;
          }
        } else if (releasedByCalendar && leaf.fallStartTime > time) {
          // The calendar releases leaves; real time runs their full falling animation.
          // At winter this also starts every remaining leaf, regardless of the rate cap.
          leaf.fallStartTime = time;
          this.hasScheduledFall = true;
          for (const vertex of leaf.vertices) startTimes.setX(vertex, time);
          changed = true;
        } else if (leaf.fallStartTime === 1000000.0 && this.fallEmissionTokens >= 1) {
          this.fallEmissionTokens -= 1;
          leaf.fallStartTime = time + leaf.fallDelay;
          this.hasScheduledFall = true;
          for (const vertex of leaf.vertices) startTimes.setX(vertex, leaf.fallStartTime);
          changed = true;
        }
      });
      if (changed) {
        startTimes.needsUpdate = true;
        this.foliageCache = null;
        this.photosyntheticFoliageCache = null;
      }
      if (changed || leaves.some(leaf => time >= leaf.fallStartTime && time <= leaf.fallStartTime + leaf.fallDuration)) animating = true;
    });
    return animating;
  }

  getActiveFoliage(time) {
    const cache = this.foliageCache;
    if (cache && cache.growthProgress === this.growthProgress && time >= cache.atTime && time < cache.nextFallTime) {
      return cache.value;
    }
    let selected = 0;
    let attached = 0;
    let nextFallTime = Infinity;
    for (const { mesh, leaves, ends } of this.models) {
      for (let index = 0; index < leaves.length; index++) {
        if (ends[index + 1] > mesh.geometry.drawRange.count) break;
        selected++;
        if (mesh.visible && leaves[index].fallStartTime > time) {
          attached++;
          if (leaves[index].fallStartTime < 1000000.0) {
            nextFallTime = Math.min(nextFallTime, leaves[index].fallStartTime);
          }
        }
      }
    }
    // Growth scales both leaf dimensions, so active area scales quadratically.
    // Decorative density copies do not change the full-canopy reference area.
    const value = selected > 0 ? attached / selected * this.growthProgress ** 2 : 0;
    this.foliageCache = { value, atTime: time, nextFallTime, growthProgress: this.growthProgress };
    return value;
  }

  getPhotosyntheticFoliage(time, seasonProgress, dryingSpeed, dryingSharpness, dryingFrontWidth) {
    // Mirror the leaf shader's colour front. A leaf stops contributing as
    // soon as its red phase begins (leafProgress 0.82), even before it falls.
    const progressKey = Math.round(THREE.MathUtils.clamp(seasonProgress, 0, 1) * 1000);
    const cache = this.photosyntheticFoliageCache;
    if (cache && cache.progressKey === progressKey && cache.dryingSpeed === dryingSpeed
        && cache.dryingSharpness === dryingSharpness && cache.dryingFrontWidth === dryingFrontWidth
        && cache.growthProgress === this.growthProgress && time >= cache.atTime
        && time < cache.nextFallTime) return cache.value;
    const speed = Math.max(dryingSpeed, 0.05);
    const sharpness = THREE.MathUtils.clamp(dryingSharpness, 0, 1);
    let selected = 0, producing = 0, nextFallTime = Infinity;
    for (const { mesh, leaves, ends } of this.models) {
      for (let index = 0; index < leaves.length; index++) {
        if (ends[index + 1] > mesh.geometry.drawRange.count) break;
        selected++;
        const leaf = leaves[index];
        if (!mesh.visible || leaf.fallStartTime <= time) continue;
        nextFallTime = Math.min(nextFallTime, leaf.fallStartTime);
        const priority = THREE.MathUtils.lerp(leaf.dryingPriority, leaf.dryingRegionPriority, sharpness);
        const leafStart = 0.385 + (1 - THREE.MathUtils.clamp(priority, 0, 1)) * 0.38;
        const duration = Math.min(0.12 / speed, 1 - leafStart);
        const width = THREE.MathUtils.lerp(duration, Math.min(duration, dryingFrontWidth), sharpness);
        const center = leafStart + 0.5 * duration;
        const delay = THREE.MathUtils.clamp(leaf.seasonalDelay || 0, 0, 0.40);
        const delayed = THREE.MathUtils.clamp((seasonProgress - delay) / Math.max(0.001, 1 - delay), 0, 1);
        const front = THREE.MathUtils.clamp((delayed - center + 0.5 * width) / Math.max(width, 0.000001), 0, 1);
        const leafProgress = front * front * (3 - 2 * front);
        if (leafProgress < 0.82) producing++;
      }
    }
    const value = selected > 0 ? producing / selected * this.growthProgress ** 2 : 0;
    this.photosyntheticFoliageCache = { value, progressKey, dryingSpeed, dryingSharpness,
      dryingFrontWidth, growthProgress: this.growthProgress, atTime: time, nextFallTime };
    return value;
  }

  hasUnfinishedLeafFall(time) {
    return this.models.some(({ mesh, leaves, ends }) => mesh.visible && leaves.some((leaf, index) =>
      ends[index + 1] <= mesh.geometry.drawRange.count
      && leaf.fallStartTime !== 1000000.0
      && time < leaf.fallStartTime + leaf.fallDuration));
  }

  getFirstRedSeasonProgress(dryingSpeed, dryingSharpness, dryingFrontWidth) {
    const key = `${dryingSpeed}:${dryingSharpness}:${dryingFrontWidth}`;
    if (this.firstRedProgressCache?.key === key) return this.firstRedProgressCache.value;
    const sharpness = THREE.MathUtils.clamp(dryingSharpness, 0, 1);
    let firstProgress = 1;
    this.models.forEach(({ leaves }) => leaves.forEach(leaf => {
      const priority = THREE.MathUtils.lerp(leaf.dryingPriority, leaf.dryingRegionPriority, sharpness);
      const leafStart = 0.385 + (1 - THREE.MathUtils.clamp(priority, 0, 1)) * 0.38;
      const duration = Math.min(0.12 / Math.max(dryingSpeed, 0.05), 1 - leafStart);
      const width = THREE.MathUtils.lerp(duration, Math.min(duration, dryingFrontWidth), sharpness);
      const left = leafStart + 0.5 * duration - 0.5 * width;
      const right = leafStart + 0.5 * duration + 0.5 * width;
      const redStart = 0.70 - 0.35 * (leaf.seasonalRedResponse ?? 0.625);
      const target = Math.max(0.82, redStart + 0.10);
      let low = 0, high = 1;
      for (let i = 0; i < 18; i++) {
        const mid = (low + high) * 0.5;
        const eased = mid * mid * (3 - 2 * mid);
        if (eased < target) low = mid;
        else high = mid;
      }
      const delayedProgress = left + (right - left) * high;
      const seasonProgress = (leaf.seasonalDelay || 0) + delayedProgress * (1 - (leaf.seasonalDelay || 0));
      firstProgress = Math.min(firstProgress, seasonProgress);
    }));
    this.firstRedProgressCache = { key, value: firstProgress };
    return firstProgress;
  }

  resetLeafFall() {
    this.fallEmissionTokens = 0;
    this.fallCalendarProgress = undefined;
    this.hasScheduledFall = false;
    this.foliageCache = null;
    this.photosyntheticFoliageCache = null;
    this.models.forEach(({ mesh, leaves }) => {
      const startTimes = mesh.geometry.attributes.leafFallStartTime;
      let changed = false;
      for (const leaf of leaves) {
        if (leaf.fallStartTime === 1000000.0) continue;
        leaf.fallStartTime = 1000000.0;
        for (const vertex of leaf.vertices) startTimes.setX(vertex, leaf.fallStartTime);
        changed = true;
      }
      if (changed) startTimes.needsUpdate = true;
    });
  }

  applySize() {
    for (const { mesh, leaves, original } of this.models) {
      const position = mesh.geometry.attributes.position;
      for (const { center, vertices } of leaves) {
        for (const i of vertices) position.setXYZ(i,
          center.x + (original[i * 3] - center.x) * this.scale * this.growthProgress,
          center.y + (original[i * 3 + 1] - center.y) * this.scale * this.growthProgress,
          center.z + (original[i * 3 + 2] - center.z) * this.scale * this.growthProgress);
      }
      position.needsUpdate = true;
      mesh.geometry.computeBoundingBox();
      mesh.geometry.computeBoundingSphere();
    }
    this.sizeLabel.textContent = `${Math.round(this.scale * 100)} %`;
  }

  setGrowthProgress(progress) {
    const next = THREE.MathUtils.clamp(Number(progress), 0, 1.0);
    if (Math.abs(next - this.growthProgress) < 0.0001) return;
    this.growthProgress = next;
    this.applySize();
  }

  applyCount() {
    // Visibility is initialized before the GLB arrives. Keep the requested
    // count until there are meshes to measure instead of clamping it to zero.
    if (this.models.length === 0) return;
    this.foliageCache = null;
    this.photosyntheticFoliageCache = null;
    const enabled = this.models.filter((model, i) => this.type === 'all' || String(i) === this.type);
    const baseTotal = enabled.reduce((sum, model) => sum + model.baseCount, 0);
    this.countInput.max = baseTotal * LEAF_MULTIPLIER;
    this.count = Math.max(0, Math.min(Math.round(this.count), Number(this.countInput.max)));
    this.countInput.value = this.count;
    let remaining = this.count;
    this.models.forEach(({ mesh, ends }) => {
      mesh.geometry.setDrawRange(0, ends[0]);
      mesh.visible = false;
    });
    enabled.forEach(({ mesh, baseCount, ends }, i) => {
      const count = i === enabled.length - 1 ? remaining : Math.round(this.count * baseCount / baseTotal);
      mesh.geometry.setDrawRange(0, ends[count]);
      mesh.visible = this.visible;
      remaining -= count;
    });
    this.countLabel.textContent = this.count.toLocaleString('cs-CZ');
    if (this.canopyLabel) this.canopyLabel.textContent = `🍃 Koruna a listy (${this.count.toLocaleString('cs-CZ')} listů)`;
  }

  setType(type) {
    if (!['all', '0', '1'].includes(type) || type === this.type) return;
    const originalCount = selected => this.models.reduce((sum, model, i) => sum + (selected === 'all' || String(i) === selected ? model.baseCount : 0), 0);
    // Isolating a type preserves density instead of doubling its population.
    const density = this.count / (originalCount(this.type) || 1);
    this.type = type;
    this.count = Math.round(density * originalCount(type));
    this.typeButtons.forEach(button => {
      const active = button.dataset.leafType === type;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    this.applyCount();
    this.notify();
  }

  setVisible(visible) {
    this.visible = visible;
    this.applyCount();
  }

  notify() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.onChange?.(), 150);
  }
}
