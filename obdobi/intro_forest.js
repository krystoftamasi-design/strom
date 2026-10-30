import * as THREE from 'three';

// The intro uses the original tree directly; this controller frames it.
export function createIntroForest({ scene, camera, controls, sun, getHeight, invalidateShadows }) {
  const forest = new THREE.Group();
  forest.name = 'IntroForestCopies';
  forest.visible = false;
  scene.add(forest);
  const direction = new THREE.Vector3(1, 0.6, 1).normalize();
  const right = new THREE.Vector3(direction.z, 0, -direction.x).normalize();
  const up = new THREE.Vector3().crossVectors(direction, right).normalize();
  let active = false;
  let snapshot = null;
  let spacing = 18;

  function fit() {
    const height = getHeight() || 24.5;
    const mobile = window.innerWidth <= 700;
    spacing = Math.max(18, height * 0.72);
    const halfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const widthFraction = mobile ? 0.96 : 0.62;
    const distance = Math.max(
      (spacing * 2 + 21) / (2 * halfFov * camera.aspect * widthFraction),
      height / (2 * halfFov * 0.58)
    ) * 0.9;
    controls.target.set(0, height * 0.4, 0);
    if (mobile) controls.target.addScaledVector(up, distance * halfFov * 0.35);
    else controls.target.addScaledVector(right, -distance * halfFov * camera.aspect * 0.24);
    camera.position.copy(controls.target).addScaledVector(direction, distance);
    controls.maxDistance = Math.max(snapshot.maxDistance, distance * 1.1);
    camera.far = Math.max(snapshot.far, distance + spacing * 2 + height);
    camera.updateProjectionMatrix();
    controls.update();
    camera.updateMatrixWorld(true);
  }

  return {
    setActive(value) {
      if (value === active) return;
      active = value;
      forest.visible = false;
      if (active) {
        const shadow = sun.shadow.camera;
        snapshot = {
          position: camera.position.clone(), target: controls.target.clone(), far: camera.far, maxDistance: controls.maxDistance,
          shadow: Object.fromEntries(['near', 'far', 'left', 'right', 'top', 'bottom'].map(key => [key, shadow[key]]))
        };
        Object.assign(shadow, { near: 1, far: 260, left: -90, right: 90, top: 85, bottom: -85 });
        shadow.updateProjectionMatrix();
        fit();
      } else if (snapshot) {
        camera.position.copy(snapshot.position);
        controls.target.copy(snapshot.target);
        camera.far = snapshot.far;
        controls.maxDistance = snapshot.maxDistance;
        camera.updateProjectionMatrix();
        Object.assign(sun.shadow.camera, snapshot.shadow);
        sun.shadow.camera.updateProjectionMatrix();
        controls.update();
      }
      invalidateShadows();
    },
    resize() { if (active) fit(); },
    positionAnchor(point) {
      point[0] = 0;
      point[2] = 0;
    },
    update() {
      if (!active) return;
      // No intro copies are created: the original tree remains the only one.
    }
  };
}
