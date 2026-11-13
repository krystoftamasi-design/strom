import assert from 'node:assert/strict';
import { crossedSpring, advanceVisibleGrowth } from '../listy/leaf_growth_timing.js';

assert.equal(crossedSpring(3.8, 5.5), true, 'A fast winter-to-summer move still detects spring');
assert.equal(crossedSpring(0.3, 0.5), false, 'Before budburst growth is not triggered');
assert.equal(crossedSpring(0.7, 1.5), false, 'A move within the same growing season does not restart growth');
assert.equal(crossedSpring(5, 1), false, 'A backward jump does not start another year');
const normal = advanceVisibleGrowth(0, 1, 0.1, 1, 1);
const fast = advanceVisibleGrowth(0, 1, 0.1, 4, 1);
assert.ok(normal > 0 && normal < 1, 'A skipped calendar interval does not skip the visual growth');
assert.ok(fast > normal && fast < 1, 'Faster playback accelerates growth without making it instant');
assert.equal(advanceVisibleGrowth(0.8, 0.3, 0.1, 1, 1), 0.8, 'Growth does not shrink after a calendar jump');
assert.equal(advanceVisibleGrowth(0.95, 1, 0.1, 4, 1), 1, 'Growth reaches a full canopy');
console.log('PASS: fast season changes retain visible leaf growth.');
