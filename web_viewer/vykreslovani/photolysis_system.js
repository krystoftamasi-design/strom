/**
 * photolysis_system.js
 * 
 * Dynamic Photolysis Particle System (Photosystem II simulation)
 * Replaces static tube lines with high-performance pooled particle streams:
 * - Elongated yellow photon beads traveling from active Sun direction to reaction point.
 * - Semi-transparent blue O₂ bubble sprites emerging 200 screen pixels
 *   along their dispersing trajectory from the reaction point
 *   at an exact 4:1 photon-to-O₂ stoichiometric ratio (2H₂O -> O₂ + 4H⁺ + 4e⁻).
 * - Environmental cutoffs: halting emission/photolysis when water < 350 L or sun is below horizon.
 * - Zero allocations in render loop (strict object pooling and pre-allocated scratch math).
 */

import * as THREE from '../web_assets/vendor/three.module.js';
import { applyGasLeafStyle } from './gas_material.js?v=alpha-edges-2';

export class PhotolysisSystem {
  constructor(options = {}) {
    this.THREE = options.THREE || THREE;
    if (!this.THREE) {
      throw new Error('THREE instance must be provided to PhotolysisSystem');
    }

    // Scene groups (optional if running in headless test mode)
    this.photonGroup = options.photonGroup || new this.THREE.Group();
    this.oxygenGroup = options.oxygenGroup || new this.THREE.Group();
    this.reactionOrb = options.reactionOrb || null;
    this.carbonGroup = options.carbonGroup || this.oxygenGroup;
    this.getFrontDirection = options.getFrontDirection || (() => this._zAxis);
    this.totalCarbonDioxideEmitted = 0;
    this.totalCarbonDioxideAbsorbed = 0;
    this.highlightedGases = { oxygen: false, co2: false, water: false };
    this.waterGroup = options.waterGroup || null;
    this.transpiration = 0;
    this.waterEmitTimer = 0;

    // Callbacks / suppliers
    this.getReactionPoint = options.getReactionPoint || (() => new this.THREE.Vector3(4.33, 17.46, -0.84));
    this.getSunPosition = options.getSunPosition || null;
    this.getSunDirection = options.getSunDirection || (() => new this.THREE.Vector3(0.5, 0.8, 0.4).normalize());

    // Environmental parameters
    this.DROUGHT_WATER_THRESHOLD = 350; // Liters
    this.treeWaterLiters = options.treeWaterLiters !== undefined ? options.treeWaterLiters : 800;
    this.sunElevationDeg = options.sunElevationDeg !== undefined ? options.sunElevationDeg : 45.8;
    this.activity = null; // Optional shared whole-tree model; legacy users retain their cutoff.

    // Simulation tuning
    this.streamDistance = options.streamDistance || 15.0; // Distance from reaction point towards Sun
    this.photonSpeed = options.photonSpeed || 24.0;       // Swift speed (m/s)
    this.bubbleSize = 1.0;
    this.bubbleSpeed = options.bubbleSpeed || 2.2;        // Slower bubble speed (m/s)
    this.bubbleSpawnPixels = options.bubbleSpawnPixels !== undefined
      ? options.bubbleSpawnPixels
      : 200.0;
    this.bubbleSpawnDistance = options.bubbleSpawnDistance !== undefined
      ? options.bubbleSpawnDistance
      : 1.5; // Fallback when no camera is available (e.g. headless tests)
    this.getCamera = options.getCamera || (() => null);
    this.getViewportHeight = options.getViewportHeight || (() => 0);
    this.photonsPerSecond = options.photonsPerSecond || 8.0;

    // Pool sizes
    this.maxPhotons = options.maxPhotons || 40;
    this.maxBubbles = options.maxBubbles || 50;

    // Stoichiometry & counters
    this.absorbedPhotonsCount = 0; // Integer counter modulo 4
    this.totalPhotonsEmitted = 0;
    this.totalPhotonsAbsorbed = 0;
    this.totalOxygenProduced = 0;

    // Timing accumulators
    this.emitTimer = 0;
    this.reactionPulseTime = 0;

    // Scratch math structures (avoids GC allocations in update)
    this._vSunDir = new this.THREE.Vector3();
    this._vOrigin = new this.THREE.Vector3();
    this._vTarget = new this.THREE.Vector3();
    this._vDir = new this.THREE.Vector3();
    this._vPerp = new this.THREE.Vector3();
    this._vPerp2 = new this.THREE.Vector3();
    this._vUp = new this.THREE.Vector3(0, 1, 0);
    this._qRot = new this.THREE.Quaternion();
    this._zAxis = new this.THREE.Vector3(0, 0, 1);
    this._baseBubbleDir = new this.THREE.Vector3(0.55, 0.70, -0.35).normalize();
    this._vScreenStart = new this.THREE.Vector3();
    this._vScreenEnd = new this.THREE.Vector3();
    this._vWaterOut = new this.THREE.Vector3();

    // Initialize pools
    this._initPhotonPool();
    this._initOxygenPool();
    this._initCarbonPool();
    this._initWaterPool(options.waterTexture);
  }

