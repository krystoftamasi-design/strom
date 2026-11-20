import assert from 'node:assert/strict';
import { TreeEcology } from '../ekologie/tree_ecology.js';
import { createAnnualSugarCurve, createSeasonalSugarBalance, simulateAnnualStocks } from '../ekologie/rocni_zasoba_cukru.js';
import { seasonForMonthClock } from '../obdobi/beech_phenology.js';

const tree = new TreeEcology();
tree.configure({ height: 26, woodVolume: 4, crownArea: 100 });
assert.equal(tree.capacity, 1000, 'Water storage capacity is 1,000 litres');
const capacity = 40000;
const reserveBeforePreview = tree.sugarReserve;
const waterBeforePreview = tree.reserve;
const { sugar: simulatedYear, water } = simulateAnnualStocks(tree, capacity);
assert.equal(simulatedYear.length, 366, 'One reading per day plus the end of December');
assert.equal(tree.sugarReserve, reserveBeforePreview, 'The reference run does not alter the live tree');
assert.equal(tree.reserve, waterBeforePreview, 'The reference run does not alter the live water supply');
assert.equal(water.length, 366);
assert.ok(water.every(day => day.start >= 0 && day.start <= tree.capacity));
assert.ok(water.some(day => day.start !== water[0].start), 'The reference water reserve changes over the year');
const firstFullDay = simulatedYear.findIndex(day => day.start >= capacity);
assert.ok(firstFullDay >= 265 && firstFullDay < 334, 'The reference tree first fills its store in autumn');
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
for (const [nextClock, growthRequested, growing] of [
  [3.9, 0, false],
  [4.05, 0, false],
  [4.20, 0.4, true],
  [4.35, 0.6, true],
  [4.40, undefined, false],
]) {
  const from = seasonForMonthClock(clock);
  const to = seasonForMonthClock(nextClock);
  const live = animated.update(from, to, true, 1, growthRequested);
  const control = withoutGrowth.update(from, to, true, 1);
  assert.equal(live.budburstRate > 0, growing);
  charged += live.growthGranted * 350;
  if (charged > 0) assert.ok(live.reserve < control.reserve);
  else assert.equal(live.reserve, control.reserve);
  clock = nextClock;
}
assert.ok(Math.abs(charged - 350) < 1e-6);

const depletedCurve = curve.map(day => ({
  ...day,
  start: 140,
  leafStart: 0,
  budburstUse: 0,
  flow: { ...day.flow, production: 0, respiration: 0 },
}));
const depleted = createSeasonalSugarBalance(depletedCurve, capacity);
const budburst = seasonForMonthClock(4);
const firstGrowth = seasonForMonthClock(4.01);
const laterGrowth = seasonForMonthClock(4.02);
depleted.update(budburst, budburst, false, 1);
const partial = depleted.update(budburst, firstGrowth, true, 1, 0.5);
assert.equal(partial.growthGranted, 0.4, 'Only 140 g of the 350 g spring budget can be spent');
assert.equal(partial.reserve, 0);
const exhausted = depleted.update(firstGrowth, laterGrowth, true, 1, 0.5);
assert.equal(exhausted.growthGranted, 0, 'Further growth stops when the available reserve is empty');
assert.equal(exhausted.budburstRate, partial.budburstRate, 'The daily display continues after the debit');

function springDisplay(fps) {
  const balance = createSeasonalSugarBalance(depletedCurve, capacity);
  const nextFrame = seasonForMonthClock(4 + 1 / (fps * 48));
  balance.update(budburst, budburst, false, 1);
  const debit = balance.update(budburst, nextFrame, true, 1);
  const nextDay = balance.update(nextFrame, seasonForMonthClock(4.04), true, 1);
  assert.equal(nextDay.budburstRate, 0);
  return debit.budburstRate;
}
assert.equal(springDisplay(60), springDisplay(144));

const skippedSpring = createSeasonalSugarBalance(depletedCurve, capacity);
const beforeBudburst = seasonForMonthClock(3.7);
skippedSpring.update(beforeBudburst, beforeBudburst, false, 1);
const afterSeek = skippedSpring.update(beforeBudburst, firstGrowth, false, 1);
assert.equal(afterSeek.reserve, 140, 'Seeking across spring leaves sugar available for the visible animation');
assert.equal(afterSeek.budburstRate, 0);
const afterGrowth = skippedSpring.update(firstGrowth, laterGrowth, true, 1, 1);
assert.equal(afterGrowth.growthGranted, 0.4);
assert.equal(afterGrowth.reserve, 0);

const from = seasonForMonthClock(5.2);
const dryDate = seasonForMonthClock(5.5);
const summer = seasonForMonthClock(6);
const autumn = seasonForMonthClock(9.93);
const winter = seasonForMonthClock(11.1);
const seeking = createSeasonalSugarBalance(curve, capacity);
seeking.update(from, from, false, 1);
const dryReserve = seeking.update(from, dryDate, true, 0).reserve;
const summerReserve = seeking.update(summer, summer, false, 0).reserve;
assert.ok(summerReserve < dryReserve, 'Time skipped forward with production off only incurs consumption in summer');
assert.ok(seeking.update(summer, seasonForMonthClock(6.001), false, 1).reserve > summerReserve,
  'Restoring production changes the projection from the original stock');
const rewound = seeking.update(summer, from, false, 0).reserve;
assert.ok(rewound > dryReserve, 'Rewinding reverses summer consumption when production is off');
const moved = seeking.update(autumn, autumn, false, 0); // The ring can update the date before the frame begins.
assert.ok(moved.autumnRate > 0, 'Autumn can still return sugar already in the leaves');
seeking.update(autumn, winter, false, 0);
const back = seeking.update(winter, dryDate, false, 0);
assert.ok(Math.abs(back.reserve - dryReserve) < 1e-6);
const resumed = seeking.update(dryDate, seasonForMonthClock(5.501), true, 0);
assert.ok(resumed.reserve < back.reserve && back.reserve - resumed.reserve < 100);

const leafless = createSeasonalSugarBalance(curve.map(day => ({ ...day, leafStart: 0 })), capacity);
const juneStart = seasonForMonthClock(5);
const initial = leafless.update(juneStart, juneStart, false, 0).reserve;
let previousReserve = initial;
for (let month = 6; month <= 18; month += 1) {
  const date = seasonForMonthClock(month);
  const state = leafless.update(date, date, false, 0);
  assert.ok(state.reserve <= previousReserve);
  assert.equal(state.autumnRate, 0, 'An empty leaf store cannot refill the reserve');
  previousReserve = state.reserve;
}
assert.equal(previousReserve, 0);
assert.equal(leafless.update(juneStart, juneStart, false, 0).reserve, initial);
console.log('PASS: spring growth is limited by sugar reserves and autumn leaf fall returns sugar gradually.');
console.log('PASS: moving the season ring respects zero production and supports a round trip.');
