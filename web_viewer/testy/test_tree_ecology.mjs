import assert from 'node:assert/strict';
import { TreeEcology } from '../ekologie/tree_ecology.js';

function tree() {
  const m = new TreeEcology();
  m.configure({ height: 26.1, woodVolume: 4, crownArea: 100 });
  return m;
}
function run(m, seconds, fps = 60) {
  for (let i = 0; i < seconds * fps; i++) m.step(1 / fps);
  return m;
}
const wet = tree();
wet.inflow = 2;
run(wet, 60);
assert.equal(wet.reserve, wet.capacity, 'Excess inflow stops at capacity');
assert.ok(wet.consumption > 0 && wet.activity > 0);
const dry = tree();
dry.inflow = 0;
run(dry, 240);
assert.equal(dry.reserve, 0, 'The store can empty without becoming negative');
assert.equal(dry.activity, 0, 'No water means no photosynthesis');
assert.equal(dry.coolingKW, 0, 'No available water means no evaporative cooling');
assert.ok(dry.dryness > 0.99, 'Water stress gradually reaches the leaves');
dry.inflow = 2;
run(dry, 90);
assert.ok(dry.reserve > dry.capacity * 0.9 && dry.dryness < 0.01, 'Refill restores the shared water state and leaf appearance');
const night = tree();
night.sunElevation = -10;
night.evaluate(0);
assert.equal(night.activity, 0);
assert.equal(night.glucoseGramsPerMinute, 0);
assert.equal(night.transpiration, 0);
const summer = tree(), winter = tree();
winter.season = 'latefall';
winter.evaluate(0);
assert.ok(winter.consumption < summer.consumption * 0.1, 'Winter reduces demand');
assert.equal(winter.activity, 0, 'A leafless crown has no leaf photosynthesis');
assert.ok(Math.abs(summer.coolingKW - summer.transpiration / 60 * 2450) < 1e-10, 'Cooling converts minutes to seconds');
const fast = tree(), slow = tree();
fast.inflow = slow.inflow = 0.05;
run(fast, 90, 60);
run(slow, 90, 20);
assert.ok(Math.abs(fast.reserve - slow.reserve) < 0.02, 'Water balance remains stable across frame rates');
const balance = tree();
const initialReserve = balance.reserve;
balance.inflow = 0.25;
balance.step(0.01);
assert.ok(Math.abs(balance.reserve - (initialReserve + (balance.inflow - balance.consumption) * 0.1)) < 0.001, 'Water rates use model minutes');
console.log('PASS: water limits, conservation, drought/recovery, darkness, winter, cooling units and frame-rate stability.');