  // Check if environmental inputs permit photolysis
  isSunAboveHorizon() {
    if (this.sunElevationDeg <= 0) return false;
    // A positioned sun marker can sit below the crown while the Sun is above
    // the horizon. Its direction from the reaction point only sets the path.
    if (this.getSunPosition) return true;
    const sunDir = this.getSunDirection();
    return sunDir && sunDir.y > 0.001;
  }

  isWaterSufficient() {
    return this.treeWaterLiters >= this.DROUGHT_WATER_THRESHOLD;
  }

  isPhotolysisActive() {
    if (this.activity !== null) return this.isSunAboveHorizon() && this.activity > 0.0001;
    return this.isSunAboveHorizon() && this.isWaterSufficient();
  }

  setActivity(value) {
    this.activity = Math.max(0, Math.min(1, Number(value) || 0));
  }

  // Setters for dynamic environmental parameters
  setWaterVolume(liters) {
    this.treeWaterLiters = Number(liters);
  }

  setSunElevation(degrees) {
    this.sunElevationDeg = Number(degrees);
  }

  setBubbleSize(multiplier) {
    if (!Number.isFinite(multiplier)) return;
    this.bubbleSize = Math.max(0.25, Math.min(4.0, multiplier));
    for (const pool of [this.bubblePool, this.carbonPool, this.waterPool]) {
      for (const b of pool) if (b.active) this._updateGasScale(b);
    }
  }

  setElementHighlight(tag, active) {
    if (!(tag in this.highlightedGases)) return;
    this.highlightedGases[tag] = Boolean(active);
    const pool = tag === 'oxygen' ? this.bubblePool : tag === 'co2' ? this.carbonPool : this.waterPool;
    for (const bubble of pool) if (bubble.active) this._updateGasScale(bubble);
  }

  _updateGasScale(b) {
    // Smooth growth from 2% to full size in 0.22 seconds, then shrink at the end.
    const entrance = Math.min(1, b.age / 0.22);
    const growth = entrance * entrance * (3 - 2 * entrance);
    const exit = Math.max(0, Math.min(1, (b.maxLifetime - b.age) / 0.25));
    const shrink = exit * exit * (3 - 2 * exit);
    const highlight = this.highlightedGases[b.kind] ? 2.1 : 1;
    b.mesh.scale.setScalar(b.baseScale * 1.6 * this.bubbleSize * (b.kind === 'water' ? 1 / 2.1 : 1) * highlight * (0.02 + 0.98 * growth) * shrink);
  }
  setBubbleSpawnDistance(distance) {
    if (!Number.isFinite(distance)) return;
    this.bubbleSpawnDistance = Math.max(0, distance);
  }

  // Computes the current 3D origin point of incoming photons based on Sun vector
  getPhotonOrigin(target = this._vOrigin) {
    if (this.getSunPosition) return this.getSunPosition(target) || target;
    const rx = this.getReactionPoint();
    const sunDir = this.getSunDirection();
    this._vSunDir.copy(sunDir).normalize();
    target.copy(rx).addScaledVector(this._vSunDir, this.streamDistance);
    return target;
  }

