// Approximate diffuse sky visibility in world space. This is not a screen-space
// effect: deterministic directions and a fixed voxel field never follow camera.
const now = () => performance.now();

export function computeCanopyVisibility({ bounds, wood, leaves, samples, masks, maskSize }) {
  const start = now();
  const low = bounds.slice(0, 3), high = bounds.slice(3, 6);
  const cell = Math.max(0.32, ...high.map((v, i) => (v - low[i]) / 88));
  for (let i = 0; i < 3; i++) { low[i] -= cell * 2; high[i] += cell * 2; }
  const size = high.map((v, i) => Math.ceil((v - low[i]) / cell) + 1);
  const [nx, ny, nz] = size, plane = nx * ny;
  const density = new Float32Array(plane * nz);
  const occupied = new Uint8Array(density.length);
  const inv = 1 / cell, volume = cell ** 3;
  function deposit(x, y, z, amount) {
    const ix = Math.floor((x - low[0]) * inv), iy = Math.floor((y - low[1]) * inv), iz = Math.floor((z - low[2]) * inv);
    if (ix >= 0 && ix < nx && iy >= 0 && iy < ny && iz >= 0 && iz < nz)
      density[ix + nx * iy + plane * iz] += amount;
  }
  function rasterize(array, stride, isLeaf) {
    for (let offset = 0; offset < array.length; offset += stride) {
      const ax = array[offset], ay = array[offset + 1], az = array[offset + 2];
      const ux = array[offset + 3] - ax, uy = array[offset + 4] - ay, uz = array[offset + 5] - az;
      const vx = array[offset + 6] - ax, vy = array[offset + 7] - ay, vz = array[offset + 8] - az;
      const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
      const area = Math.hypot(cx, cy, cz) * 0.5;
      if (area < 1e-10) continue;
      // Area samples preserve thin branches without filling their bounding boxes.
      const steps = Math.min(24, Math.max(1, Math.ceil(Math.sqrt(area / (cell * cell)) * 3)));
      const count = steps * steps;
      const weight = area / count / volume * (isLeaf ? 0.8 : 3.0);
      const mask = isLeaf ? masks[array[offset + 15]] : null;
      for (let k = 0; k < count; k++) {
        const s = Math.sqrt((k + 0.5) / count), t = ((k * 0.6180339887498949) + 0.5) % 1;
        const b = s * (1 - t), c = s * t, a = 1 - b - c;
        let opacity = 1;
        if (isLeaf) {
          const u = a * array[offset + 9] + b * array[offset + 11] + c * array[offset + 13];
          const v = a * array[offset + 10] + b * array[offset + 12] + c * array[offset + 14];
          const px = Math.min(maskSize - 1, Math.max(0, Math.floor(u * maskSize)));
          const py = Math.min(maskSize - 1, Math.max(0, Math.floor(v * maskSize)));
          opacity = mask[py * maskSize + px];
        }
        if (opacity > 0) deposit(ax + b * ux + c * vx, ay + b * uy + c * vy, az + b * uz + c * vz, weight * opacity);
      }
    }
  }
  rasterize(wood, 9, false);
  rasterize(leaves, 16, true);
  // Mark interpolation cells that touch at least one nonempty grid point.
  for (let z = 0; z < nz - 1; z++) {
    for (let y = 0; y < ny - 1; y++) {
      const row = z * plane + y * nx;
      for (let x = 0; x < nx - 1; x++) {
        const i = row + x;
        if (density[i] || density[i + 1] || density[i + nx] || density[i + nx + 1] ||
            density[i + plane] || density[i + plane + 1] ||
            density[i + plane + nx] || density[i + plane + nx + 1]) occupied[i] = 1;
      }
    }
  }
  function sampleDensity(x, y, z) {
    const fx = (x - low[0]) * inv - 0.5, fy = (y - low[1]) * inv - 0.5, fz = (z - low[2]) * inv - 0.5;
    const ix = Math.floor(fx), iy = Math.floor(fy), iz = Math.floor(fz);
    if (ix < 0 || iy < 0 || iz < 0 || ix + 1 >= nx || iy + 1 >= ny || iz + 1 >= nz) return 0;
    const i = ix + nx * iy + plane * iz;
    if (!occupied[i]) return 0;
    const tx = fx - ix, ty = fy - iy, tz = fz - iz;
    const a = density[i] * (1 - tx) + density[i + 1] * tx;
    const b = density[i + nx] * (1 - tx) + density[i + nx + 1] * tx;
    const c = density[i + plane] * (1 - tx) + density[i + plane + 1] * tx;
    const d = density[i + plane + nx] * (1 - tx) + density[i + plane + nx + 1] * tx;
    return ((a * (1 - ty) + b * ty) * (1 - tz) + (c * (1 - ty) + d * ty) * tz);
  }
  const rays = 24, directions = [];
  for (let i = 0; i < rays; i++) {
    const y = Math.sqrt((i + 0.5) / rays), radius = Math.sqrt(1 - y * y), angle = i * 2.399963229728653;
    directions.push([Math.cos(angle) * radius, y, Math.sin(angle) * radius]);
  }
  const result = new Float32Array(samples.length / 4), step = cell * 0.85;
  const maxDistance = Math.hypot(...high.map((v, i) => v - low[i]));
  for (let i = 0; i < result.length; i++) {
    const x = samples[i * 4], y = samples[i * 4 + 1], z = samples[i * 4 + 2];
    // Skip the leaf itself and its voxel footprint, regardless of its size.
    const startDistance = Math.max(cell * 1.6, samples[i * 4 + 3] + cell);
    let visibility = 0;
    for (const [dx, dy, dz] of directions) {
      let opticalDepth = 0;
      for (let distance = startDistance; distance < maxDistance; distance += step) {
        const px = x + dx * distance, py = y + dy * distance, pz = z + dz * distance;
        if (px < low[0] || px >= high[0] || py < low[1] || py >= high[1] || pz < low[2] || pz >= high[2]) break;
        opticalDepth += sampleDensity(px, py, pz) * step;
        if (opticalDepth > 4.6) break;
      }
      visibility += Math.exp(-opticalDepth);
    }
    result[i] = visibility / rays;
  }
  return { values: result, durationMs: now() - start, cells: density.length };
}

if (typeof self !== 'undefined' && typeof document === 'undefined') self.onmessage = ({ data }) => {
  try {
    const result = computeCanopyVisibility(data);
    self.postMessage({ id: data.id, ...result }, [result.values.buffer]);
  } catch (error) { self.postMessage({ id: data.id, error: String(error) }); }
};
