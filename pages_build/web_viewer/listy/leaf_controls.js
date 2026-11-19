import * as THREE from 'three';
import { createBranchDryingProfile } from './leaf_branch_drying.js?v=3';

const LEAF_MULTIPLIER = 10;
const MAX_LEAF_COUNT = 90000;
const SORT_BUCKETS = 16;
const RADIX_BITS = 8;
const RADIX_BUCKETS = 1 << RADIX_BITS;
// Smoothstep(0.7279753035) == 0.82 (red phase threshold for photosynthetic foliage).
const PHOTO_FRONT_THRESHOLD = (() => {
  let low = 0, high = 1;
  for (let i = 0; i < 32; i++) {
    const mid = (low + high) * 0.5;
    if (mid * mid * (3 - 2 * mid) < 0.82) low = mid;
    else high = mid;
  }
  return (low + high) * 0.5;
})();

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

// Sort indices [0..count-1] in O(N) by a Float32 value array via IEEE-754 radix sort.
// Values must be finite and >= 0 (or mapped monotonically to non-negative).
function radixSortByFloat(orderOut, values, count, scratchA, scratchB, counts) {
  if (count <= 1) {
    if (count === 1) orderOut[0] = 0;
    return;
  }
  const bits = new Uint32Array(values.buffer, values.byteOffset, count);
  for (let i = 0; i < count; i++) scratchA[i] = i;
  let src = scratchA;
  let dst = scratchB;
  for (let shift = 0; shift < 32; shift += RADIX_BITS) {
    counts.fill(0);
    for (let i = 0; i < count; i++) {
      counts[(bits[src[i]] >>> shift) & 0xff]++;
    }
    // Skip pass if every entry fell into a single bucket.
    let nonEmpty = 0;
    for (let b = 0; b < RADIX_BUCKETS; b++) {
      if (counts[b] === count) { nonEmpty = 1; break; }
    }
    if (nonEmpty === 1) continue;
    let offset = 0;
    for (let b = 0; b < RADIX_BUCKETS; b++) {
      const c = counts[b];
      counts[b] = offset;
      offset += c;
    }
    for (let i = 0; i < count; i++) {
      const idx = src[i];
      dst[counts[(bits[idx] >>> shift) & 0xff]++] = idx;
    }
    const tmp = src;
    src = dst;
    dst = tmp;
  }
  orderOut.set(src.subarray(0, count));
}

// Trim transparent margins around planar leaf quads while preserving bilinearly interpolated UVs and world positions.
function cropLeafQuads(leaves, positions, geomUv, refUv, original, crop) {
  if (!crop || !geomUv || !refUv) return;
  for (const leaf of leaves) {
    let v00 = -1, v10 = -1, v01 = -1, v11 = -1;
    for (const vi of leaf.vertices) {
      const u = geomUv.getX(vi);
      const v = geomUv.getY(vi);
      if (u < 0.5) {
        if (v < 0.5) v00 = vi;
        else v01 = vi;
      } else {
        if (v < 0.5) v10 = vi;
        else v11 = vi;
      }
    }
    if (v00 < 0 || v10 < 0 || v01 < 0 || v11 < 0) continue;
    const p00x = original[v00 * 3], p00y = original[v00 * 3 + 1], p00z = original[v00 * 3 + 2];
    const p10x = original[v10 * 3], p10y = original[v10 * 3 + 1], p10z = original[v10 * 3 + 2];
    const p01x = original[v01 * 3], p01y = original[v01 * 3 + 1], p01z = original[v01 * 3 + 2];
    const p11x = original[v11 * 3], p11y = original[v11 * 3 + 1], p11z = original[v11 * 3 + 2];
    const r00u = refUv.getX(v00), r00v = refUv.getY(v00);
    const r10u = refUv.getX(v10), r10v = refUv.getY(v10);
    const r01u = refUv.getX(v01), r01v = refUv.getY(v01);
    const r11u = refUv.getX(v11), r11v = refUv.getY(v11);
    for (const vi of leaf.vertices) {
      const uNew = geomUv.getX(vi) < 0.5 ? crop.uMin : crop.uMax;
      const vNew = geomUv.getY(vi) < 0.5 ? crop.vMin : crop.vMax;
      const w00 = (1 - uNew) * (1 - vNew);
      const w10 = uNew * (1 - vNew);
      const w01 = (1 - uNew) * vNew;
      const w11 = uNew * vNew;
      const nx = p00x * w00 + p10x * w10 + p01x * w01 + p11x * w11;
      const ny = p00y * w00 + p10y * w10 + p01y * w01 + p11y * w11;
      const nz = p00z * w00 + p10z * w10 + p01z * w01 + p11z * w11;
      original[vi * 3] = nx;
      original[vi * 3 + 1] = ny;
      original[vi * 3 + 2] = nz;
      positions.setXYZ(vi, nx, ny, nz);
      geomUv.setXY(vi, uNew, vNew);
      refUv.setXY(
        vi,
        r00u * w00 + r10u * w10 + r01u * w01 + r11u * w11,
        r00v * w00 + r10v * w10 + r01v * w01 + r11v * w11
      );
    }
  }
}