  _initPhotonPool() {
    const THREE = this.THREE;
    // Visibly elongated sphere/capsule bead along Z axis
    const photonGeo = new THREE.SphereGeometry(0.12, 12, 12);
    photonGeo.scale(0.85, 0.85, 2.8); // Elongated along velocity vector

    // Clean, flat minimalist cel-shaded material
    const photonMat = new THREE.MeshBasicMaterial({
      color: 0xffcc00,
      transparent: false,
      depthWrite: true
    });

    this.photonPool = [];
    for (let i = 0; i < this.maxPhotons; i++) {
      const mesh = new THREE.Mesh(photonGeo, photonMat);
      mesh.name = `PhotonParticle_${i}`;
      mesh.visible = false;
      mesh.renderOrder = 9;
      this.photonGroup.add(mesh);

      this.photonPool.push({
        mesh,
        active: false,
        origin: new THREE.Vector3(),
        target: new THREE.Vector3(),
        distance: 1.0,
        progress: 0.0,
        speed: this.photonSpeed
      });
    }
  }

  _initOxygenPool() {
    const THREE = this.THREE;
    // Shared painted textures; sprites keep the circular artwork facing the camera.
    const loader = new THREE.TextureLoader();
    this.bubbleTextures = [
      'oxygen_bubble_1.png',
      'oxygen_bubble_2.png',
      'oxygen_bubble_3.png',
      'oxygen_bubble_4.png'
    ].map(name => {
      const texture = loader.load(new URL(`../web_assets/${name}`, import.meta.url).href);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    });

    this.bubblePool = [];
    for (let i = 0; i < this.maxBubbles; i++) {
      // Opaque artwork with a cutout background; appearance is animated by size.
      const mat = new THREE.SpriteMaterial({
        map: this.bubbleTextures[i % this.bubbleTextures.length],
        color: 0xffffff,
        toneMapped: false,
        transparent: false,
        opacity: 1,
        // Discard faint dark edge pixels instead of rendering them as opaque borders.
        alphaTest: 0.5,
        depthWrite: true
      });

      applyGasLeafStyle(mat);
      const mesh = new THREE.Sprite(mat);
      mesh.name = `OxygenBubble_${i}`;
      mesh.visible = false;
      mesh.renderOrder = 9;
      this.oxygenGroup.add(mesh);

      this.bubblePool.push({
        mesh,
        material: mat,
        active: false,
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        age: 0.0,
        maxLifetime: 3.5,
        baseScale: 0.62,
        kind: 'oxygen'
      });
    }
  }

  // Same sprite artwork handling and pool capacity as oxygen, moving inward.
  _initCarbonPool() {
    const THREE = this.THREE;
    const loader = new THREE.TextureLoader();
    this.carbonTextures = ['untitled.png', '2.png', '3.png', '4.png'].map(name => {
      const texture = loader.load(new URL(`../web_assets/co2/${name}`, import.meta.url).href);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    });
    this.carbonPool = this.bubblePool.map((bubble, i) => {
      const material = bubble.material.clone();
      material.map = this.carbonTextures[i % this.carbonTextures.length];
      applyGasLeafStyle(material);
      const mesh = new THREE.Sprite(material);
      mesh.name = `CarbonDioxide_${i}`;
      mesh.visible = false;
      mesh.renderOrder = 9;
      this.carbonGroup.add(mesh);
      return { mesh, material, active: false, age: 0, maxLifetime: 1,
        baseScale: 0.62, kind: 'co2', origin: new THREE.Vector3(), target: new THREE.Vector3() };
    });
  }

  // Optional water-vapour stream, independent of photolysis stoichiometry.
  _initWaterPool(texture) {
    this.waterPool = [];
    if (!this.waterGroup) return;
    const THREE = this.THREE;
    const waterTextures = Array.isArray(texture) && texture.length
      ? texture
      : texture
        ? [texture]
        : ['1.png', '2.png', '3.png'].map(name => new THREE.TextureLoader().load(
          new URL(`../web_assets/h2o/${name}`, import.meta.url).href
        ));
    for (const waterTexture of waterTextures) waterTexture.colorSpace = THREE.SRGBColorSpace;
    const waterMaterials = waterTextures.map(waterTexture => applyGasLeafStyle(
      new THREE.SpriteMaterial({ map: waterTexture, toneMapped: false })
    ));
    for (let i = 0; i < this.maxBubbles; i++) {
      const material = waterMaterials[i % waterMaterials.length];
      const mesh = new THREE.Sprite(material);
      mesh.name = `WaterVapour_${i}`;
      mesh.visible = false;
      this.waterGroup.add(mesh);
      this.waterPool.push({ mesh, material, active: false, age: 0, maxLifetime: 3.5,
        baseScale: 0.8, kind: 'water', velocity: new THREE.Vector3() });
    }
  }

