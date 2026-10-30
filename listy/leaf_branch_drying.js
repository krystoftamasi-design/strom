// Branch paths and compact leaf regions are baked from the source Blender mesh.
// Loading or moving a slider never runs a geometry/path search.
let referencePromise;

export function loadBranchDryingReference() {
  return referencePromise ??= fetch(new URL('../web_assets/branch_drying_reference.json?v=1', import.meta.url))
    .then(response => {
      if (!response.ok) throw Error(`Nelze načíst cesty větví (${response.status})`);
      return response.json();
    });
}

function random(seed) {
  seed = Math.imul(seed ^ (seed >>> 16), 0x45d9f3b);
  seed = Math.imul(seed ^ (seed >>> 16), 0x45d9f3b);
  return ((seed ^ (seed >>> 16)) >>> 0) / 4294967296;
}

// Approximate the path-space depth of 1–2 neighboring regions. This is a
// spatial band, independent of how quickly a leaf changes its color.
export function branchDryingFrontWidth(reference) {
  const bounds = reference.regions.map(() => [Infinity, -Infinity, 0]);
  for (const leaves of reference.leaves) for (const [, region, distance] of leaves) {
    const bound = bounds[region];
    bound[0] = Math.min(bound[0], distance);
    bound[1] = Math.max(bound[1], distance);
    bound[2]++;
  }
  const spans = bounds.filter(bound => bound[2] > 1).map(bound => bound[1] - bound[0]).sort((a, b) => a - b);
  const median = spans[Math.floor(spans.length / 2)] || 0.5;
  return 0.38 * 1.5 * median / (reference.distanceRange[1] - reference.distanceRange[0]);
}

export function createBranchDryingProfile(reference) {
  if (reference?.version !== 1 || reference.leaves?.length !== 2 || !reference.regions?.length)
    throw Error('Chybí předpočítaná data schnutí po větvích');
  const [minimum, maximum] = reference.distanceRange;
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || maximum <= minimum)
    throw Error('Neplatný rozsah cest větví');
  const regions = reference.regions.map((region, index) => {
    if (!Number.isFinite(region.distance) || region.count < 1 || region.count > reference.targetRegionSize)
      throw Error('Neplatná skupina listů');
    return (region.distance - minimum) / (maximum - minimum) + (random(index + 19001) - 0.5) * 0.18;
  });
  const bindings = reference.leaves.map(leaves => new Map(leaves.map(([key, region, distance]) => {
    if (!Number.isInteger(region) || region < 0 || region >= regions.length || !Number.isFinite(distance))
      throw Error('Neplatné napojení listu na větev');
    return [key, { region, distance }];
  })));
  if (bindings.reduce((count, map) => count + map.size, 0) !== reference.originalLeafCount)
    throw Error('Počet listů neodpovídá předpočítaným cestám');
  return {
    origin: { x: reference.origin[0], y: reference.origin[1], z: reference.origin[2] },
    stats: { precomputed: true, regionCount: regions.length, originalLeafCount: reference.originalLeafCount,
      targetRegionSize: reference.targetRegionSize, distanceRange: [...reference.distanceRange], source: reference.source },
    leaf(type, key, layer = 0) {
      const binding = bindings[type]?.get(key);
      if (!binding) throw Error(`List ${type}:${key} nemá předpočítanou cestu`);
      // Most leaves follow their region; the tails produce a few early/late
      // leaves. Fixed seeds keep the frontier stable while moving the camera.
      const variation = random(key + type * 7919 + layer * 104729) * 2 - 1;
      const jitter = variation * variation * variation * 0.08;
      return { region: binding.region, distance: binding.distance,
        regionPriority: Math.max(0, Math.min(1, regions[binding.region])),
        priority: Math.max(0, Math.min(1, regions[binding.region] + jitter)) };
    }
  };
}
