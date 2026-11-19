import * as THREE from 'three';

// One precomputed scalar per leaf. Geometry extraction is done only on edits;
// voxel construction and sky rays run in a worker, never in the render loop.
export class CanopyOcclusion {
  constructor(reference, uniforms) {
    this.reference = reference;
    this.uniforms = uniforms;
    this.revision = 0;
    this.appliedRevision = 0;
    this.computations = 0;
    this.initialWaiters = [];
    this.worker = new Worker(new URL('./canopy_occlusion_worker.js?v=sky-1', import.meta.url), { type: 'module' });
    this.worker.onmessage = ({ data }) => {
      this.busy = false;
      if (data.error) {
        console.warn('Zastínění koruny:', data.error);
        if (data.id === this.revision) this.finishInitial();
      }
      else if (data.id === this.revision) {
        const buffers = new Map();
        for (let i = 0; i < this.targets.length; i++) {
          const { geometry, vertices } = this.targets[i];
          const attribute = geometry.attributes.canopyVisibility;
          if (!buffers.has(geometry)) { attribute.array.fill(1); buffers.set(geometry, attribute); }
          for (const vertex of vertices) attribute.array[vertex] = data.values[i];
        }
        for (const attribute of buffers.values()) attribute.needsUpdate = true;
        this.appliedRevision = data.id;
        this.durationMs = data.durationMs;
        this.computations++;
        this.finishInitial();
      }
      this.startPending();
    };
    this.worker.onerror = event => {
      this.busy = false;
      console.warn('Zastínění koruny:', event.message);
      this.finishInitial();
    };
  }

  waitForInitial() {
    if (this.appliedRevision === this.revision && !this.busy && !this.pending) return Promise.resolve();
    return new Promise(resolve => this.initialWaiters.push(resolve));
  }

  finishInitial() {
    for (const resolve of this.initialWaiters.splice(0)) resolve();
  }

  request(model, controls) {
    // Attach before the first material compilation, including expanded leaves.
    for (const { mesh } of controls.models) {
      if (!mesh.geometry.attributes.canopyVisibility) mesh.geometry.setAttribute('canopyVisibility',
        new THREE.BufferAttribute(new Float32Array(mesh.geometry.attributes.position.count).fill(1), 1));
    }
    this.revision++;
    this.pending = { model, controls, id: this.revision };
    this.startPending();
  }