  setTranspiration(value) {
    this.transpiration = Math.max(0, Number(value) || 0);
  }

  _updateWaterVapour(dt) {
    if (this.waterGroup?.visible && this.transpiration > 0.0001) {
      this.waterEmitTimer += dt;
      const interval = 1 / Math.min(6, 2 + Math.sqrt(this.transpiration));
      while (this.waterEmitTimer >= interval) {
        this.waterEmitTimer -= interval;
        const b = this.waterPool.find(p => !p.active);
        if (!b) break;
        b.active = true;
        b.age = 0;
        const rx = this.getReactionPoint();
        // Match oxygen's dispersing cone and outward trajectory.
        const baseDir = this._baseBubbleDir;
        const coneAngle = 0.48;
        const randTheta = Math.random() * Math.PI * 2;
        const randR = Math.sin(Math.random() * coneAngle);
        this._vPerp.set(-baseDir.z, 0, baseDir.x).normalize();
        if (this._vPerp.lengthSq() < 0.1) this._vPerp.set(1, 0, 0);
        this._vPerp2.crossVectors(baseDir, this._vPerp).normalize();
        b.velocity.copy(baseDir)
          .addScaledVector(this._vPerp, Math.cos(randTheta) * randR)
          .addScaledVector(this._vPerp2, Math.sin(randTheta) * randR)
          .normalize().multiplyScalar(this.bubbleSpeed * (0.85 + Math.random() * 0.30));
        const spawnDirection = this._vDir.copy(b.velocity).normalize();
        const spawnDistance = this._getBubbleSpawnDistance(spawnDirection, rx);
        b.mesh.position.copy(rx).addScaledVector(spawnDirection, spawnDistance);
        b.maxLifetime = 3.2 + Math.random() * 0.8;
        b.baseScale = 0.62 + Math.random() * 0.28;
        b.mesh.visible = true;
        this._updateGasScale(b);
      }
    } else this.waterEmitTimer = 0;
    for (const b of this.waterPool) {
      if (!b.active) continue;
      b.age += dt;
      if (b.age >= b.maxLifetime || !this.waterGroup.visible) {
        b.active = false;
        b.mesh.visible = false;
      } else {
        b.mesh.position.addScaledVector(b.velocity, dt);
        this._updateGasScale(b);
      }
    }
  }

  _spawnCarbonDioxide() {
    let b = this.carbonPool.find(p => !p.active);
    if (!b) b = this.carbonPool.reduce((oldest, p) => p.age > oldest.age ? p : oldest);
    const rx = this.getReactionPoint();
    const front = this.getFrontDirection();
    // A narrow 70-degree fan facing the camera, with a short incoming path.
    const angle = Math.atan2(front.x, front.z) + (Math.random() - 0.5) * (70 * Math.PI / 180);
    this._vDir.set(Math.sin(angle), (Math.random() - 0.5) * 0.4, Math.cos(angle)).normalize();
    const stopDistance = this._getBubbleSpawnDistance(this._vDir, rx) + 1.5;
    const travel = 5.0 + Math.random() * 1.0;
    b.maxLifetime = travel / (this.bubbleSpeed * (0.85 + Math.random() * 0.30));
    b.target.copy(rx).addScaledVector(this._vDir, stopDistance);
    b.origin.copy(rx).addScaledVector(this._vDir, stopDistance + travel);
    b.age = 0;
    b.baseScale = 0.62 + Math.random() * 0.28;
    b.active = true;
    b.mesh.position.copy(b.origin);
    this._updateGasScale(b);
    b.material.opacity = 1;
    b.mesh.visible = true;
    this.totalCarbonDioxideEmitted++;
  }
  // Spawns a single photon from the Sun direction
  _spawnPhoton() {
    let p = null;
    for (let i = 0; i < this.photonPool.length; i++) {
      if (!this.photonPool[i].active) {
        p = this.photonPool[i];
        break;
      }
    }
    if (!p) {
      let maxProg = -1;
      for (let i = 0; i < this.photonPool.length; i++) {
        if (this.photonPool[i].progress > maxProg) {
          maxProg = this.photonPool[i].progress;
          p = this.photonPool[i];
        }
      }
    }
    if (!p) return null;

    const rx = this.getReactionPoint();
    p.target.copy(rx);
    this.getPhotonOrigin(p.origin);

    p.distance = p.origin.distanceTo(p.target);
    if (p.distance < 0.001) p.distance = 0.001;
    p.progress = 0.0;
    p.speed = this.photonSpeed;
    p.active = true;

    // Orient mesh along velocity vector
    this._vDir.copy(p.target).sub(p.origin).normalize();
    p.mesh.quaternion.setFromUnitVectors(this._zAxis, this._vDir);
    p.mesh.position.copy(p.origin);
    p.mesh.visible = true;

    this.totalPhotonsEmitted++;
    return p;
  }

