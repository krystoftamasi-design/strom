// A depleted water reserve starts a visual autumn-like sequence.
export function advanceDroughtLeaves(progress, hydration, delta) {
  const current = Math.max(0, Math.min(1, progress));
  if (current === 0 && hydration > 0.05) return 0;
  return Math.min(1, current + Math.max(0, delta) * 0.12);
}

export function droughtLeafFall(progress) {
  const t = Math.max(0, Math.min(1, (progress - 0.45) / 0.55));
  return t * t * (3 - 2 * t);
}
