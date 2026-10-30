import * as THREE from '../web_assets/vendor/three.module.js';
import { createSeasonTimeline } from './season_timeline.js?v=beech-calendar-1';

const SEASONS = ['spring', 'summer', 'autumn', 'latefall'];
const LABELS = ['jaro', 'léto', 'podzim', 'zima'];
const QUARTER = Math.PI / 2;
// Keep label pivots fixed; place the calendar's season midpoint at each label.
const LABEL_CALENDAR_POSITION = 0.5;
const angleDifference = value => Math.atan2(Math.sin(value), Math.cos(value));

export function createSeasonRing({ scene, camera, controls, canvas, model }) {
  const radius = 8.5;
  const elevation = 0.12;
  const group = new THREE.Group();
  group.name = 'SeasonRing';
  group.position.y = elevation;
  group.visible = false;
  scene.add(group);
  const front = Math.atan2(camera.position.x, camera.position.z);
  const timeline = createSeasonTimeline(model);
  const rotationForDate = position => front - (position - LABEL_CALENDAR_POSITION) * QUARTER;
  group.rotation.y = rotationForDate(timeline.position);

  // A flat annular ribbon in XZ. The supplied vertical brush runs along it,
  // with its transparent sides across the ribbon's width.
  const positions = [], uvs = [], indices = [];
  const sectionsPerSeason = 1;
  const sectionCount = SEASONS.length * sectionsPerSeason;
  const stepsPerSection = 96;
  const sectionAngle = Math.PI * 2 / sectionCount;
  const gapAngle = 0.075;
  const ribbonWidth = 0.52;
  const sectionLength = radius * (sectionAngle - gapAngle);
  for (let section = 0; section < sectionCount; section++) {
    const base = positions.length / 3;
    // One continuous brush stroke per season; only season boundaries have gaps.
    for (let step = 0; step <= stepsPerSection; step++) {
      const angle = section * sectionAngle + gapAngle / 2
        + step / stepsPerSection * (sectionAngle - gapAngle);
      for (let side = 0; side < 2; side++) {
        const r = radius + (side - 0.5) * ribbonWidth;
        positions.push(Math.sin(angle) * r, 0, Math.cos(angle) * r);
        // Fit the whole vertical brush to each arc, without partial repeats/seams.
        uvs.push(side, step / stepsPerSection);
      }
      if (step < stepsPerSection) {
        const a = base + step * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  const brush = new THREE.TextureLoader().load(
    new URL('../../obrazky/textury/OVLADACI%20LINKA/LINKA.png', import.meta.url).href);
  brush.wrapT = THREE.ClampToEdgeWrapping;
  brush.colorSpace = THREE.SRGBColorSpace;
  brush.anisotropy = 4;
  const ink = new THREE.Color(0x171813);
  const material = new THREE.MeshBasicMaterial({
    map: brush, transparent: true, side: THREE.DoubleSide, depthWrite: false,
    alphaTest: 0.025, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -1
  });
  // Preserve the brush edges and clip each stroke to a softly rounded capsule.
  material.customProgramCacheKey = () => 'season_ring_linka_contrast_1';
  material.onBeforeCompile = shader => {
    shader.uniforms.uRingInk = { value: ink };
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>',
      '#include <common>\nuniform vec3 uRingInk;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>',
      `#include <map_fragment>
       diffuseColor.rgb = uRingInk;
       float strokeLength = ${sectionLength.toFixed(6)};
       float capRadius = ${(ribbonWidth / 2).toFixed(6)};
       float alongStroke = vMapUv.y * strokeLength;
       float acrossStroke = (vMapUv.x - 0.5) * ${(ribbonWidth).toFixed(6)};
       vec2 capOffset = vec2(alongStroke - clamp(alongStroke, capRadius, strokeLength - capRadius), acrossStroke);
       float roundedCoverage = 1.0 - smoothstep(capRadius - 0.035, capRadius, length(capOffset));
       diffuseColor.a *= roundedCoverage;`);
  };
  group.add(new THREE.Mesh(geometry, material));

  const labels = [];
  let lightInk = false;
  const labelWidth = 768, labelHeight = 192, labelResolution = 2;
  for (let i = 0; i < SEASONS.length; i++) {
    const image = document.createElement('canvas');
    image.width = labelWidth * labelResolution;
    image.height = labelHeight * labelResolution;
    const texture = new THREE.CanvasTexture(image);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 8;
    const label = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 1.05), new THREE.MeshBasicMaterial({
      map: texture, color: 0xffffff, transparent: true, opacity: 1,
      side: THREE.DoubleSide, depthWrite: false,
      alphaTest: 0.01, toneMapped: false
    }));
    label.position.z = radius + 0.85;
    label.rotation.x = -Math.PI / 2;
    label.userData.season = SEASONS[i];
    const pivot = new THREE.Group();
    pivot.rotation.y = i * QUARTER;
    pivot.add(label);
    group.add(pivot);
    labels.push(label);
    function draw() {
      const context = image.getContext('2d');
      context.setTransform(labelResolution, 0, 0, labelResolution, 0, 0);
      context.clearRect(0, 0, labelWidth, labelHeight);
      context.font = '300 120px Nohemi, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = lightInk ? '#f2f3e9' : '#171813';
      context.fillText(LABELS[i], labelWidth / 2, labelHeight / 2 + 5);
      texture.needsUpdate = true;
    }
    label.userData.draw = draw;
    draw();
    document.fonts.load('300 120px Nohemi').then(draw);
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -elevation);
  const point = new THREE.Vector3();
  let drag = null;
  let interactive = false;
  let suppressClick = false;
  let lastWheelStep = 0;
  function hit(event, anywhere = false) {
    const box = canvas.getBoundingClientRect();
    pointer.set((event.clientX - box.left) / box.width * 2 - 1, -(event.clientY - box.top) / box.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    if (!raycaster.ray.intersectPlane(plane, point)) return null;
    const angle = Math.atan2(point.x, point.z);
    if (anywhere) return { angle };
    const label = raycaster.intersectObjects(labels, false)[0]?.object;
    if (label) return { angle, season: label.userData.season };
    // Give the ring a generous invisible grab area so it is easy to pick up
    // even when the pointer lands between the labels and the painted ribbon.
    if (Math.abs(Math.hypot(point.x, point.z) - radius) < 2.2) return { angle };
    return null;
  }
  canvas.addEventListener('pointerdown', event => {
    if (!group.visible || !interactive || event.button !== 0) return;
    const target = hit(event);
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    drag = { pointerId: event.pointerId, angle: target.angle, x: event.clientX, y: event.clientY,
      season: target.season, moved: false, previousControls: controls.enabled };
    controls.enabled = false;
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = 'grabbing';
  }, true);
  canvas.addEventListener('pointermove', event => {
    if (!group.visible || !interactive) { canvas.style.cursor = ''; return; }
    if (!drag) { canvas.style.cursor = hit(event) ? 'grab' : ''; return; }
    if (event.pointerId !== drag.pointerId) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const target = hit(event, true);
    if (!target) return;
    const rotationStep = angleDifference(target.angle - drag.angle);
    drag.angle = target.angle;
    drag.moved ||= Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 5;
    if (drag.moved) timeline.moveTo(timeline.position - rotationStep / QUARTER);
    group.rotation.y = rotationForDate(timeline.position);
  }, true);
  function finish(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    event.stopImmediatePropagation();
    const previous = drag;
    drag = null;
    controls.enabled = previous.previousControls;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (!previous.moved && previous.season && event.type !== 'pointercancel') {
      const seasonIndex = SEASONS.indexOf(previous.season);
      let next = Math.floor(timeline.position / 4) * 4 + seasonIndex + LABEL_CALENDAR_POSITION;
      if (next < timeline.position) next += 4;
      timeline.moveTo(next);
    }
    suppressClick = true;
    canvas.style.cursor = 'grab';
  }
  canvas.addEventListener('pointerup', finish, true);
  canvas.addEventListener('pointercancel', finish, true);
  canvas.addEventListener('lostpointercapture', finish, true);
  canvas.addEventListener('click', event => {
    if (suppressClick) { event.stopImmediatePropagation(); suppressClick = false; }
  }, true);
  canvas.addEventListener('wheel', event => {
    if (!group.visible || !interactive || !hit(event)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.deltaY > 0 && performance.now() - lastWheelStep > 70) {
      timeline.moveTo(timeline.position + 0.04);
      group.rotation.y = rotationForDate(timeline.position);
      lastWheelStep = performance.now();
    }
  }, { capture: true, passive: false });

  return {
    group,
    update(chapter, playbackDelta = 0) {
      const background = scene.background;
      const luminance = background.r * 0.2126 + background.g * 0.7152 + background.b * 0.0722;
      const nextLightInk = luminance < 0.22;
      if (nextLightInk !== lightInk) {
        lightInk = nextLightInk;
        ink.set(lightInk ? 0xf2f3e9 : 0x171813);
        labels.forEach(label => label.userData.draw());
      }
      timeline.update(chapter, Boolean(drag), playbackDelta);
      group.visible = chapter !== 'intro';
      interactive = chapter !== 'intro';
      if (!drag) {
        // No snapping or settling after a drag: keep the selected exact angle.
        const position = chapter === 'intro' ? model.seasonPosition : timeline.position;
        group.rotation.y = rotationForDate(position);
      }
      labels.forEach(label => { label.material.opacity = 1; });
    }
  };
}
