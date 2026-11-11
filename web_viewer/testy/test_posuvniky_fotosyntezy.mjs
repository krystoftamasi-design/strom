import assert from 'node:assert/strict';
import { TreeEcology } from '../ekologie/tree_ecology.js';
import { konstanty } from '../ekologie/tree_ecology_vzorce.js';

const tree = new TreeEcology();
tree.configure({ height: 26, woodVolume: 4, crownArea: 100 });
assert.ok(Math.abs(tree.oxygenGramsPerMinute - tree.glucoseGramsPerMinute * konstanty.oxygenPerGlucose) < 1e-10);
assert.ok(Math.abs(tree.co2GramsPerMinute - tree.activeLeafArea * tree.photosynthesisEfficiency * konstanty.co2Conversion) < 1e-10);
const supplied = tree.baseTranspiration * 2;
tree.setWaterInput(supplied);
assert.equal(tree.waterInput, supplied, 'The control changes water availability');
assert.ok(tree.inflow <= tree.seasonalWaterLimit, 'Root uptake remains capped');
assert.ok(tree.inflow < tree.waterInput, 'Extra availability does not force extra uptake');
tree.step(5);
assert.equal(tree.waterInput, supplied, 'The chosen availability remains set while the simulation runs');
assert.ok(tree.reserve >= 0 && tree.reserve <= tree.capacity, 'Water reserve remains within bounds');
console.log('PASS: photosynthesis relationships and bounded water availability.');
