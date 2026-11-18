import assert from 'node:assert/strict';
import { TreeEcology } from '../ekologie/tree_ecology.js';
import { createAnnualSugarCurve, createSeasonalSugarBalance } from '../ekologie/rocni_zasoba_cukru.js';
import { seasonForMonthClock } from '../obdobi/beech_phenology.js';

const tree = new TreeEcology();
tree.configure({ height: 26, woodVolume: 4, crownArea: 100 });
const capacity = 40000;
const curve = createAnnualSugarCurve(tree, capacity);

const fall = curve.slice(297, 323);
assert.ok(fall.every(day => day.autumnReturn > 0));
assert.ok(curve.slice(0, 297).every(day => day.autumnReturn === 0));
assert.ok(curve.slice(323).every(day => day.autumnReturn === 0));
assert.ok(Math.abs(fall.reduce((sum, day) => sum + day.autumnReturn, 0) - fall[0].leafStart) < 1e-6);
assert.ok(curve.every(day => day.reserve >= 0 && day.reserve <= capacity));

const animated = createSeasonalSugarBalance(curve, capacity);
const withoutGrowth = createSeasonalSugarBalance(curve, capacity);
let clock = 3.7; // April 22
const position = seasonForMonthClock(clock);
animated.update(position, position, false, 1);
withoutGrowth.update(position, position, false, 1);
let charged = 0;
for (const [nextClock, visibleGrowth, growing] of [
  [3.9, 0, false],
  [4.05, 0, false],
  [4.20, 0.4, true],
  [4.35, 1, true],
  [4.40, undefined, false],
]) {
  const from = seasonForMonthClock(clock);
  const to = seasonForMonthClock(nextClock);
  const live = animated.update(from, to, true, 1, visibleGrowth);
  const control = withoutGrowth.update(from, to, true, 1);
  assert.equal(live.budburstRate > 0, growing);
  charged += live.budburstRate * (nextClock - clock) * 1440;
  if (charged > 0) assert.ok(live.reserve < control.reserve);
  else assert.equal(live.reserve, control.reserve);
  clock = nextClock;
}
assert.ok(Math.abs(charged - 350) < 1e-6);
console.log('PASS: seasonal sugar follows visible spring growth and gradual autumn leaf fall.');
