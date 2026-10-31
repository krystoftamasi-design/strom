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
    this.worker = new Worker(new URL('./canopy_occlusion_worker.js?v=sky-1', import.meta.url), { type: 'module' });
    this.worker.onmessage = ({ data }) => {
      this.busy = false;
      if (data.error) console.warn('Zastínění koruny:', data.error);
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
      }
      this.startPending();
    };
    this.worker.onerror = event => { this.busy = false; console.warn('Zastínění koruny:', event.message); };
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
    const wood = [], leaves = [], samples = [];
    this.targets = [];
    const leafMeshes = new Set(controls.models.map(m => m.mesh));
    const p = new THREE.Vector3(), uv = new THREE.Vector2();
    model.traverse(mesh => {
      if (!mesh.isMesh || !mesh.visible || leafMeshes.has(mesh)) return;
      const geometry = mesh.geometry, positions = geometry.attributes.position, indices = geometry.index;
      const count = Math.min(indices?.count ?? positions.count, geometry.drawRange.count);
      // The full Blender mesh can contain a million tiny triangles. Sampling
      // its surface at a bounded rate is sufficient for this coarse volume.
      const stride = Math.max(1, Math.ceil(count / 3 / 90000));
      for (let i = 0; i < count; i += 3 * stride) {
        for (let j = 0; j < 3; j++) {
          p.fromBufferAttribute(positions, indices ? indices.getX(i + j) : i + j).applyMatrix4(mesh.matrixWorld);
          wood.push(p.x, p.y, p.z);
        }
      }
    });
    controls.models.forEach(({ mesh, leaves: records, ends }, type) => {
      if (!mesh.visible) return;
      const geometry = mesh.geometry, positions = geometry.attributes.position, indices = geometry.index;
      const textureUv = geometry.attributes.uv, count = Math.min(indices.count, geometry.drawRange.count);
      for (let i = 0; i < count; i += 3) {
        const vertexIds = [indices.getX(i), indices.getX(i + 1), indices.getX(i + 2)];
        for (const vertex of vertexIds) {
          p.fromBufferAttribute(positions, vertex).applyMatrix4(mesh.matrixWorld); leaves.push(p.x, p.y, p.z);
        }
        for (const vertex of vertexIds) { uv.fromBufferAttribute(textureUv, vertex); leaves.push(uv.x, uv.y); }
        leaves.push(type);
      }
      const center = new THREE.Vector3();
      for (let i = 0; i < records.length && ends[i + 1] <= count; i++) {
        const record = records[i]; center.copy(record.center).applyMatrix4(mesh.matrixWorld);
        let radius = 0;
        for (const vertex of record.vertices) {
          p.fromBufferAttribute(positions, vertex).applyMatrix4(mesh.matrixWorld); radius = Math.max(radius, p.distanceTo(center));
        }
        samples.push(center.x, center.y, center.z, radius);
        this.targets.push({ geometry, vertices: record.vertices });
      }
    });
    const job = { id, bounds: [...box.min.toArray(), ...box.max.toArray()],
      wood: new Float32Array(wood), leaves: new Float32Array(leaves), samples: new Float32Array(samples), ...this.masks() };
    this.worker.postMessage(job, [job.wood.buffer, job.leaves.buffer, job.samples.buffer, ...job.masks.map(mask => mask.buffer)]);
  }
}