// A leaf is an atlas tile, not four consecutive vertices: the GLBs contain
// seam duplicates, and their vertex orders differ between the two models.
function prepareMesh(mesh, atlas, materialIndex, alphaBounds = null) {
  const geometry = mesh.geometry;
  const positions = geometry.attributes.position;
  const uv = geometry.attributes.referenceUv;
  const original = new Float32Array(positions.count * 3);
  const posArr = positions.array;
  for (let i = 0; i < positions.count; i++) {
    if (positions.itemSize === 3 && !positions.isInterleavedBufferAttribute && posArr instanceof Float32Array) {
      original[i * 3] = posArr[i * 3];
      original[i * 3 + 1] = posArr[i * 3 + 1];
      original[i * 3 + 2] = posArr[i * 3 + 2];
    } else {
      original[i * 3] = positions.getX(i);
      original[i * 3 + 1] = positions.getY(i);
      original[i * 3 + 2] = positions.getZ(i);
    }
  }
  const groups = new Map();
  for (let i = 0; i < positions.count; i++) {
    const key = leafKey(uv, i, atlas);
    let group = groups.get(key);
    if (!group) {
      group = { key, vertices: [], indices: [] };
      groups.set(key, group);
    }
    group.vertices.push(i);
  }
  const index = geometry.index;
  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i), b = index.getX(i + 1), c = index.getX(i + 2);
    const key = leafKey(uv, a, atlas);
    if (leafKey(uv, b, atlas) !== key || leafKey(uv, c, atlas) !== key) throw Error('Trojúhelník propojuje více listů');
    groups.get(key).indices.push(a, b, c);
  }
  const leaves = [...groups.values()].sort((a, b) => hash(a.key + materialIndex * 7919) - hash(b.key + materialIndex * 7919));
  cropLeafQuads(leaves, positions, geometry.attributes.uv, uv, original, alphaBounds?.[materialIndex]);
  const sorted = new index.array.constructor(index.count);
  let offset = 0;
  const ends = [0];
  for (const leaf of leaves) {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (const i of leaf.vertices) {
      const x = original[i * 3], y = original[i * 3 + 1], z = original[i * 3 + 2];
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
    }
    leaf.center = new THREE.Vector3((minX + maxX) * 0.5, (minY + maxY) * 0.5, (minZ + maxZ) * 0.5);
    sorted.set(leaf.indices, offset);
    offset += leaf.indices.length;
    ends.push(offset);
  }
  const baseCount = leaves.length;
  // Keep the original leaves unchanged, then add decorative layers near
  // their source leaves. Copies retain that type's UVs, alpha and season data.
  const expanded = new THREE.BufferGeometry();
  for (const [name, attribute] of Object.entries(geometry.attributes)) {
    // Leaf shaders compute colour from diffuse/procedural textures, never vertex COLOR_0.
    if (name === 'color') continue;
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
  const expPosArr = expandedPositions.array;
  const expNormArr = expanded.attributes.normal?.array;
  const expTangArr = expanded.attributes.tangent?.array;
  const srcNormals = geometry.attributes.normal;
  const srcTangents = geometry.attributes.tangent;
  const vector = new THREE.Vector3();
  const aVec = new THREE.Vector3();
  const bVec = new THREE.Vector3();
  const cVec = new THREE.Vector3();
  const uAxis = new THREE.Vector3();
  const normalAxis = new THREE.Vector3();
  const vAxis = new THREE.Vector3();
  const centerVec = new THREE.Vector3();
  const rotQ = new THREE.Quaternion();
  const rotQ2 = new THREE.Quaternion();
  for (let layer = 1; layer < LEAF_MULTIPLIER; layer++) {
    const vertexOffset = layer * positions.count;
    const idxBase = layer * sorted.length;
    for (let i = 0; i < sorted.length; i++) expandedIndices[idxBase + i] = sorted[i] + vertexOffset;
    for (let sIdx = 0; sIdx < baseCount; sIdx++) {
      const source = leaves[sIdx];
      const seedBase = source.key + materialIndex * 7919 + layer * 104729;
      const random = salt => hash(seedBase + salt) / 4294967296;
      aVec.fromArray(original, source.indices[0] * 3);
      bVec.fromArray(original, source.indices[1] * 3);
      cVec.fromArray(original, source.indices[2] * 3);
      uAxis.subVectors(bVec, aVec).normalize();
      normalAxis.crossVectors(uAxis, cVec.sub(aVec)).normalize();
      vAxis.crossVectors(normalAxis, uAxis).normalize();
      let maxDist = 0;
      for (const i of source.vertices) {
        const dx = original[i * 3] - source.center.x;
        const dy = original[i * 3 + 1] - source.center.y;
        const dz = original[i * 3 + 2] - source.center.z;
        const d = Math.hypot(dx, dy, dz);
        if (d > maxDist) maxDist = d;
      }
      const extent = maxDist * 2;
      centerVec.copy(source.center)
        .addScaledVector(uAxis, (random(13) - 0.5) * extent * 0.65)
        .addScaledVector(vAxis, (random(29) - 0.5) * extent * 0.65)
        .addScaledVector(normalAxis, (random(47) - 0.5) * extent * 0.18);
      rotQ.setFromAxisAngle(normalAxis, (random(61) - 0.5) * 1.1);
      rotQ2.setFromAxisAngle(uAxis, (random(83) - 0.5) * 0.4);
      rotQ.multiply(rotQ2);
      const variation = 0.9 + random(101) * 0.2;
      const vertices = new Array(source.vertices.length);
      for (let j = 0; j < source.vertices.length; j++) {
        const i = source.vertices[j];
        const dst = i + vertexOffset;
        vertices[j] = dst;
        vector.fromArray(original, i * 3).sub(source.center).applyQuaternion(rotQ).multiplyScalar(variation).add(centerVec);
        expPosArr[dst * 3] = vector.x;
        expPosArr[dst * 3 + 1] = vector.y;
        expPosArr[dst * 3 + 2] = vector.z;
        if (expNormArr) {
          vector.fromBufferAttribute(srcNormals, i).applyQuaternion(rotQ).normalize();
          expNormArr[dst * 3] = vector.x;
          expNormArr[dst * 3 + 1] = vector.y;
          expNormArr[dst * 3 + 2] = vector.z;
        }
        if (expTangArr) {
          vector.fromBufferAttribute(srcTangents, i).applyQuaternion(rotQ).normalize();
          expTangArr[dst * 3] = vector.x;
          expTangArr[dst * 3 + 1] = vector.y;
          expTangArr[dst * 3 + 2] = vector.z;
        }
      }
      leaves.push({ key: source.key, vertices, center: centerVec.clone() });
      ends.push(ends[ends.length - 1] + source.indices.length);
    }
  }
  const baseSortedIndices = new Uint32Array(expandedIndices);
  const indexAttr = new THREE.BufferAttribute(expandedIndices, 1);
  indexAttr.setUsage(THREE.DynamicDrawUsage);
  expanded.setIndex(indexAttr);
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

  const totalLeaves = leaves.length;
  const centers = new Float32Array(totalLeaves * 3);
  const vertexCenter = new Float32Array(expPosArr.length);
  for (let i = 0; i < totalLeaves; i++) {
    const c = leaves[i].center;
    centers[i * 3] = c.x;
    centers[i * 3 + 1] = c.y;
    centers[i * 3 + 2] = c.z;
    for (const v of leaves[i].vertices) {
      vertexCenter[v * 3] = c.x;
      vertexCenter[v * 3 + 1] = c.y;
      vertexCenter[v * 3 + 2] = c.z;
    }
  }
  const uniformQuadIndices = ends[totalLeaves] === totalLeaves * 6;
  return {
    mesh,
    original: new Float32Array(expPosArr),
    vertexCenter,
    centers,
    baseSortedIndices,
    uniformQuadIndices,
    leaves,
    ends,
    baseCount,
    sortScratch: {
      counts: new Int32Array(SORT_BUCKETS),
      offsets: new Int32Array(SORT_BUCKETS),
      buckets: new Uint8Array(totalLeaves),
      dots: new Float32Array(totalLeaves)
    }
  };
}

