// A stable crown origin for both leaf types and all density layers. Drying
// combines 3D distance with height, so upper outer leaves change first.
// Filtering/count/size controls must not move the origin or reorder leaves.
function spatialHash(x, y, z) {
  let value = Math.imul(x, 73856093) ^ Math.imul(y, 19349663) ^ Math.imul(z, 83492791);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296 * 2-1;
}

function crownNoise(point) {
  const x = point.x/1.4, y = point.y/1.4, z = point.z/1.4;
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const smooth = t => t*t*(3-2*t);
  const fx = smooth(x-ix), fy = smooth(y-iy), fz = smooth(z-iz);
  const mix = (a,b,t) => a+(b-a)*t;
  const row = (dy,dz) => mix(spatialHash(ix,iy+dy,iz+dz), spatialHash(ix+1,iy+dy,iz+dz), fx);
  return mix(mix(row(0,0),row(1,0),fy), mix(row(0,1),row(1,1),fy), fz);
}

export function radialSeasonProfile(baseCenters, centers, heightFraction = 0.60) {
  if (!baseCenters.length) return { center: { x: 0, y: 0, z: 0 }, radii: [], priorities: [] };
  const low = { x: Infinity, y: Infinity, z: Infinity };
  const high = { x: -Infinity, y: -Infinity, z: -Infinity };
  for (const point of baseCenters) {
    for (const axis of ['x', 'y', 'z']) {
      low[axis] = Math.min(low[axis], point[axis]);
      high[axis] = Math.max(high[axis], point[axis]);
    }
  }
  const center = {
    x: (low.x + high.x) * 0.5,
    y: low.y + (high.y - low.y) * heightFraction,
    z: (low.z + high.z) * 0.5
  };
  const distances = centers.map(point => Math.hypot(point.x-center.x, point.y-center.y, point.z-center.z));
  let nearest = Infinity, farthest = 0;
  for (const distance of distances) {
    nearest = Math.min(nearest, distance);
    farthest = Math.max(farthest, distance);
  }
  const span = farthest-nearest;
  const radii = distances.map(distance => span > 1e-6 ? (distance-nearest)/span : 1);
  const heightSpan = high.y-low.y;
  const heights = centers.map(point => heightSpan > 1e-6 ? Math.max(0, Math.min(1, (point.y-low.y)/heightSpan)) : 0.5);
  // Let distance lead the wave around the crown instead of isolating its top.
  const scores = centers.map((point, index) => radii[index]*0.65 + heights[index]*0.35);
  let first = 0, last = Infinity;
  for (const score of scores) { first = Math.max(first, score); last = Math.min(last, score); }
  const scoreSpan = first-last;
  return {
    center,
    radii,
    priorities: scores.map((score, index) => {
      const priority = scoreSpan > 1e-6 ? (score-last)/scoreSpan : 1;
      // Delay the bottom independently, after normalization, so its distant
      // branch tips cannot start too early merely because of their radius.
      const upperBlend = Math.max(0, Math.min(1, (heights[index]-0.20)/0.40));
      const readiness = upperBlend*upperBlend*(3-2*upperBlend);
      // Stable patches plus a small per-leaf variation break up the frontier.
      // Neither time nor the camera enters the seed, so this cannot shimmer.
      const point = centers[index];
      const leafNoise = spatialHash(Math.round(point.x*2048), Math.round(point.y*2048), Math.round(point.z*2048));
      const irregular = priority+crownNoise(point)*0.16+leafNoise*0.10;
      return Math.max(0,Math.min(1,irregular)) * (0.15+0.85*readiness);
    })
  };
}