  _getBubbleSpawnDistance(direction, origin) {
    const camera = this.getCamera();
    const viewportHeight = Number(this.getViewportHeight());
    if (!camera || !Number.isFinite(viewportHeight) || viewportHeight <= 0) {
      return this.bubbleSpawnDistance;
    }

    this._vScreenStart.copy(origin).project(camera);
    this._vScreenEnd.copy(origin).add(direction).project(camera);
    const viewportWidth = viewportHeight * camera.aspect;
    const pixelsPerUnit = Math.hypot(
      (this._vScreenEnd.x - this._vScreenStart.x) * viewportWidth * 0.5,
      (this._vScreenEnd.y - this._vScreenStart.y) * viewportHeight * 0.5
    );
    if (!Number.isFinite(pixelsPerUnit) || pixelsPerUnit <= 0.001) {
      return this.bubbleSpawnDistance;
    }
    return this.bubbleSpawnPixels / pixelsPerUnit;
  }

  // Spawns a cleaved O₂ bubble 200 screen pixels along its trajectory
  _spawnOxygenBubble() {
    let b = null;
    for (let i = 0; i < this.bubblePool.length; i++) {
      if (!this.bubblePool[i].active) {
        b = this.bubblePool[i];
        break;
      }
    }
    if (!b) {
      let maxAge = -1;
      for (let i = 0; i < this.bubblePool.length; i++) {
        if (this.bubblePool[i].age > maxAge) {
          maxAge = this.bubblePool[i].age;
          b = this.bubblePool[i];
        }
      }
    }
    if (!b) return null;

    const rx = this.getReactionPoint();

    // Dispersing cone trajectory: outward from canopy & rising upward
    const baseDir = this._baseBubbleDir;

    // Perturbation within dispersing cone (~28 degrees)
    const coneAngle = 0.48;
    const randTheta = Math.random() * Math.PI * 2;
    const randR = Math.sin(Math.random() * coneAngle);
    
    // Orthogonal basis vectors for cone dispersion
    this._vPerp.set(-baseDir.z, 0, baseDir.x).normalize();
    if (this._vPerp.lengthSq() < 0.1) this._vPerp.set(1, 0, 0);
    this._vPerp2.crossVectors(baseDir, this._vPerp).normalize();

    b.velocity.copy(baseDir)
      .addScaledVector(this._vPerp, Math.cos(randTheta) * randR)
      .addScaledVector(this._vPerp2, Math.sin(randTheta) * randR)
      .normalize()
      .multiplyScalar(this.bubbleSpeed * (0.85 + Math.random() * 0.30));

    const spawnDirection = this._vTarget.copy(b.velocity).normalize();
    const spawnDistance = this._getBubbleSpawnDistance(spawnDirection, rx);
    b.position.copy(rx).addScaledVector(spawnDirection, spawnDistance);
    b.mesh.position.copy(b.position);

    b.age = 0.0;
    b.maxLifetime = 3.2 + Math.random() * 0.8; // 3.2 - 4.0 seconds
    b.baseScale = 0.62 + Math.random() * 0.28; // Natural size variation

    b.material.opacity = 1;
    b.material.rotation = 0;
    this._updateGasScale(b);
    b.mesh.visible = true;
    b.active = true;

    this.totalOxygenProduced++;
    return b;
  }

  // Called when a photon reaches the water line endpoint
  _onPhotonCollision() {
    if (!this.isPhotolysisActive()) {
      return;
    }

    this.totalPhotonsAbsorbed++;
    this.absorbedPhotonsCount++;
    this.reactionPulseTime = 0.16; // Visual reaction pulse duration

    // Photolysis Stoichiometry: 2H2O -> O2 + 4H+ + 4e-
    // Exactly every 4th incoming absorbed photon triggers 1 O2 bubble emergence!
    if (this.absorbedPhotonsCount % 4 === 0) {
      this._spawnOxygenBubble();
      // Net photosynthesis consumes one CO2 for each O2 produced (6:6).
      this._spawnCarbonDioxide();
    }
  }