export class LeafControls {
  constructor({ sizeInput, countInput, sizeLabel, countLabel, canopyLabel, typeButtons = [], onChange, branchDryingReference, growthUniform = null }) {
    Object.assign(this, { sizeInput, countInput, sizeLabel, countLabel, canopyLabel, typeButtons, onChange, growthUniform });
    this.models = [];
    this.branchDryingProfile = createBranchDryingProfile(branchDryingReference);
    this.type = 'all';
    this.visible = true;
    this.scale = Number(sizeInput.value) / 100;
    this.growthProgress = 1.0;
    if (this.growthUniform) this.growthUniform.value = 1.0;
    this.count = Number(countInput.value);
    this.lastSortDir = new THREE.Vector3();
    this.lastSortDist = 0;
    this.hasSortedView = false;
    this.needsResort = true;
    this.sortModelPending = 0;
    this._driftScratch = new THREE.Vector3();
    this._centerScratch = new THREE.Vector3();
    sizeInput.addEventListener('input', () => { this.scale = Number(sizeInput.value) / 100; this.applySize(); this.notify(); });
    countInput.addEventListener('input', () => { this.count = Number(countInput.value); this.applyCount(); this.notify(); });
    typeButtons.forEach(button => button.addEventListener('click', () => this.setType(button.dataset.leafType)));
  }

  setMeshes(meshes, atlas = { size: 4096, tile: 56 }, alphaBounds = null) {
    this.models = meshes.map((mesh, i) => prepareMesh(mesh, atlas, i, alphaBounds));
    this.prepareBranchSeason();
    this.total = this.models.reduce((n, model) => n + model.baseCount, 0);
    this.applySize();
    this.applyCount();
  }

