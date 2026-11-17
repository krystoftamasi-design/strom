import assert from 'node:assert/strict';
import * as THREE from '../web_assets/vendor/three.module.js';
import { PhotolysisSystem } from '../vykreslovani/photolysis_system.js';

// Texture loading is stubbed; all particle geometry, state and scaling are real.
const headlessThree = { ...THREE, TextureLoader: class { load() { return new THREE.Texture(); } } };
const group = new THREE.Group();
const endpoint = new THREE.Vector3(4, 12, -2);
const system = new PhotolysisSystem({ THREE: headlessThree, waterGroup: group,
  waterTexture: new THREE.Texture(), getReactionPoint: () => endpoint,
  maxBubbles: 8, maxPhotons: 4 });
system.setActivity(0);
system.setTranspiration(1);
for (let i = 0; i < 15; i++) system.update(0.1);
const active = system.waterPool.filter(p => p.active);
assert.ok(active.length > 0, 'Vapour emits without photosynthesis');
assert.equal(system.totalOxygenProduced, 0, 'Vapour does not produce oxygen');
assert.ok(active.every(p => p.mesh.position.y > endpoint.y), 'Vapour rises from water endpoint');
const particle = active[0];
const scale = particle.mesh.scale.x;
system.setElementHighlight('water', true);
assert.ok(Math.abs(particle.mesh.scale.x / scale - 3.5) < 1e-8, 'Water shares gas highlight factor');
system.setElementHighlight('water', false);
assert.ok(Math.abs(particle.mesh.scale.x - scale) < 1e-8, 'Closing restores size');
system.setTranspiration(0);
for (let i = 0; i < 50; i++) system.update(0.1);
assert.equal(system.waterPool.filter(p => p.active).length, 0, 'No emission at zero transpiration');
system.setTranspiration(1);
for (let i = 0; i < 10; i++) system.update(0.1);
group.visible = false;
system.update(0.1);
assert.ok(system.waterPool.every(p => !p.active && !p.mesh.visible), 'Hidden chapter clears vapour');
const lightSystem = new PhotolysisSystem({ THREE: headlessThree, maxPhotons: 8, maxBubbles: 8 });
lightSystem.setActivity(0);
lightSystem.setLightAvailability(1);
for (let i = 0; i < 50; i++) lightSystem.update(0.1);
assert.ok(lightSystem.totalPhotonsEmitted > 0, 'Available light emits photons without photosynthesis');
assert.equal(lightSystem.totalOxygenProduced, 0, 'Photons alone do not create oxygen');
const emitted = lightSystem.totalPhotonsEmitted;
lightSystem.setLightAvailability(0);
for (let i = 0; i < 20; i++) lightSystem.update(0.1);
assert.equal(lightSystem.totalPhotonsEmitted, emitted, 'Photons stop when light is unavailable');
console.log('PASS: vapour and photon emission respond to their separate inputs.');