  // Main simulation update loop
  update(delta = 0.016) {
    const dt = Math.min(delta, 0.1);
    this._updateWaterVapour(dt);

    // 1. Emission logic (only emit when conditions are met)
    if (this.isPhotolysisActive() && this.photonsPerSecond > 0) {
      // Keep the first photons visible even while photosynthesis is just starting.
      const emissionActivity = this.activity === null ? 1 : Math.max(0.2, Math.sqrt(this.activity));
      const emitInterval = 1.0 / (this.photonsPerSecond * emissionActivity);
      this.emitTimer += dt;
      while (this.emitTimer >= emitInterval) {
        this.emitTimer -= emitInterval;
        this._spawnPhoton();
      }
    } else {
      this.emitTimer = 0;
    }

    // 2. Update active photons
    for (let i = 0; i < this.photonPool.length; i++) {
      const p = this.photonPool[i];
      if (!p.active) continue;

      p.progress += (p.speed * dt) / p.distance;

      if (p.progress >= 1.0) {
        p.active = false;
        p.mesh.visible = false;
        this._onPhotonCollision();
      } else {
        p.mesh.position.lerpVectors(p.origin, p.target, p.progress);
      }
    }

    // 3. Update active oxygen bubbles
    const upwardBuoyancy = 0.45; // Gas buoyancy drift (m/s^2)
    for (let i = 0; i < this.bubblePool.length; i++) {
      const b = this.bubblePool[i];
      if (!b.active) continue;

      b.age += dt;
      if (b.age >= b.maxLifetime) {
        b.active = false;
        b.mesh.visible = false;
      } else {
        b.velocity.y += upwardBuoyancy * dt;
        b.position.addScaledVector(b.velocity, dt);
        b.mesh.position.copy(b.position);

        this._updateGasScale(b);
      }
    }

    // Both gases grow into view and shrink away without opacity blending.
    for (const b of this.carbonPool) {
      if (!b.active) continue;
      b.age += dt;
      const progress = Math.min(1, b.age / b.maxLifetime);
      b.mesh.position.lerpVectors(b.origin, b.target, progress);
      this._updateGasScale(b);
      if (progress >= 1) {
        b.active = false;
        b.mesh.visible = false;
        this.totalCarbonDioxideAbsorbed++;
      }
    }
    // 4. Update reaction center node pulse
    if (this.reactionOrb) {
      if (this.reactionPulseTime > 0) {
        this.reactionPulseTime -= dt;
        const pulseRatio = Math.max(0, this.reactionPulseTime / 0.16);
        this.reactionOrb.scale.setScalar(1.0 + 0.35 * pulseRatio);
      } else {
        this.reactionOrb.scale.setScalar(1.0);
      }
    }
  }

  getActivePhotonCount() {
    let count = 0;
    for (let i = 0; i < this.photonPool.length; i++) {
      if (this.photonPool[i].active) count++;
    }
    return count;
  }

  getActiveBubbleCount() {
    let count = 0;
    for (let i = 0; i < this.bubblePool.length; i++) {
      if (this.bubblePool[i].active) count++;
    }
    return count;
  }

  resetCounters() {
    this.absorbedPhotonsCount = 0;
    this.totalPhotonsEmitted = 0;
    this.totalPhotonsAbsorbed = 0;
    this.totalOxygenProduced = 0;
    this.emitTimer = 0;
    this.totalCarbonDioxideEmitted = 0;
    this.totalCarbonDioxideAbsorbed = 0;
    this.waterEmitTimer = 0;
    for (const b of [...this.carbonPool, ...this.waterPool]) {
      b.active = false;
      b.mesh.visible = false;
    }
    for (let i = 0; i < this.photonPool.length; i++) {
      this.photonPool[i].active = false;
      this.photonPool[i].mesh.visible = false;
    }
    for (let i = 0; i < this.bubblePool.length; i++) {
      this.bubblePool[i].active = false;
      this.bubblePool[i].mesh.visible = false;
    }
  }
}

if (typeof window !== 'undefined') {
  window.PhotolysisSystem = PhotolysisSystem;
}