  prepareBranchSeason() {
    const profile = this.branchDryingProfile;
    this.seasonOrigin = profile.origin;
    this.dryingStats = profile.stats;
    this.models.forEach((model, type) => {
      const { mesh, leaves, baseCount } = model;
      const vertCount = mesh.geometry.attributes.position.count;
      const leafCount = leaves.length;
      const seasonPacked = new Uint16Array(vertCount * 4);
      const fallSeeds = new Float32Array(vertCount);
      const fallCenters = new Float32Array(vertCount * 3);
      const fallLandings = new Float32Array(vertCount * 3);
      const fallStartTimes = new Float32Array(vertCount);
      fallStartTimes.fill(1000000.0);

      model.dryingPriorities = new Float32Array(leafCount);
      model.dryingRegionPriorities = new Float32Array(leafCount);
      model.seasonalDelays = new Float32Array(leafCount);
      model.fallDelays = new Float32Array(leafCount);
      model.fallBaseSpeeds = new Float32Array(leafCount);
      model.fallHeights = new Float32Array(leafCount);
      model.leafFallStartTimes = new Float32Array(leafCount);
      model.leafFallStartTimes.fill(1000000.0);
      model.fallenFlags = new Uint8Array(leafCount);
      model.scheduledFlags = new Uint8Array(leafCount);
      model.scheduledIndices = [];
      model.airborneIndices = [];
      model.futureScheduledIndices = [];
      model.fallenCount = 0;

      model.calendarOrder = new Int32Array(leafCount);
      model.calendarReleaseValues = new Float32Array(leafCount);
      model.leafRanks = new Float32Array(leafCount);
      model.calendarOrderCount = -1;
      model.cachedSharpness = NaN;
      model.calendarCursor = 0;

      model.triggerOrder = new Int32Array(leafCount);
      model.triggerValues = new Float32Array(leafCount);
      model.cachedTriggerKey = '';
      model.triggerCursor = 0;

      model.photoOrder = new Int32Array(leafCount);
      model.photoStopValues = new Float32Array(leafCount);
      model.cachedPhotoKey = '';
      model.photoCursor = 0;
      model.photoLastSeason = 0;
      model.fallenAtOrBeforeStop = 0;
      model.fallenAfterStop = 0;

      model.radixScratchA = new Int32Array(leafCount);
      model.radixScratchB = new Int32Array(leafCount);
      model.radixCounts = new Int32Array(RADIX_BUCKETS);

      mesh.updateWorldMatrix(true, false);
      const landing = new THREE.Vector3();
      for (let index = 0; index < leafCount; index++) {
        const leaf = leaves[index];
        const layer = Math.floor(index / baseCount);
        const { priority, regionPriority, region, distance } = profile.leaf(type, leaf.key, layer);
        leaf.dryingPriority = priority;
        leaf.dryingRegionPriority = regionPriority;
        leaf.dryingRegion = region;
        leaf.pathDistanceMeters = distance;
        const seed = hash(leaf.key + type * 7919 + layer * 104729 + 0x51ed270b);
        const randomValue = seed / 4294967296;
        const redResponse = 0.25 + Math.pow(randomValue, 0.75) * 0.75;
        leaf.seasonalRedResponse = redResponse;
        const delaySeed = hash(leaf.key + type * 15401 + layer * 130363 + 0x2a7f19d3);
        const delayRandom = delaySeed / 4294967296;
        const seasonalDelay = delayRandom < 0.25
          ? 0.18 + (hash(delaySeed + 0x6d2b79f5) / 4294967296) * 0.22
          : 0.0;
        const fallSeed = hash(leaf.key + type * 22441 + layer * 170141 + 0x7f4a7c15) / 4294967296;
        const fallDelay = hash(leaf.key + type * 31847 + layer * 196613 + 0x3c6ef372) / 4294967296;
        landing.copy(leaf.center);
        mesh.localToWorld(landing);
        const height = Math.max(0.01, landing.y - 0.045);
        landing.y = 0.045;
        mesh.worldToLocal(landing);
        leaf.fallBaseSpeed = 2.1 + fallSeed * 1.5;
        leaf.fallHeight = height;
        leaf.fallDelay = 0;
        leaf.seasonalDelay = seasonalDelay;
        leaf.fallStartTime = 1000000.0;

        model.dryingPriorities[index] = priority;
        model.dryingRegionPriorities[index] = regionPriority;
        model.seasonalDelays[index] = seasonalDelay;
        model.fallDelays[index] = fallDelay;
        model.fallBaseSpeeds[index] = leaf.fallBaseSpeed;
        model.fallHeights[index] = height;

        const p0 = Math.round(THREE.MathUtils.clamp(priority, 0, 1) * 65535);
        const p1 = Math.round(THREE.MathUtils.clamp(regionPriority, 0, 1) * 65535);
        const p2 = Math.round(THREE.MathUtils.clamp(redResponse, 0, 1) * 65535);
        const p3 = Math.round(THREE.MathUtils.clamp(seasonalDelay, 0, 1) * 65535);

        for (const v of leaf.vertices) {
          const v4 = v * 4;
          seasonPacked[v4] = p0;
          seasonPacked[v4 + 1] = p1;
          seasonPacked[v4 + 2] = p2;
          seasonPacked[v4 + 3] = p3;
          fallSeeds[v] = fallSeed;
          fallCenters[v * 3] = leaf.center.x;
          fallCenters[v * 3 + 1] = leaf.center.y;
          fallCenters[v * 3 + 2] = leaf.center.z;
          fallLandings[v * 3] = landing.x;
          fallLandings[v * 3 + 1] = landing.y;
          fallLandings[v * 3 + 2] = landing.z;
          fallStartTimes[v] = 1000000.0;
        }
      }
      mesh.geometry.setAttribute('leafSeasonData', new THREE.BufferAttribute(seasonPacked, 4, true));
      mesh.geometry.setAttribute('leafFallSeed', new THREE.BufferAttribute(fallSeeds, 1));
      mesh.geometry.setAttribute('leafGrowthRank', new THREE.BufferAttribute(new Float32Array(vertCount), 1));
      mesh.geometry.setAttribute('leafFallCenter', new THREE.BufferAttribute(fallCenters, 3));
      mesh.geometry.setAttribute('leafFallLanding', new THREE.BufferAttribute(fallLandings, 3));
      mesh.geometry.setAttribute('leafCameraDrift', new THREE.BufferAttribute(new Float32Array(fallCenters.length), 3));
      mesh.frustumCulled = true; // Disabled dynamically while falling/drifted leaves are active.
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

  _ensureCalendarOrder(model, selectedCount, sharpness) {
    if (model.cachedSharpness === sharpness && model.calendarOrderCount === selectedCount) return false;
    const dpArr = model.dryingPriorities;
    const drpArr = model.dryingRegionPriorities;
    const relArr = model.calendarReleaseValues;
    for (let i = 0; i < selectedCount; i++) {
      const p = Math.max(0, Math.min(1, dpArr[i]));
      const rp = Math.max(0, Math.min(1, drpArr[i]));
      const dp = p + (rp - p) * sharpness;
      const r = (1 - dp - 0.1) / 0.9;
      relArr[i] = r < 0 ? 0 : r > 1 ? 1 : r;
    }
    radixSortByFloat(model.calendarOrder, relArr, selectedCount, model.radixScratchA, model.radixScratchB, model.radixCounts);
    const ranks = model.mesh.geometry.attributes.leafGrowthRank;
    const leafRanks = model.leafRanks;
    for (let order = 0; order < selectedCount; order++) {
      const leafIdx = model.calendarOrder[order];
      const rank = (selectedCount - order - 0.5) / selectedCount;
      leafRanks[leafIdx] = rank;
      for (const vertex of model.leaves[leafIdx].vertices) ranks.array[vertex] = rank;
    }
    ranks.needsUpdate = true;
    model.cachedSharpness = sharpness;
    model.calendarOrderCount = selectedCount;
    model.calendarCursor = 0;
    return true;
  }

  _ensureTriggerOrder(model, selectedCount, sharpness, speed, dryingFrontWidth) {
    const key = `${selectedCount}:${sharpness}:${speed}:${dryingFrontWidth}`;
    if (model.cachedTriggerKey === key) return false;
    const dpArr = model.dryingPriorities;
    const drpArr = model.dryingRegionPriorities;
    const delArr = model.seasonalDelays;
    const trigArr = model.triggerValues;
    for (let i = 0; i < selectedCount; i++) {
      const p = Math.max(0, Math.min(1, dpArr[i]));
      const rp = Math.max(0, Math.min(1, drpArr[i]));
      const dp = p + (rp - p) * sharpness;
      const leafStart = 0.385 + (1 - dp) * 0.38;
      const leafDuration = Math.min(0.12 / speed, 1 - leafStart);
      const frontWidth = leafDuration + (Math.min(leafDuration, dryingFrontWidth) - leafDuration) * sharpness;
      const frontEdge = leafStart + 0.5 * leafDuration + 0.5 * frontWidth;
      const delay = delArr[i];
      trigArr[i] = delay + frontEdge * (1 - delay);
    }
    radixSortByFloat(model.triggerOrder, trigArr, selectedCount, model.radixScratchA, model.radixScratchB, model.radixCounts);
    model.cachedTriggerKey = key;
    model.triggerCursor = 0;
    return true;
  }

  _ensurePhotoOrder(model, selectedCount, sharpness, speed, dryingFrontWidth) {
    const key = `${selectedCount}:${sharpness}:${speed}:${dryingFrontWidth}`;
    if (model.cachedPhotoKey === key) return;
    const dpArr = model.dryingPriorities;
    const drpArr = model.dryingRegionPriorities;
    const delArr = model.seasonalDelays;
    const stopArr = model.photoStopValues;
    const offset = (PHOTO_FRONT_THRESHOLD - 0.5);
    for (let i = 0; i < selectedCount; i++) {
      const dp = dpArr[i] + (drpArr[i] - dpArr[i]) * sharpness;
      const clampedDp = dp < 0 ? 0 : dp > 1 ? 1 : dp;
      const leafStart = 0.385 + (1 - clampedDp) * 0.38;
      const duration = Math.min(0.12 / speed, 1 - leafStart);
      const width = duration + (Math.min(duration, dryingFrontWidth) - duration) * sharpness;
      const center = leafStart + 0.5 * duration;
      const delay = delArr[i] < 0 ? 0 : delArr[i] > 0.40 ? 0.40 : delArr[i];
      const targetDelayed = center + offset * width;
      if (targetDelayed <= 0) stopArr[i] = 0;
      else if (targetDelayed > 1) stopArr[i] = 2.0;
      else stopArr[i] = delay + (1 - delay) * targetDelayed;
    }
    radixSortByFloat(model.photoOrder, stopArr, selectedCount, model.radixScratchA, model.radixScratchB, model.radixCounts);
    model.cachedPhotoKey = key;
    model.photoCursor = 0;
    model.photoLastSeason = 0;
    model.fallenAtOrBeforeStop = 0;
    model.fallenAfterStop = model.fallenCount;
  }

  _syncFallenUpToTime(model, time) {
    const future = model.futureScheduledIndices;
    if (future.length === 0) return;
    const times = model.leafFallStartTimes;
    const flags = model.fallenFlags;
    const stopVals = model.photoStopValues;
    const hasPhotoOrder = model.cachedPhotoKey !== '';
    let write = 0;
    for (let i = 0; i < future.length; i++) {
      const idx = future[i];
      const st = times[idx];
      if (st >= 1000000.0) continue;
      if (st <= time) {
        if (!flags[idx]) {
          flags[idx] = 1;
          model.fallenCount++;
          if (hasPhotoOrder) {
            if (stopVals[idx] <= model.photoLastSeason) model.fallenAtOrBeforeStop++;
            else model.fallenAfterStop++;
          }
        }
      } else {
        future[write++] = idx;
      }
    }
    future.length = write;
  }

  updateLeafFall(seasonProgress, time, { dryingSpeed, dryingSharpness, dryingFrontWidth, fallSpeed = 1, maxAirborne = 700, enabled, calendarFallProgress, cameraPosition }) {
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
    this.fallMultiplier = fallMultiplier;
    const sharpness = THREE.MathUtils.clamp(dryingSharpness, 0, 1);

    for (const model of this.models) {
      const { mesh, leaves, selectedCount } = model;
      if (!mesh.visible) continue;
      const startTimes = mesh.geometry.attributes.leafFallStartTime;
      const startArr = startTimes.array;
      const cameraDrift = mesh.geometry.attributes.leafCameraDrift;
      const driftArr = cameraDrift.array;
      const leafTimes = model.leafFallStartTimes;
      const fallenFlags = model.fallenFlags;
      const scheduledFlags = model.scheduledFlags;
      const scheduled = model.scheduledIndices;
      const airborne = model.airborneIndices;
      const drift = this._driftScratch;
      const centerTmp = this._centerScratch;
      let changed = false;
      let driftChanged = false;
      let minStartVert = Infinity, maxStartVert = -1;
      let minDriftVert = Infinity, maxDriftVert = -1;

      const rebuiltOrder = hasCalendar
        ? this._ensureCalendarOrder(model, selectedCount, sharpness)
        : this._ensureTriggerOrder(model, selectedCount, sharpness, speed, dryingFrontWidth);

      const hasPhotoOrder = model.cachedPhotoKey !== '';
      const photoStops = model.photoStopValues;
      const unscheduleLeaf = (leaf, index) => {
        leaf.fallStartTime = 1000000.0;
        leafTimes[index] = 1000000.0;
        if (fallenFlags[index]) {
          fallenFlags[index] = 0;
          model.fallenCount--;
          if (hasPhotoOrder) {
            if (photoStops[index] <= model.photoLastSeason) model.fallenAtOrBeforeStop--;
            else model.fallenAfterStop--;
          }
        }
        scheduledFlags[index] = 0;
        for (const v of leaf.vertices) {
          startArr[v] = 1000000.0;
          if (v < minStartVert) minStartVert = v;
          if (v > maxStartVert) maxStartVert = v;
        }
        changed = true;
      };

      const scheduleFall = (leaf, index, startTime) => {
        const wasScheduled = scheduledFlags[index] === 1;
        const wasFallen = fallenFlags[index] === 1;
        leaf.fallStartTime = startTime;
        leafTimes[index] = startTime;
        this.hasScheduledFall = true;
        mesh.frustumCulled = false;
        if (!wasScheduled) {
          scheduledFlags[index] = 1;
          scheduled.push(index);
          airborne.push(index);
        } else if (!airborne.includes(index)) {
          airborne.push(index);
        }
        if (startTime <= time) {
          if (!wasFallen) {
            fallenFlags[index] = 1;
            model.fallenCount++;
            if (hasPhotoOrder) {
              if (photoStops[index] <= model.photoLastSeason) model.fallenAtOrBeforeStop++;
              else model.fallenAfterStop++;
            }
          }
        } else {
          if (wasFallen) {
            fallenFlags[index] = 0;
            model.fallenCount--;
            if (hasPhotoOrder) {
              if (photoStops[index] <= model.photoLastSeason) model.fallenAtOrBeforeStop--;
              else model.fallenAfterStop--;
            }
          }
          model.futureScheduledIndices.push(index);
        }
        drift.set(0, 0, 0);
        // Store the gust at release so turning the camera cannot steer a leaf.
        if (cameraPosition && hash(leaf.key + index * 104729 + 0x31ed270b) / 4294967296 < 0.005) {
          centerTmp.copy(leaf.center);
          mesh.localToWorld(centerTmp);
          drift.subVectors(cameraPosition, centerTmp);
          drift.y = 0;
          drift.setLength(Math.min(13, drift.length() * 0.6));
          mesh.worldToLocal(drift.add(centerTmp)).sub(leaf.center);
        }
        const hasDrift = drift.x !== 0 || drift.y !== 0 || drift.z !== 0;
        for (const v of leaf.vertices) {
          startArr[v] = startTime;
          if (v < minStartVert) minStartVert = v;
          if (v > maxStartVert) maxStartVert = v;
          const v3 = v * 3;
          if (hasDrift || driftArr[v3] !== 0 || driftArr[v3 + 1] !== 0 || driftArr[v3 + 2] !== 0) {
            driftArr[v3] = drift.x;
            driftArr[v3 + 1] = drift.y;
            driftArr[v3 + 2] = drift.z;
            if (v < minDriftVert) minDriftVert = v;
            if (v > maxDriftVert) maxDriftVert = v;
            driftChanged = true;
          }
        }
        changed = true;
      };

      if (movingBackwards) {
        for (let i = 0; i < scheduled.length; i++) {
          const idx = scheduled[i];
          if (leafTimes[idx] !== 1000000.0) unscheduleLeaf(leaves[idx], idx);
        }
        scheduled.length = 0;
        airborne.length = 0;
        model.futureScheduledIndices.length = 0;
        model.calendarCursor = 0;
        model.triggerCursor = 0;
      } else {
        // Check already-scheduled leaves only when ordering parameters changed or fall is disabled.
        if (scheduled.length > 0 && (rebuiltOrder || (hasCalendar && calendarProgress <= 0))) {
          const relVals = model.calendarReleaseValues;
          const trigVals = model.triggerValues;
          let write = 0;
          for (let i = 0; i < scheduled.length; i++) {
            const idx = scheduled[i];
            if (idx >= selectedCount) continue;
            const ready = hasCalendar
              ? calendarProgress > 0 && (calendarProgress >= 0.9995 || calendarProgress >= relVals[idx])
              : seasonProgress >= trigVals[idx];
            if (!ready) {
              if (leafTimes[idx] !== 1000000.0) unscheduleLeaf(leaves[idx], idx);
            } else {
              scheduled[write++] = idx;
            }
          }
          scheduled.length = write;
        }

        if (hasCalendar) {
          if (calendarProgress > 0) {
            const order = model.calendarOrder;
            const relVals = model.calendarReleaseValues;
            const releaseAll = calendarProgress >= 0.9995;
            while (model.calendarCursor < selectedCount) {
              const idx = order[model.calendarCursor];
              if (!releaseAll && calendarProgress < relVals[idx]) break;
              const rank = (selectedCount - model.calendarCursor - 0.5) / selectedCount;
              if (rank < (this.canopyCoverage ?? 1) && leafTimes[idx] > time) {
                scheduleFall(leaves[idx], idx, time);
              }
              model.calendarCursor++;
            }
          }
        } else {
          const order = model.triggerOrder;
          const trigVals = model.triggerValues;
          const fallDelays = model.fallDelays;
          while (model.triggerCursor < selectedCount) {
            const idx = order[model.triggerCursor];
            if (seasonProgress < trigVals[idx]) break;
            if (leafTimes[idx] === 1000000.0) {
              if (this.fallEmissionTokens < 1) break;
              this.fallEmissionTokens -= 1;
              scheduleFall(leaves[idx], idx, time + fallDelays[idx]);
            }
            model.triggerCursor++;
          }
        }
      }

      // Check only active airborne/settling leaves and prune completed ones.
      let airborneWrite = 0;
      for (let i = 0; i < airborne.length; i++) {
        const idx = airborne[i];
        const st = leafTimes[idx];
        if (idx >= selectedCount || st === 1000000.0) continue;
        const flightEnd = st + model.fallHeights[idx] / (model.fallBaseSpeeds[idx] * fallMultiplier) + 0.65;
        const fadeEnd = flightEnd + 7.0;
        if (time <= fadeEnd) {
          airborne[airborneWrite++] = idx;
          if (time >= st && time <= flightEnd) animating = true;
        }
      }
      airborne.length = airborneWrite;

      if (changed) {
        if (maxStartVert >= minStartVert && startTimes.clearUpdateRanges) {
          startTimes.clearUpdateRanges();
          startTimes.addUpdateRange(minStartVert, maxStartVert - minStartVert + 1);
        }
        startTimes.needsUpdate = true;
        this.foliageCache = null;
        this.photosyntheticFoliageCache = null;
      }
      if (driftChanged) {
        if (maxDriftVert >= minDriftVert && cameraDrift.clearUpdateRanges) {
          cameraDrift.clearUpdateRanges();
          cameraDrift.addUpdateRange(minDriftVert * 3, (maxDriftVert - minDriftVert + 1) * 3);
        }
        cameraDrift.needsUpdate = true;
      }
      if (changed) animating = true;
    }
    return animating;
  }

  getActiveFoliage(time) {
    const cache = this.foliageCache;
    if (cache && time >= cache.atTime && time < cache.nextFallTime) {
      return cache.value;
    }
    let selected = 0;
    let attached = 0;
    let nextFallTime = Infinity;
    for (const model of this.models) {
      const count = model.selectedCount ?? 0;
      selected += count;
      if (!model.mesh.visible) continue;
      this._syncFallenUpToTime(model, time);
      attached += Math.max(0, Math.ceil(count * (this.canopyCoverage ?? 1) - 0.5) - model.fallenCount);
      const future = model.futureScheduledIndices;
      const times = model.leafFallStartTimes;
      for (let i = 0; i < future.length; i++) {
        const st = times[future[i]];
        if (st > time && st < nextFallTime) nextFallTime = st;
      }
    }
    // Pure attached leaf fraction (0..1); budburst growth scales outside in TreeEcology.
    const value = selected > 0 ? attached / selected : 0;
    this.foliageCache = { value, atTime: time, nextFallTime };
    return value;
  }

  getPhotosyntheticFoliage(time, seasonProgress, dryingSpeed, dryingSharpness, dryingFrontWidth) {
    // Mirror the leaf shader's colour front. A leaf stops contributing as
    // soon as its red phase begins (leafProgress 0.82), even before it falls.
    const progressKey = Math.round(THREE.MathUtils.clamp(seasonProgress, 0, 1) * 1000);
    const cov = this.canopyCoverage ?? 1;
    const cache = this.photosyntheticFoliageCache;
    if (cache && cache.progressKey === progressKey && cache.dryingSpeed === dryingSpeed
        && cache.dryingSharpness === dryingSharpness && cache.dryingFrontWidth === dryingFrontWidth
        && cache.canopyCoverage === cov && time >= cache.atTime
        && time < cache.nextFallTime) return cache.value;
    const speed = Math.max(dryingSpeed, 0.05);
    const sharpness = THREE.MathUtils.clamp(dryingSharpness, 0, 1);
    let selected = 0, producing = 0, nextFallTime = Infinity;
    for (const model of this.models) {
      const count = model.selectedCount ?? 0;
      selected += count;
      if (!model.mesh.visible || count === 0) continue;
      this._ensurePhotoOrder(model, count, sharpness, speed, dryingFrontWidth);
      this._syncFallenUpToTime(model, time);
      const order = model.photoOrder;
      const stopVals = model.photoStopValues;
      const fallen = model.fallenFlags;
      // Advance or retreat photoCursor to match current seasonProgress.
      while (model.photoCursor < count && stopVals[order[model.photoCursor]] <= seasonProgress) {
        const idx = order[model.photoCursor++];
        if (fallen[idx]) {
          model.fallenAfterStop--;
          model.fallenAtOrBeforeStop++;
        }
      }
      while (model.photoCursor > 0 && stopVals[order[model.photoCursor - 1]] > seasonProgress) {
        const idx = order[--model.photoCursor];
        if (fallen[idx]) {
          model.fallenAtOrBeforeStop--;
          model.fallenAfterStop++;
        }
      }
      model.photoLastSeason = seasonProgress;
      if (cov >= 0.9999) {
        producing += Math.max(0, count - model.photoCursor - model.fallenAfterStop);
      } else if (cov > 0) {
        this._ensureCalendarOrder(model, count, sharpness);
        const leafRanks = model.leafRanks;
        for (let i = model.photoCursor; i < count; i++) {
          const idx = order[i];
          if (!fallen[idx] && leafRanks[idx] < cov) producing++;
        }
      }

      const future = model.futureScheduledIndices;
      const times = model.leafFallStartTimes;
      for (let i = 0; i < future.length; i++) {
        const st = times[future[i]];
        if (st > time && st < nextFallTime) nextFallTime = st;
      }
    }
    const value = selected > 0 ? producing / selected : 0;
    this.photosyntheticFoliageCache = { value, progressKey, dryingSpeed, dryingSharpness,
      dryingFrontWidth, canopyCoverage: cov, atTime: time, nextFallTime };
    return value;
  }

  hasUnfinishedLeafFall(time) {
    const fallMultiplier = this.fallMultiplier ?? 1;
    for (const model of this.models) {
      if (!model.mesh.visible) continue;
      const airborne = model.airborneIndices;
      const times = model.leafFallStartTimes;
      for (let i = 0; i < airborne.length; i++) {
        const idx = airborne[i];
        const st = times[idx];
        if (st !== 1000000.0 && time < st + model.fallHeights[idx] / (model.fallBaseSpeeds[idx] * fallMultiplier) + 7.65) {
          return true;
        }
      }
    }
    return false;
  }

  fallDuration(leaf) {
    return leaf.fallHeight / (leaf.fallBaseSpeed * (this.fallMultiplier ?? 1)) + 0.65 + 7;
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
    for (const model of this.models) {
      const { mesh, leaves, scheduledIndices } = model;
      mesh.frustumCulled = true;
      const startTimes = mesh.geometry.attributes.leafFallStartTime;
      const startArr = startTimes.array;
      const leafTimes = model.leafFallStartTimes;
      let changed = false;
      let minStartVert = Infinity, maxStartVert = -1;
      for (let i = 0; i < scheduledIndices.length; i++) {
        const idx = scheduledIndices[i];
        const leaf = leaves[idx];
        model.scheduledFlags[idx] = 0;
        model.fallenFlags[idx] = 0;
        if (leaf.fallStartTime === 1000000.0) continue;
        leaf.fallStartTime = 1000000.0;
        leafTimes[idx] = 1000000.0;
        for (const v of leaf.vertices) {
          startArr[v] = 1000000.0;
          if (v < minStartVert) minStartVert = v;
          if (v > maxStartVert) maxStartVert = v;
        }
        changed = true;
      }
      scheduledIndices.length = 0;
      model.airborneIndices.length = 0;
      model.futureScheduledIndices.length = 0;
      model.fallenCount = 0;
      model.fallenAtOrBeforeStop = 0;
      model.fallenAfterStop = 0;
      model.calendarCursor = 0;
      model.triggerCursor = 0;
      if (changed) {
        if (maxStartVert >= minStartVert && startTimes.clearUpdateRanges) {
          startTimes.clearUpdateRanges();
          startTimes.addUpdateRange(minStartVert, maxStartVert - minStartVert + 1);
        }
        startTimes.needsUpdate = true;
      }
    }
  }

  applySize() {
    const scale = this.growthUniform ? this.scale : this.scale * this.growthProgress;
    for (const { mesh, original, vertexCenter } of this.models) {
      const position = mesh.geometry.attributes.position;
      const arr = position.array;
      for (let i = 0; i < arr.length; i++) {
        const c = vertexCenter[i];
        arr[i] = c + (original[i] - c) * scale;
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
    if (this.growthUniform) {
      this.growthUniform.value = next;
    } else {
      this.applySize();
    }
  }

  setCanopyCoverage(coverage, sharpness) {
    this.canopyCoverage = coverage;
    this.canopySharpness = sharpness;
    this.foliageCache = null;
    this.photosyntheticFoliageCache = null;
    if (coverage < 1) {
      for (const model of this.models) this._ensureCalendarOrder(model, model.selectedCount ?? 0, sharpness);
    }
  }

  maxForBaseCount(baseCount) {
    if (!this.total) return 0;
    const max = Math.min(MAX_LEAF_COUNT, this.total * LEAF_MULTIPLIER);
    return Math.round(max * baseCount / this.total);
  }

  applyCount() {
    // Visibility is initialized before the GLB arrives. Keep the requested
    // count until there are meshes to measure instead of clamping it to zero.
    if (this.models.length === 0) return;
    this.foliageCache = null;
    this.photosyntheticFoliageCache = null;
    const enabled = this.models.filter((model, i) => this.type === 'all' || String(i) === this.type);
    const baseTotal = enabled.reduce((sum, model) => sum + model.baseCount, 0);
    this.countInput.max = this.maxForBaseCount(baseTotal);
    this.count = Math.max(0, Math.min(Math.round(this.count), Number(this.countInput.max)));
    this.countInput.value = this.count;
    let remaining = this.count;
    this.models.forEach((model) => {
      const { mesh, baseCount, ends, leaves } = model;
      const isEnabled = enabled.includes(model);
      const count = !isEnabled ? 0 : model === enabled.at(-1)
        ? remaining : Math.round(this.count * baseCount / baseTotal);
      if (mesh.geometry.hasAttribute('leafFallStartTime')) {
        const times = mesh.geometry.attributes.leafFallStartTime;
        const startArr = times.array;
        const leafTimes = model.leafFallStartTimes;
        const fallenFlags = model.fallenFlags;
        const before = model.selectedCount ?? 0;
        const resetFrom = this.visible ? count : 0;
        let reset = false;
        let minResetVert = Infinity, maxResetVert = -1;
        for (let index = resetFrom; index < before; index++) {
          const leaf = leaves[index];
          model.scheduledFlags[index] = 0;
          if (fallenFlags[index]) {
            fallenFlags[index] = 0;
            model.fallenCount--;
          }
          if (leaf.fallStartTime === 1000000.0) continue;
          leaf.fallStartTime = 1000000.0;
          leafTimes[index] = 1000000.0;
          for (const v of leaf.vertices) {
            startArr[v] = 1000000.0;
            if (v < minResetVert) minResetVert = v;
            if (v > maxResetVert) maxResetVert = v;
          }
          reset = true;
        }
        if (reset) {
          if (maxResetVert >= minResetVert && times.clearUpdateRanges) {
            times.clearUpdateRanges();
            times.addUpdateRange(minResetVert, maxResetVert - minResetVert + 1);
          }
          times.needsUpdate = true;
          model.calendarCursor = 0;
          model.triggerCursor = 0;
          model.cachedPhotoKey = '';
        }
      }
      if (model.selectedCount !== count) {
        model.selectedCount = count;
        if (this.canopyCoverage < 1) this._ensureCalendarOrder(model, count, this.canopySharpness);
        model.cachedPhotoKey = '';
        this.needsResort = true;
        this.sortModelPending = (1 << this.models.length) - 1;
      }
      mesh.geometry.setDrawRange(0, ends[count]);
      mesh.visible = isEnabled && this.visible;
      remaining -= count;
    });
    const formatted = this.count.toLocaleString('cs-CZ');
    this.countLabel.textContent = formatted;
    if (this.canopyLabel) this.canopyLabel.textContent = `🍃 Koruna a listy (${formatted} listů)`;
  }

  _sortLeafRange(model, dstArr, startLeaf, endLeaf, camX, camY, camZ) {
    const srcArr = model.baseSortedIndices;
    const centers = model.centers;
    const { counts, offsets, buckets, dots } = model.sortScratch;
    const rangeCount = endLeaf - startLeaf;
    if (rangeCount <= 1) {
      if (rangeCount === 1) {
        const s = model.ends[startLeaf];
        const e = model.ends[startLeaf + 1];
        for (let k = s; k < e; k++) dstArr[k] = srcArr[k];
      }
      return;
    }
    let minD = Infinity, maxD = -Infinity;
    for (let i = startLeaf; i < endLeaf; i++) {
      const c3 = i * 3;
      const cx = centers[c3] - camX;
      const cy = centers[c3 + 1] - camY;
      const cz = centers[c3 + 2] - camZ;
      const d = cx * cx + cy * cy + cz * cz;
      dots[i] = d;
      if (d < minD) minD = d;
      if (d > maxD) maxD = d;
    }
    const span = maxD - minD;
    if (span <= 1e-6) {
      const startIdx = model.ends[startLeaf];
      const endIdx = model.ends[endLeaf];
      for (let k = startIdx; k < endIdx; k++) dstArr[k] = srcArr[k];
      return;
    }
    const invSpan = SORT_BUCKETS / span;
    counts.fill(0);
    const uniformQuads = model.uniformQuadIndices;
    for (let i = startLeaf; i < endLeaf; i++) {
      let b = ((dots[i] - minD) * invSpan) | 0;
      if (b < 0) b = 0;
      else if (b >= SORT_BUCKETS) b = SORT_BUCKETS - 1;
      buckets[i] = b;
      counts[b] += uniformQuads ? 6 : (model.ends[i + 1] - model.ends[i]);
    }
    let acc = model.ends[startLeaf];
    for (let b = 0; b < SORT_BUCKETS; b++) {
      offsets[b] = acc;
      acc += counts[b];
    }
    if (uniformQuads) {
      for (let i = startLeaf; i < endLeaf; i++) {
        const dst = offsets[buckets[i]];
        offsets[buckets[i]] = dst + 6;
        const src = i * 6;
        dstArr[dst] = srcArr[src];
        dstArr[dst + 1] = srcArr[src + 1];
        dstArr[dst + 2] = srcArr[src + 2];
        dstArr[dst + 3] = srcArr[src + 3];
        dstArr[dst + 4] = srcArr[src + 4];
        dstArr[dst + 5] = srcArr[src + 5];
      }
    } else {
      for (let i = startLeaf; i < endLeaf; i++) {
        const s = model.ends[i];
        const e = model.ends[i + 1];
        const len = e - s;
        const dst = offsets[buckets[i]];
        offsets[buckets[i]] = dst + len;
        for (let k = 0; k < len; k++) dstArr[dst + k] = srcArr[s + k];
      }
    }
  }

  // Reorder active indices roughly front-to-back in O(N) when the camera moves significantly,
  // staggering one mesh per frame so orbiting never causes a multi-mesh spike,
  // while keeping [0..baseCount) first so onBeforeShadow can slice the original layer unchanged.
  sortLeavesForCamera(cameraPosition) {
    if (!this.visible || this.models.length === 0 || !cameraPosition) return;
    const dx = cameraPosition.x;
    const dy = cameraPosition.y - 13.0;
    const dz = cameraPosition.z;
    const dist = Math.hypot(dx, dy, dz) || 1;
    const nx = dx / dist, ny = dy / dist, nz = dz / dist;
    if (this.hasSortedView && !this.needsResort && this.sortModelPending === 0) {
      const dot = nx * this.lastSortDir.x + ny * this.lastSortDir.y + nz * this.lastSortDir.z;
      const distChange = Math.abs(dist - this.lastSortDist) / (this.lastSortDist || 1);
      if (dot > 0.93 && distChange < 0.25) return;
    }
    if (this.sortModelPending === 0 || this.needsResort) {
      this.lastSortDir.set(nx, ny, nz);
      this.lastSortDist = dist;
      this.hasSortedView = true;
      this.needsResort = false;
      this.sortModelPending = (1 << this.models.length) - 1;
    }

    const camX = cameraPosition.x, camY = cameraPosition.y, camZ = cameraPosition.z;
    for (let mIdx = 0; mIdx < this.models.length; mIdx++) {
      const bit = 1 << mIdx;
      if ((this.sortModelPending & bit) === 0) continue;
      this.sortModelPending &= ~bit;
      const model = this.models[mIdx];
      const count = model.selectedCount ?? 0;
      if (!model.mesh.visible || count <= 1) continue;
      const indexAttr = model.mesh.geometry.index;
      const dstArr = indexAttr.array;
      const baseLimit = Math.min(count, model.baseCount);

      this._sortLeafRange(model, dstArr, 0, baseLimit, camX, camY, camZ);
      this._sortLeafRange(model, dstArr, baseLimit, count, camX, camY, camZ);
      if (indexAttr.clearUpdateRanges) {
        indexAttr.clearUpdateRanges();
        indexAttr.addUpdateRange(0, model.ends[count]);
      }
      indexAttr.needsUpdate = true;
      // Sort at most one leaf mesh per frame to keep orbit frame pacing smooth.
      break;
    }
  }

  setType(type) {
    if (!['all', '0', '1'].includes(type) || type === this.type) return;
    const originalCount = selected => this.models.reduce((sum, model, i) => sum + (selected === 'all' || String(i) === selected ? model.baseCount : 0), 0);
    // Isolating a type preserves density instead of doubling its population.
    const density = this.count / (originalCount(this.type) || 1);
    const atMaximum = this.count === this.maxForBaseCount(originalCount(this.type));
    this.type = type;
    const baseCount = originalCount(type);
    this.count = atMaximum ? this.maxForBaseCount(baseCount) : Math.round(density * baseCount);
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
