// Cloud cover expresses only the manual reduction below natural daylight.
export function cloudCover(model) {
  if (model.manualLightAvailability == null || model.sunElevation <= 0) return 0;
  const natural = Math.max(0, Math.min(1,
    Math.sin(model.sunElevation * Math.PI / 180) * model.sunIntensity / Math.sin(Math.PI / 3)));
  if (natural <= 0.0001) return 0;
  return Math.max(0, Math.min(1, (natural - model.manualLightAvailability) / natural));
}

export function createSunClouds({ THREE, scene, camera, sun }) {
  const loader = new THREE.TextureLoader();
  const textures = ['mrak2.png', 'untitled.png'].map(name => {
    const texture = loader.load(new URL(`../web_assets/mrak/${name}`, import.meta.url).href);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });
  const positions = [
    { x: -9, y: 2, scale: 13, texture: 0 },
    { x: 9, y: 1, scale: 12, texture: 1 },
    { x: 0, y: 4, scale: 15, texture: 0 },
  ];
  const clouds = positions.map((config, index) => {
    const material = new THREE.SpriteMaterial({
      map: textures[config.texture], transparent: true, opacity: 0,
      depthTest: false, depthWrite: false, toneMapped: false,
    });
    const sprite = new THREE.Sprite(material);
    // Stable layer order prevents transparent sprites from swapping on movement.
    sprite.renderOrder = 100 + index;
    scene.add(sprite);
    return { sprite, material, config };
  });
  const center = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3();
  const forward = new THREE.Vector3();
  let cover = 0;
  return {
    update(model, delta) {
      const target = cloudCover(model);
      cover += (target - cover) * (1 - Math.exp(-Math.max(0, delta) * 4));
      if (Math.abs(cover - target) < 0.001) cover = target;
      sun.getWorldPosition(center);
      right.setFromMatrixColumn(camera.matrixWorld, 0);
      up.setFromMatrixColumn(camera.matrixWorld, 1);
      camera.getWorldDirection(forward);
      for (const { sprite, material, config } of clouds) {
        const size = config.scale * (0.35 + 0.65 * cover);
        sprite.position.copy(center).addScaledVector(forward, -1)
          .addScaledVector(right, config.x * (1 - cover))
          .addScaledVector(up, config.y * (1 - cover) + size * 0.08);
        sprite.scale.set(size, size * 136 / 181, 1);
        const daylight = THREE.MathUtils.smoothstep(model.sunElevation, -3, 2);
        material.opacity = Math.min(1, cover * 2.5) * daylight;
        sprite.visible = material.opacity > 0.001 && sun.visible;
      }
      // At complete overcast no sunlight should remain visible through the brush texture.
      sun.material.opacity = THREE.MathUtils.smoothstep(model.sunElevation, -6, 0)
        * (1 - THREE.MathUtils.smoothstep(cover, 0.8, 1));
      return cover;
    },
  };
}