  masks() {
    const size = 32, strength = this.uniforms.uLeafAlphaStrength.value, mode = this.uniforms.uAlphaMode.value;
    const result = this.reference.stableAlpha.map((texture, type) => {
      const output = new Float32Array(size * size);
      if (mode > 1.5) {
        const { data, width, height } = texture.image;
        const blockX = width / size, blockY = height / size;
        for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
          const index = Math.floor(y / blockY) * size + Math.floor(x / blockX);
          output[index] += Math.min(1, data[(y * width + x) * 4 + 3] / 255 * strength) / (blockX * blockY);
        }
      } else {
        const image = this.reference.alpha[type].image;
        const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
        const context = canvas.getContext('2d', { willReadFrequently: true }); context.drawImage(image, 0, 0);
        const { data } = context.getImageData(0, 0, image.width, image.height);
        const counts = new Uint32Array(size * size);
        for (let y = 0; y < image.height; y++) for (let x = 0; x < image.width; x++) {
          let alpha = data[(y * image.width + x) * 4 + 3] / 255;
          if (type === 1) alpha = Math.max(0, Math.min(1, (alpha - 0.6145453453) / (1 - 0.6145453453)));
          const index = Math.floor(y / image.height * size) * size + Math.floor(x / image.width * size);
          output[index] += alpha * strength >= 0.5 ? 1 : 0; counts[index]++;
        }
        output.forEach((value, i) => output[i] = value / Math.max(1, counts[i]));
      }
      return output;
    });
    return { masks: result, maskSize: size };
  }

  startPending() {
    if (this.busy || !this.pending) return;
    const { model, controls, id } = this.pending;
    this.pending = null; this.busy = true;
    model.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(model);
    const leafMeshes = new Set(controls.models.map(m => m.mesh));

    // Pre-size typed buffers to avoid huge dynamic JS arrays at high leaf counts.
    let woodTriCount = 0;
    const woodMeshes = [];
    model.traverse(mesh => {
      if (!mesh.isMesh || !mesh.visible || leafMeshes.has(mesh)) return;
      const geometry = mesh.geometry, positions = geometry.attributes.position, indices = geometry.index;
      const count = Math.min(indices?.count ?? positions.count, geometry.drawRange.count);
      const stride = Math.max(1, Math.ceil(count / 3 / 90000));
      const tris = Math.ceil(count / (3 * stride));
      woodTriCount += tris;
      woodMeshes.push({ mesh, count, stride });
    });

    let leafTriCount = 0;
    let sampleCount = 0;
    const leafEntries = [];
    controls.models.forEach((m, type) => {
      const { mesh, leaves: records, ends } = m;
      if (!mesh.visible) return;
      const indices = mesh.geometry.index;
      const count = Math.min(indices.count, mesh.geometry.drawRange.count);
      const tris = Math.floor(count / 3);
      let recCount = m.selectedCount ?? 0;
      while (recCount > 0 && ends[recCount] > count) recCount--;
      if (recCount === 0 && records.length > 0) {
        for (let i = 0; i < records.length && ends[i + 1] <= count; i++) recCount++;
      }
      leafTriCount += tris;
      sampleCount += recCount;
      leafEntries.push({ mesh, records, count, recCount, type });
    });

    const wood = new Float32Array(woodTriCount * 9);
    let woodOffset = 0;
    for (const { mesh, count, stride } of woodMeshes) {
      const geometry = mesh.geometry, positions = geometry.attributes.position, indices = geometry.index;
      const posArr = positions.array, idxArr = indices?.array;
      const directPos = positions.itemSize === 3 && !positions.isInterleavedBufferAttribute && posArr instanceof Float32Array;
      const m = mesh.matrixWorld.elements;
      const isId = m[0] === 1 && m[5] === 1 && m[10] === 1 && m[15] === 1
        && m[1] === 0 && m[2] === 0 && m[3] === 0 && m[4] === 0
        && m[6] === 0 && m[7] === 0 && m[8] === 0 && m[9] === 0
        && m[11] === 0 && m[12] === 0 && m[13] === 0 && m[14] === 0;
      for (let i = 0; i < count; i += 3 * stride) {
        for (let j = 0; j < 3; j++) {
          const vi = idxArr ? idxArr[i + j] : (indices ? indices.getX(i + j) : i + j);
          const x = directPos ? posArr[vi * 3] : positions.getX(vi);
          const y = directPos ? posArr[vi * 3 + 1] : positions.getY(vi);
          const z = directPos ? posArr[vi * 3 + 2] : positions.getZ(vi);
          if (isId) {
            wood[woodOffset++] = x;
            wood[woodOffset++] = y;
            wood[woodOffset++] = z;
          } else {
            wood[woodOffset++] = m[0] * x + m[4] * y + m[8] * z + m[12];
            wood[woodOffset++] = m[1] * x + m[5] * y + m[9] * z + m[13];
            wood[woodOffset++] = m[2] * x + m[6] * y + m[10] * z + m[14];
          }
        }
      }
    }

    const leaves = new Float32Array(leafTriCount * 16);
    const samples = new Float32Array(sampleCount * 4);
    this.targets = new Array(sampleCount);
    let leafOffset = 0, sampleOffset = 0, targetIndex = 0;

    for (const { mesh, records, count, recCount, type } of leafEntries) {
      const geometry = mesh.geometry, positions = geometry.attributes.position, indices = geometry.index;
      const textureUv = geometry.attributes.uv;
      const posArr = positions.array, uvArr = textureUv.array, idxArr = indices.array;
      const directPos = positions.itemSize === 3 && !positions.isInterleavedBufferAttribute && posArr instanceof Float32Array;
      const directUv = textureUv.itemSize === 2 && !textureUv.isInterleavedBufferAttribute && uvArr instanceof Float32Array;
      const m = mesh.matrixWorld.elements;
      const isId = m[0] === 1 && m[5] === 1 && m[10] === 1 && m[15] === 1
        && m[1] === 0 && m[2] === 0 && m[3] === 0 && m[4] === 0
        && m[6] === 0 && m[7] === 0 && m[8] === 0 && m[9] === 0
        && m[11] === 0 && m[12] === 0 && m[13] === 0 && m[14] === 0;
      for (let i = 0; i + 2 < count; i += 3) {
        const i0 = idxArr[i], i1 = idxArr[i + 1], i2 = idxArr[i + 2];
        for (const vi of [i0, i1, i2]) {
          const x = directPos ? posArr[vi * 3] : positions.getX(vi);
          const y = directPos ? posArr[vi * 3 + 1] : positions.getY(vi);
          const z = directPos ? posArr[vi * 3 + 2] : positions.getZ(vi);
          if (isId) {
            leaves[leafOffset++] = x;
            leaves[leafOffset++] = y;
            leaves[leafOffset++] = z;
          } else {
            leaves[leafOffset++] = m[0] * x + m[4] * y + m[8] * z + m[12];
            leaves[leafOffset++] = m[1] * x + m[5] * y + m[9] * z + m[13];
            leaves[leafOffset++] = m[2] * x + m[6] * y + m[10] * z + m[14];
          }
        }
        for (const vi of [i0, i1, i2]) {
          leaves[leafOffset++] = directUv ? uvArr[vi * 2] : textureUv.getX(vi);
          leaves[leafOffset++] = directUv ? uvArr[vi * 2 + 1] : textureUv.getY(vi);
        }
        leaves[leafOffset++] = type;
      }
      for (let i = 0; i < recCount; i++) {
        const record = records[i];
        const rc = record.center;
        const cx = isId ? rc.x : m[0] * rc.x + m[4] * rc.y + m[8] * rc.z + m[12];
        const cy = isId ? rc.y : m[1] * rc.x + m[5] * rc.y + m[9] * rc.z + m[13];
        const cz = isId ? rc.z : m[2] * rc.x + m[6] * rc.y + m[10] * rc.z + m[14];
        let radiusSq = 0;
        const verts = record.vertices;
        for (let k = 0; k < verts.length; k++) {
          const vi = verts[k];
          const x = directPos ? posArr[vi * 3] : positions.getX(vi);
          const y = directPos ? posArr[vi * 3 + 1] : positions.getY(vi);
          const z = directPos ? posArr[vi * 3 + 2] : positions.getZ(vi);
          const wx = isId ? x : m[0] * x + m[4] * y + m[8] * z + m[12];
          const wy = isId ? y : m[1] * x + m[5] * y + m[9] * z + m[13];
          const wz = isId ? z : m[2] * x + m[6] * y + m[10] * z + m[14];
          const dx = wx - cx, dy = wy - cy, dz = wz - cz;
          const dSq = dx * dx + dy * dy + dz * dz;
          if (dSq > radiusSq) radiusSq = dSq;
        }
        samples[sampleOffset++] = cx;
        samples[sampleOffset++] = cy;
        samples[sampleOffset++] = cz;
        samples[sampleOffset++] = Math.sqrt(radiusSq);
        this.targets[targetIndex++] = { geometry, vertices: verts };
      }
    }
    const job = {
      id,
      bounds: [...box.min.toArray(), ...box.max.toArray()],
      wood: woodOffset === wood.length ? wood : wood.subarray(0, woodOffset),
      leaves: leafOffset === leaves.length ? leaves : leaves.subarray(0, leafOffset),
      samples,
      ...this.masks()
    };
    this.worker.postMessage(job, [job.wood.buffer, job.leaves.buffer, job.samples.buffer, ...job.masks.map(mask => mask.buffer)]);
  }
}
