/**
 * test_photolysis.mjs
 * 
 * Standalone Automated Test Suite for Photolysis Particle Streams & Stoichiometry:
 * 1. Stoichiometry: Exactly 1 O2 bubble produced for every 4 absorbed photons (2H2O -> O2 + 4H+ + 4e-).
 * 2. Photon origin tracks changes to sun direction vectors correctly in 3D.
 * 3. Environmental cutoff: Zero emissions and photolysis halt when water < 350 L or sun is below horizon.
 * 4. Particle pool stability: No memory leaks or runaway particle counts during extended simulation loops.
 */

import * as three from '../web_assets/vendor/three.module.js';
import { PhotolysisSystem } from '../vykreslovani/photolysis_system.js';

// Simulate real particles in Node without loading browser image assets.
const THREE = { ...three, TextureLoader: class {
  load() { return new three.Texture(); }
} };

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ PASS: ${message}`);
  passedTests++;
}

console.log('================================================================');
console.log('🧪 RUNNING PHOTOLYSIS VERIFICATION TEST SUITE (SWE LIGHT)');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// TEST 1: Stoichiometry (2H2O -> O2 + 4H+ + 4e-)
// -----------------------------------------------------------------------------
console.log('TEST 1: Photolysis Stoichiometry (4:1 Ratio Verification)');
{
  const rxPoint = new THREE.Vector3(4.33, 17.46, -0.84);
  const sys = new PhotolysisSystem({
    THREE,
    getReactionPoint: () => rxPoint,
    getSunDirection: () => new THREE.Vector3(0.5, 0.8, 0.4).normalize(),
    treeWaterLiters: 800,
    sunElevationDeg: 45
  });

  // Verify initial state
  assert(sys.absorbedPhotonsCount === 0, 'Initial absorbed count is 0');
  assert(sys.totalOxygenProduced === 0, 'Initial oxygen produced is 0');

  // Trigger individual photon collisions and check emergence
  for (let cycle = 1; cycle <= 10; cycle++) {
    const o2Before = sys.totalOxygenProduced;

    // 1st collision of cycle
    sys._onPhotonCollision();
    assert(sys.totalOxygenProduced === o2Before, `Cycle ${cycle}, photon 1: no O2 emitted`);

    // 2nd collision of cycle
    sys._onPhotonCollision();
    assert(sys.totalOxygenProduced === o2Before, `Cycle ${cycle}, photon 2: no O2 emitted`);

    // 3rd collision of cycle
    sys._onPhotonCollision();
    assert(sys.totalOxygenProduced === o2Before, `Cycle ${cycle}, photon 3: no O2 emitted`);

    // 4th collision of cycle -> triggers exactly 1 O2
    sys._onPhotonCollision();
    assert(sys.totalOxygenProduced === o2Before + 1, `Cycle ${cycle}, photon 4: EXACTLY 1 O2 bubble produced`);
  }

  // Verify overall counts after 40 collisions: exactly 10 O2 bubbles produced
  assert(sys.totalPhotonsAbsorbed === 40, 'Total photons absorbed is 40');
  assert(sys.totalOxygenProduced === 10, 'Total oxygen produced is exactly 10 (ratio 4:1)');
  assert(sys.totalOxygenProduced === Math.floor(sys.totalPhotonsAbsorbed / 4), 'Stoichiometric invariant holds strictly: O2 == floor(Photons / 4)');
}

// -----------------------------------------------------------------------------
// TEST 2: Photon Origin & Dynamic Sun Direction Tracking
// -----------------------------------------------------------------------------
console.log('\nTEST 2: Photon Origin Tracks Changes to Sun Direction Vectors');
{
  let currentSunDir = new THREE.Vector3(1, 0, 0); // pointing +X
  const rxPoint = new THREE.Vector3(0, 10, 0);
  const streamDist = 15.0;

  const sys = new PhotolysisSystem({
    THREE,
    getReactionPoint: () => rxPoint,
    getSunDirection: () => currentSunDir,
    streamDistance: streamDist,
    treeWaterLiters: 800,
    sunElevationDeg: 45
  });

  // Check direction 1: +X
  currentSunDir = new THREE.Vector3(1, 0, 0).normalize();
  let origin = sys.getPhotonOrigin();
  let expectedOrigin = rxPoint.clone().add(new THREE.Vector3(15, 0, 0));
  assert(origin.distanceTo(expectedOrigin) < 1e-4, 'Photon origin correctly tracks sun along +X axis');

  // Check direction 2: +Y (zenith)
  currentSunDir = new THREE.Vector3(0, 1, 0).normalize();
  origin = sys.getPhotonOrigin();
  expectedOrigin = rxPoint.clone().add(new THREE.Vector3(0, 15, 0));
  assert(origin.distanceTo(expectedOrigin) < 1e-4, 'Photon origin correctly tracks sun at zenith (+Y)');

  // Check direction 3: 45 degree angle (typical afternoon sun)
  currentSunDir = new THREE.Vector3(0.5, 0.7071, 0.5).normalize();
  origin = sys.getPhotonOrigin();
  expectedOrigin = rxPoint.clone().addScaledVector(currentSunDir, streamDist);
  assert(origin.distanceTo(expectedOrigin) < 1e-4, 'Photon origin correctly tracks angled sun vector');

  // Check spawned photon geometry and trajectory alignment
  const photon = sys._spawnPhoton();
  assert(photon !== null, 'Spawned photon is non-null');
  assert(photon.origin.distanceTo(expectedOrigin) < 1e-4, 'Spawned photon origin matches active sun direction');
  assert(photon.target.distanceTo(rxPoint) < 1e-4, 'Spawned photon target terminates at water line endpoint');

  assert(photon.mesh.isSprite && photon.mesh.material.map, 'Photon uses a textured sprite');
}

// -----------------------------------------------------------------------------
// TEST 3: Environmental Cutoff (< 350 L water or Sun below horizon)
// -----------------------------------------------------------------------------
console.log('\nTEST 3: Environmental Cutoffs (Drought < 350 L & Sun Below Horizon)');
{
  const rxPoint = new THREE.Vector3(4.33, 17.46, -0.84);
  let sunDir = new THREE.Vector3(0.5, 0.8, 0.4).normalize();

  const sys = new PhotolysisSystem({
    THREE,
    getReactionPoint: () => rxPoint,
    getSunDirection: () => sunDir,
    treeWaterLiters: 800,
    sunElevationDeg: 45,
    photonsPerSecond: 10
  });

  // Verify baseline is active
  assert(sys.isPhotolysisActive() === true, 'Baseline: Photolysis active under optimal sun & water');

  // Case A: Drought condition (< 350 L)
  sys.setWaterVolume(349);
  assert(sys.isWaterSufficient() === false, 'Water is insufficient at 349 L (< 350 L threshold)');
  assert(sys.isPhotolysisActive() === false, 'Photolysis halts when water is 349 L');

  // Run update for 2 seconds: verify zero new emissions
  sys.resetCounters();
  for (let f = 0; f < 120; f++) {
    sys.update(0.016);
  }
  assert(sys.totalPhotonsEmitted === 0, 'Zero photon emissions during water drought (< 350 L)');
  assert(sys.totalOxygenProduced === 0, 'Zero O2 produced during water drought (< 350 L)');

  // Direct collision attempt during drought: photolysis must not occur
  sys._onPhotonCollision();
  assert(sys.absorbedPhotonsCount === 0, 'Incoming photon absorption halts during drought');

  // Restore water
  sys.setWaterVolume(350); // Exactly at threshold
  assert(sys.isWaterSufficient() === true, 'Water is sufficient at exactly 350 L');
  assert(sys.isPhotolysisActive() === true, 'Photolysis resumes at 350 L');

  // Case B: Sun below horizon (elevation <= 0)
  sys.setSunElevation(0); // On horizon
  assert(sys.isSunAboveHorizon() === false, 'Sun on horizon (0°) considered below threshold');
  assert(sys.isPhotolysisActive() === false, 'Photolysis halts when sun elevation is 0°');

  sys.setSunElevation(-15); // Night time
  assert(sys.isSunAboveHorizon() === false, 'Sun below horizon (-15°) is night');
  assert(sys.isPhotolysisActive() === false, 'Photolysis halts when sun is below horizon');

  sys.resetCounters();
  for (let f = 0; f < 120; f++) {
    sys.update(0.016);
  }
  assert(sys.totalPhotonsEmitted === 0, 'Zero photon emissions when sun is below horizon');
  assert(sys.totalOxygenProduced === 0, 'Zero O2 produced when sun is below horizon');

  // Case C: Sun vector pointing down (sunDir.y <= 0)
  sys.setSunElevation(45);
  sunDir = new THREE.Vector3(0.5, -0.2, 0.4).normalize(); // pointing into ground
  assert(sys.isSunAboveHorizon() === false, 'Sun vector pointing below horizon halts photolysis');

  // Case D: Resume normal conditions
  sunDir = new THREE.Vector3(0.5, 0.8, 0.4).normalize();
  sys.setSunElevation(45);
  sys.setWaterVolume(800);
  assert(sys.isPhotolysisActive() === true, 'Normal photolysis resumes once both inputs are valid');

  sys.resetCounters();
  // Simulate 1.0 second (10 photons emitted, traveling and colliding)
  for (let f = 0; f < 120; f++) {
    sys.update(0.016);
  }
  assert(sys.totalPhotonsEmitted > 0, 'Photons emitted normally under optimal conditions');
  assert(sys.totalPhotonsAbsorbed > 0, 'Photons absorbed normally under optimal conditions');
  assert(sys.totalOxygenProduced > 0, 'Oxygen bubbles produced normally under optimal conditions');

  sys.setLightAvailability(1);
  sys.setActivity(0);
  const emittedBefore = sys.totalPhotonsEmitted;
  for (let f = 0; f < 120; f++) sys.update(0.016);
  assert(sys.totalPhotonsEmitted === emittedBefore, 'Bright light alone emits no photons without photosynthetic activity');

  sys.setActivity(0.2);
  for (let f = 0; f < 120; f++) sys.update(0.016);
  assert(sys.totalPhotonsEmitted > emittedBefore, 'Emission resumes when photosynthetic activity returns');
}

// -----------------------------------------------------------------------------
// TEST 4: Particle Pool Stability & Zero Memory Leaks
// -----------------------------------------------------------------------------
console.log('\nTEST 4: Particle Pool Stability (Extended Simulation)');
{
  const rxPoint = new THREE.Vector3(4.33, 17.46, -0.84);
  const sys = new PhotolysisSystem({
    THREE,
    getReactionPoint: () => rxPoint,
    getSunDirection: () => new THREE.Vector3(0.5, 0.8, 0.4).normalize(),
    treeWaterLiters: 800,
    sunElevationDeg: 45,
    maxPhotons: 40,
    maxBubbles: 50,
    photonsPerSecond: 10
  });

  const initialPhotonPoolSize = sys.photonPool.length;
  const initialBubblePoolSize = sys.bubblePool.length;
  const initialPhotonChildren = sys.photonGroup.children.length;
  const initialBubbleChildren = sys.oxygenGroup.children.length;

  assert(initialPhotonPoolSize === 40, 'Photon pool initialized with exactly 40 meshes');
  assert(initialBubblePoolSize === 50, 'Bubble pool initialized with exactly 50 meshes');

  // Run 3,000 frames (~50 seconds of real-time simulation)
  for (let frame = 0; frame < 3000; frame++) {
    sys.update(0.016);

    // Dynamic sun rotation during simulation to stress test
    if (frame % 50 === 0) {
      const angle = (frame / 50) * 0.1;
      sys.getSunDirection = () => new THREE.Vector3(Math.cos(angle), 0.8, Math.sin(angle)).normalize();
    }

    // Verify invariants every frame
    const activePhotons = sys.getActivePhotonCount();
    const activeBubbles = sys.getActiveBubbleCount();
    if (activePhotons > sys.maxPhotons || activeBubbles > sys.maxBubbles) {
      throw new Error(`Pool exceeded max bounds: photons=${activePhotons}, bubbles=${activeBubbles}`);
    }
  }

  // Verify pool sizes did not grow (zero runaway allocations)
  assert(sys.photonPool.length === initialPhotonPoolSize, 'Photon pool size unchanged after 3000 frames');
  assert(sys.bubblePool.length === initialBubblePoolSize, 'Bubble pool size unchanged after 3000 frames');
  assert(sys.photonGroup.children.length === initialPhotonChildren, 'Photon group child count unchanged');
  assert(sys.oxygenGroup.children.length === initialBubbleChildren, 'Oxygen group child count unchanged');

  // Verify exact stoichiometry over extended run
  assert(sys.totalPhotonsAbsorbed > 0, `Absorbed ${sys.totalPhotonsAbsorbed} photons`);
  assert(sys.totalOxygenProduced > 0, `Produced ${sys.totalOxygenProduced} O2 bubbles`);
  assert(sys.totalOxygenProduced === Math.floor(sys.totalPhotonsAbsorbed / 4), 
    `Extended stoichiometry verified: ${sys.totalOxygenProduced} O2 from ${sys.totalPhotonsAbsorbed} photons (exact 4:1)`);

  // Verify particle state validity (no NaN or Infinity)
  for (let p of sys.photonPool) {
    assert(!isNaN(p.mesh.position.x) && !isNaN(p.mesh.position.y) && !isNaN(p.mesh.position.z), 'Photon mesh positions valid');
  }
  for (let b of sys.bubblePool) {
    assert(!isNaN(b.mesh.position.x) && !isNaN(b.mesh.position.y) && !isNaN(b.mesh.position.z), 'Bubble mesh positions valid');
    assert(b.material.opacity >= 0 && b.material.opacity <= 1.0, 'Bubble opacity within valid bounds [0, 1]');
  }
}

console.log('\n================================================================');
console.log(`🎉 ALL ${passedTests}/${totalTests} ASSERTIONS PASSED SUCCESSFULLY!`);
console.log('================================================================');
