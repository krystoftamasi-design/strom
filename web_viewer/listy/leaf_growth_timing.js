// The shared season position advances by four units per year.
const SPRING_BURST_POSITION = (114 - 59) / (151 - 59);

export function crossedSpring(previous, current) {
  if (!Number.isFinite(previous) || !Number.isFinite(current) || current <= previous) return false;
  return Math.floor((current - SPRING_BURST_POSITION) / 4)
    > Math.floor((previous - SPRING_BURST_POSITION) / 4);
}

export function advanceVisibleGrowth(current, target, realDelta, playbackSpeed, growthSpeed) {
  const limit = Math.max(0, realDelta) * 0.75
    * Math.sqrt(Math.max(1, playbackSpeed)) * Math.max(0.1, growthSpeed);
  return Math.max(current, Math.min(1, target, current + limit));
}
