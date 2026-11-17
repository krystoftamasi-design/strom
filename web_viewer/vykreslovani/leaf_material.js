import * as THREE from 'three';
import { leafFallDeclarations } from '../listy/leaf_fall.js?v=opt-age-1';

function createStableBrushAlpha(image, type, edgeTransition = 0) {
  // Bake stochastic coverage in leaf UV space once, then filter it with mipmaps.
  // Screen derivatives must never change the random pattern as the camera moves.
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0, size, size);
  const source = context.getImageData(0, 0, size, size);
  // Apply Material.005's ramp first, then feather the resulting contour.
  // Blurring before the ramp would sharpen its edge again at the ramp stop.
  if (type === 1) {
    for (let i = 0; i < size * size; i++) {
      source.data[i * 4 + 3] = Math.round(255 * THREE.MathUtils.clamp(
        (source.data[i * 4 + 3] / 255 - 0.6145453453) / (1 - 0.6145453453), 0, 1));
    }
    context.putImageData(source, 0, 0);
  }
  const feathered = document.createElement('canvas');
  feathered.width = feathered.height = size;
  const featherContext = feathered.getContext('2d', { willReadFrequently: true });
  // About 1.6 pixels in the original 100px brush: soften opacity, not color.
  featherContext.filter = edgeTransition > 0 ? `blur(${8 * edgeTransition}px)` : 'none';
  featherContext.drawImage(canvas, 0, 0);
  const rgba = featherContext.getImageData(0, 0, size, size).data;
  const pixels = new Uint8Array(size * size * 4);
  let seed = 0x59e247c1;
  for (let i = 0; i < size * size; i++) {
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    const coverage = rgba[i * 4 + 3] / 255;
    const covered = coverage >= (seed >>> 0) / 4294967296 ? 255 : 0;
    pixels.set([255, 255, 255, covered], i * 4);
  }
  const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function createShadowBrushAlpha(image, type) {
  // Bake one small, solid silhouette. Blur away fine pores before thresholding
  // so they do not shimmer or cost extra lookups in the shadow pass.
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.filter = 'blur(1px)';
  context.drawImage(image, 0, 0, size, size);
  const pixels = context.getImageData(0, 0, size, size).data;
  // Material.005's alpha ramp is baked here, rather than evaluated per fragment.
  const threshold = type === 1 ? 0.6145453453 + (1 - 0.6145453453) * 0.5 : 0.5;
  for (let index = 0; index < pixels.length; index += 4) {
    const covered = pixels[index + 3] / 255 >= threshold;
    pixels[index] = pixels[index + 1] = pixels[index + 2] = 255;
    pixels[index + 3] = covered ? 255 : 0;
  }
  const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function createDisplay3DTexture(display) {
  if (!display?.image || typeof document === 'undefined') return null;
  const width = display.image.width;
  const height = display.image.height;
  if (width !== 4096 || height !== 64) return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(display.image, 0, 0);
  const raw = context.getImageData(0, 0, width, height).data;
  const srgbToLin = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const s = i / 255;
    srgbToLin[i] = s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  }
  const toHalf = THREE.DataUtils.toHalfFloat;
  const data = new Uint16Array(64 * 64 * 64 * 4);
  const oneHalf = toHalf(1.0);
  for (let b = 0; b < 64; b++) {
    for (let g = 0; g < 64; g++) {
      // display.flipY is true on the 2D LUT, so row 0 of image corresponds to g = 63.
      const srcY = 63 - g;
      for (let r = 0; r < 64; r++) {
        const si = (srcY * 4096 + b * 64 + r) * 4;
        const di = ((b * 64 + g) * 64 + r) * 4;
        data[di] = toHalf(srgbToLin[raw[si]]);
        data[di + 1] = toHalf(srgbToLin[raw[si + 1]]);
        data[di + 2] = toHalf(srgbToLin[raw[si + 2]]);
        data[di + 3] = oneHalf;
      }
    }
  }
  const texture = new THREE.Data3DTexture(data, 64, 64, 64);
  texture.format = THREE.RGBAFormat;
  texture.type = THREE.HalfFloatType;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = texture.wrapT = texture.wrapR = THREE.ClampToEdgeWrapping;
  texture.unpackAlignment = 1;
  texture.needsUpdate = true;
  return texture;
}

function computeAlphaCropBounds(image, type, margin = 0.05) {
  if (!image || typeof document === 'undefined') return null;
  const w = image.width;
  const h = image.height;
  if (!w || !h) return null;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, w, h);
  const rgba = ctx.getImageData(0, 0, w, h).data;
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let a = rgba[(y * w + x) * 4 + 3] / 255;
      if (type === 1) a = Math.max(0, (a - 0.6145453453) / (1 - 0.6145453453));
      if (a > 0.005) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < minX || maxY < minY) return null;
  // Leaf alpha textures use flipY = false, so image row y maps directly to v = y / h.
  return {
    uMin: Math.max(0, minX / w - margin),
    uMax: Math.min(1, (maxX + 1) / w + margin),
    vMin: Math.max(0, minY / h - margin),
    vMax: Math.min(1, (maxY + 1) / h + margin)
  };
}

function rgbChroma(r, g, b) {
  const max = Math.max(r, g, b);
  if (max <= 1e-10) return new THREE.Vector3(1, 1, 1);
  return new THREE.Vector3(r / max, g / max, b / max);
}

// The expensive Noise -> Voronoi -> EASE ramp is baked by Blender itself.
// Reusable 240px patches retain fine detail without enormous per-leaf atlases.
// Lambert/shadows, CONSTANT ramp, Darken, Season and alpha remain dynamic.
export async function loadLeafReference(loader) {
  const base = './web_assets/';
  const texture = async (name, colorSpace = THREE.NoColorSpace) => {
    const tex = await loader.loadAsync(base + name);
    tex.flipY = false;
    tex.colorSpace = colorSpace;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  };
  const [metadata, detail, diffuse, alpha0, alpha1, procedural0, procedural1, display] = await Promise.all([
    fetch(base + 'leaf_reference.json').then(r => { if (!r.ok) throw Error('Leaf reference missing'); return r.json(); }),
    fetch(base + 'leaf_detail_reference.json').then(r => { if (!r.ok) throw Error('Leaf detail reference missing'); return r.json(); }),
    texture('leaf_diffuse.png', THREE.SRGBColorSpace),
    texture('leaf_alpha_1.png?v=two-leaf-masks'), texture('leaf_alpha_2.png?v=two-leaf-masks'),
    texture('leaf_detail_0.png?v=approved-fine-1'), texture('leaf_detail_1.png?v=approved-fine-1'), texture('leaf_display_lut.png')
  ]);
  display.generateMipmaps = false;
  display.flipY = true;
  display.minFilter = display.magFilter = THREE.LinearFilter;
  const display3D = createDisplay3DTexture(display);
  // Type 1 / Material.003: list2.png. Type 2 / Material.005: list.png.
  // Visible coverage uses the source brush; shadows use its simplified outline.
  const alpha = [alpha0, alpha1];
  const alphaBounds = alpha.map((mask, type) => computeAlphaCropBounds(mask.image, type));
  const stableAlpha = alpha.map((mask, type) => createStableBrushAlpha(mask.image, type));
  const shadowAlpha = alpha.map((mask, type) => createShadowBrushAlpha(mask.image, type));
  // Approved brush preview: distinct source masks, filtered stochastic pores,
  // and no additional default Gaussian feathering or surface grain.
  return { metadata, detail, diffuse, alpha, alphaBounds, stableAlpha, shadowAlpha, edgeTransition: 0, procedural: [procedural0, procedural1], display, display3D };
}

export function setLeafEdgeTransition(reference, amount) {
  const transition = THREE.MathUtils.clamp(amount, 0, 3);
  if (transition === reference.edgeTransition) return;
  reference.edgeTransition = transition;
  reference.stableAlpha.forEach((texture, type) => {
    const updated = createStableBrushAlpha(reference.alpha[type].image, type, transition);
    // Reuse the visible texture; the simplified shadow outline stays stable.
    texture.image = updated.image;
    texture.needsUpdate = true;
  });
}

export async function loadLeafAttributes(modelUrl) {
  const base = modelUrl.replace(/\.glb$/, '');
  return Promise.all([0, 1].map(async i => {
    const response = await fetch(`${base}_leaf_${i}.bin`);
    if (!response.ok) throw Error('Chybí data listů z Blenderu');
    return new Float32Array(await response.arrayBuffer());
  }));
}

export function attachLeafAttributes(geometry, data) {
  if (data.length !== geometry.attributes.position.count * 3) throw Error('Nesouhlasí geometrie listů s Blender referencí');
  const buffer = new THREE.InterleavedBuffer(data, 3);
  geometry.setAttribute('referenceUv', new THREE.InterleavedBufferAttribute(buffer, 2, 0));
  geometry.setAttribute('referenceSeason', new THREE.InterleavedBufferAttribute(buffer, 1, 2));
}

const alphaDeclarations = `
  uniform sampler2D uLeafAlpha;
  uniform sampler2D uStableLeafAlpha;
  uniform float uLeafType;
  uniform float uAlphaMode;
  uniform float uLeafAlphaStrength;
  uniform float uLeafDepth;
  varying vec2 vLeafUv;
  varying float vLeafFallProgress;
`;
const alphaFragment = `
  if (vLeafFallProgress >= 0.999) discard;
  float leafFade = 1.0 - vLeafFallProgress;
  if (uLeafDepth < 0.5 && uAlphaMode > 1.5) {
    // The brush keeps its stochastic coverage, fixed to the leaf rather than
    // rehashed from the current pixel footprint. Mipmaps integrate fine pores.
    float stableCoverage = clamp(texture2D(uStableLeafAlpha, vLeafUv).a * uLeafAlphaStrength * leafFade, 0.0, 1.0);
    if (stableCoverage <= 0.0) discard;
    diffuseColor.a = stableCoverage;
  } else {
    float leafCoverage = texture2D(uLeafAlpha, vLeafUv).a;
    // Only Material.005 has an alpha ramp. Material.003 uses image alpha directly.
    if (uLeafType > 0.5) leafCoverage = clamp((leafCoverage - 0.6145453453) / (1.0 - 0.6145453453), 0.0, 1.0);
    leafCoverage = clamp(leafCoverage * uLeafAlphaStrength * leafFade, 0.0, 1.0);
    if (uLeafDepth > 0.5 || uAlphaMode <= 0.5) {
      // Shadow maps are not multisampled: use a stable contour, never dithering.
      if (leafCoverage < 0.5) discard;
      diffuseColor.a = 1.0;
    } else {
      // Solid leaf interiors; deterministic MSAA smoothing only at the contour.
      float alphaWidth = max(fwidth(leafCoverage), 1.0 / 255.0);
      diffuseColor.a = smoothstep(0.5-alphaWidth, 0.5+alphaWidth, leafCoverage);
      if (diffuseColor.a <= 0.0) discard;
    }
  }
`;

function addAlpha(shader, type, reference, uniforms, depth = false) {
  shader.uniforms.uLeafAlpha = { value: reference.alpha[type] };
  shader.uniforms.uStableLeafAlpha = { value: reference.stableAlpha[type] };
  shader.uniforms.uLeafType = { value: type };
  shader.uniforms.uAlphaMode = uniforms.uAlphaMode;
  shader.uniforms.uLeafAlphaStrength = uniforms.uLeafAlphaStrength;
  shader.uniforms.uLeafDepth = { value: depth ? 1 : 0 };
  shader.vertexShader = 'varying vec2 vLeafUv;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvLeafUv = uv;');
  shader.fragmentShader = alphaDeclarations + shader.fragmentShader;
  if (depth) {
    shader.fragmentShader = shader.fragmentShader.replace('#include <alphahash_fragment>', alphaFragment);
  } else {
    // Test alpha before sampling diffuse/lighting textures on discarded quad borders.
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <color_fragment>', alphaFragment + '\n#include <color_fragment>')
      .replace('#include <alphahash_fragment>', '');
  }
}

export function createLeafDepthMaterial(type, reference, uniforms) {
  const mat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, side: THREE.DoubleSide });
  mat.customProgramCacheKey = () => `reference_depth_${type}_simple_mask_v9`;
  mat.onBeforeCompile = shader => {
    shader.uniforms.uLeafShadowAlpha = { value: reference.shadowAlpha[type] };
    shader.uniforms.uLeafAlphaStrength = uniforms.uLeafAlphaStrength;
    shader.uniforms.uLeafGrowth = uniforms.uLeafGrowth || { value: 1.0 };
    shader.vertexShader = 'varying vec2 vLeafUv;\n' + shader.vertexShader.replace(
      '#include <begin_vertex>', '#include <begin_vertex>\nvLeafUv = uv;');
    shader.fragmentShader = `uniform sampler2D uLeafShadowAlpha;
      uniform float uLeafAlphaStrength;
      varying vec2 vLeafUv;
      varying float vLeafFallProgress;\n` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <alphahash_fragment>', `
      if (vLeafFallProgress >= 0.999) discard;
      float coverage = texture2D(uLeafShadowAlpha, vLeafUv).a
        * uLeafAlphaStrength * (1.0 - vLeafFallProgress);
      if (coverage < 0.5) discard;
      diffuseColor.a = 1.0;
    `);
    Object.assign(shader.uniforms, {
      uLeafFallEnabled: uniforms.uLeafFallEnabled,
      uSeasonOffset: uniforms.uSeasonOffset,
      uLeafFallTime: uniforms.uLeafFallTime,
      uLeafFallSpeed: uniforms.uLeafFallSpeed,
      uDryingSpeed: uniforms.uDryingSpeed,
      uYellowPhaseWidth: uniforms.uYellowPhaseWidth,
      uDryingSharpness: uniforms.uDryingSharpness,
      uDryingFrontWidth: uniforms.uDryingFrontWidth
    });
    shader.vertexShader = leafFallDeclarations + 'uniform float uLeafGrowth;\n' + shader.vertexShader.replace(
      '#include <begin_vertex>', `#include <begin_vertex>
        if (uLeafGrowth < 0.9999) transformed = leafFallCenter + (transformed - leafFallCenter) * uLeafGrowth;
        float _depthFallAge = leafFallAge();
        transformed = leafFallPositionWithAge(transformed, leafFallRotationWithAge(normal, _depthFallAge), _depthFallAge);`);
  };
  return mat;
}

const colorFunctions2D = `
  vec3 leafRgbToHsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    return vec3(abs(q.z + (q.w-q.y)/(6.0*d+1e-10)), d/(q.x+1e-10), q.x);
  }
  vec3 leafHsvToRgb(vec3 c) {
    vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0/3.0, 1.0/3.0))*6.0-3.0);
    return c.z * mix(vec3(1.0), clamp(p-1.0, 0.0, 1.0), c.y);
  }
  vec3 leafHueSat(vec3 c, float hue, float saturation, float value) {
    vec3 hsv = leafRgbToHsv(c);
    hsv.x = fract(hsv.x + hue - 0.5 + 1.0);
    hsv.y = clamp(hsv.y*saturation, 0.0, 1.0);
    hsv.z *= value;
    return max(leafHsvToRgb(hsv), vec3(0.0));
  }
  vec3 leafDisplaySlice(vec3 c, float slice) {
    return texture2D(uLeafDisplay, vec2((slice*64.0+c.r*63.0+0.5)/4096.0, (c.g*63.0+0.5)/64.0)).rgb;
  }
  vec3 leafDisplayTransform(vec3 c) {
    c = clamp(c, 0.0, 1.0);
    float b = c.b*63.0;
    vec3 srgb = mix(leafDisplaySlice(c, floor(b)), leafDisplaySlice(c, min(floor(b)+1.0,63.0)), fract(b));
    return mix(pow((srgb+0.055)/1.055,vec3(2.4)),srgb/12.92,lessThanEqual(srgb,vec3(0.04045)));
  }
`;

const colorFunctions3D = `
  vec3 leafRgbToHsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    return vec3(abs(q.z + (q.w-q.y)/(6.0*d+1e-10)), d/(q.x+1e-10), q.x);
  }
  vec3 leafHsvToRgb(vec3 c) {
    vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0/3.0, 1.0/3.0))*6.0-3.0);
    return c.z * mix(vec3(1.0), clamp(p-1.0, 0.0, 1.0), c.y);
  }
  vec3 leafHueSat(vec3 c, float hue, float saturation, float value) {
    vec3 hsv = leafRgbToHsv(c);
    hsv.x = fract(hsv.x + hue - 0.5 + 1.0);
    hsv.y = clamp(hsv.y*saturation, 0.0, 1.0);
    hsv.z *= value;
    return max(leafHsvToRgb(hsv), vec3(0.0));
  }
  vec3 leafDisplayTransform(vec3 c) {
    vec3 uvw = clamp(c, 0.0, 1.0) * (63.0 / 64.0) + (0.5 / 64.0);
    return texture(uLeafDisplay3D, uvw).rgb;
  }
`;

export function createLeafMaterial(type, reference, uniforms) {
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide, alphaToCoverage: uniforms.uAlphaMode.value > 0.5, depthWrite: true });
  mat.name = type === 0 ? 'Material.003 (Blender reference)' : 'Material.005 (Blender reference)';
  mat.toneMapped = false; // Blender's saved AgX High Contrast transform is applied with a LUT.
  mat.customProgramCacheKey = () => `reference_leaf_${type}_opt_v3_${reference.display3D ? '3d' : '2d'}`;
  const yellowChroma = type === 0 ? rgbChroma(0.78, 0.60, 0.055) : rgbChroma(0.84, 0.54, 0.035);
  const redChroma = type === 0 ? rgbChroma(0.8589947224, 0.0204435382, 0.0008851319) : rgbChroma(0.8589913845, 0.0085899057, 0.0085899057);
  mat.onBeforeCompile = (shader, renderer) => {
    const use3D = Boolean(reference.display3D && (!renderer || renderer.capabilities?.isWebGL2));
    addAlpha(shader, type, reference, uniforms);
    // Three r160 marks non-transparent Lambert materials OPAQUE and normally
    // replaces their alpha with 1. Keep the filtered brush coverage for MSAA,
    // while retaining depth writes and the existing opaque render ordering.
    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
      #undef OPAQUE
      #include <opaque_fragment>
    `);
    Object.assign(shader.uniforms, {
      uLeafDiffuse: { value: reference.diffuse }, uLeafProcedural: { value: reference.procedural[type] },
      uLeafDisplay: { value: reference.display }, uLeafDisplay3D: { value: reference.display3D },
      uLeafRandom: { value: new THREE.Vector3(...reference.metadata.materials[type].random) },
      uLeafSourceAtlas: { value: new THREE.Vector4(reference.metadata.atlas.size, reference.metadata.atlas.tile, 3, Math.floor(reference.metadata.atlas.size / reference.metadata.atlas.tile)) },
      uLeafDetailAtlas: { value: new THREE.Vector4(reference.detail.atlas.size, reference.detail.atlas.tile, reference.detail.atlas.padding, reference.detail.atlas.grid) },
      uYellowChroma: { value: yellowChroma }, uRedChroma: { value: redChroma },
      uLeafGrowth: uniforms.uLeafGrowth || { value: 1.0 },
      uSeasonOffset: uniforms.uSeasonOffset, uLeafFallEnabled: uniforms.uLeafFallEnabled, uLeafFallTime: uniforms.uLeafFallTime, uLeafFallSpeed: uniforms.uLeafFallSpeed, uDryingSpeed: uniforms.uDryingSpeed, uYellowPhaseWidth: uniforms.uYellowPhaseWidth, uDryingSharpness: uniforms.uDryingSharpness, uDryingFrontWidth: uniforms.uDryingFrontWidth, uRampThreshold: uniforms.uRampThreshold, uToonSteps: uniforms.uToonSteps,
      uCrownAO: uniforms.uCrownAO,
      uSceneIllumination: uniforms.uSceneIllumination || { value: 1 },
      uSunDirection: uniforms.uSunDirection || { value: new THREE.Vector3(0, 1, 0) },
      uSunIntensity: uniforms.uSunIntensity || { value: 0 },
      uMoonDirection: uniforms.uMoonDirection || { value: new THREE.Vector3(0, 1, 0) },
      uMoonIntensity: uniforms.uMoonIntensity || { value: 0 }
    });
    shader.vertexShader = leafFallDeclarations + `
      attribute vec2 referenceUv; attribute vec4 leafSeasonData;
      uniform vec4 uLeafSourceAtlas; uniform vec4 uLeafDetailAtlas;
      uniform float uLeafGrowth; uniform float uSeasonOffset; uniform float uDryingSpeed; uniform float uYellowPhaseWidth; uniform float uDryingSharpness; uniform float uDryingFrontWidth;
      varying vec2 vReferenceUv; varying vec3 vLeafPhase;
      vec2 leafDetailUv(vec2 originalUv) {
        vec2 sourcePixel = vec2(originalUv.x, 1.0-originalUv.y) * uLeafSourceAtlas.x;
        vec2 sourceTile = floor(sourcePixel / uLeafSourceAtlas.y);
        vec2 localUv = clamp((sourcePixel-sourceTile*uLeafSourceAtlas.y-uLeafSourceAtlas.z) / (uLeafSourceAtlas.y-2.0*uLeafSourceAtlas.z), 0.0, 1.0);
        float leafId = sourceTile.x + sourceTile.y*uLeafSourceAtlas.w;
        float variant = mod(leafId*7.0+${type}.0*5.0, uLeafDetailAtlas.w*uLeafDetailAtlas.w);
        vec2 detailTile = vec2(mod(variant,uLeafDetailAtlas.w),floor(variant/uLeafDetailAtlas.w));
        vec2 detailUv = (detailTile*uLeafDetailAtlas.y+uLeafDetailAtlas.z+localUv*(uLeafDetailAtlas.y-2.0*uLeafDetailAtlas.z)) / uLeafDetailAtlas.x;
        return vec2(detailUv.x, 1.0-detailUv.y);
      }\n` + shader.vertexShader.replace(
      '#include <begin_vertex>', `#include <begin_vertex>
        vReferenceUv = leafDetailUv(referenceUv);
        float _sp = clamp(uSeasonOffset / 0.44 + 0.5, 0.0, 1.0);
        float _sd = clamp(leafSeasonData.w, 0.0, 0.40);
        float _dsp = clamp((_sp - _sd) / max(0.001, 1.0 - _sd), 0.0, 1.0);
        float _sharp = clamp(uDryingSharpness, 0.0, 1.0);
        float _prio = mix(leafSeasonData.x, leafSeasonData.y, _sharp);
        float _ls = 0.385 + (1.0 - clamp(_prio, 0.0, 1.0)) * 0.38;
        float _ld = min(0.12 / max(uDryingSpeed, 0.05), 1.0 - _ls);
        float _fw = mix(_ld, min(_ld, uDryingFrontWidth), _sharp);
        float _fc = _ls + 0.5 * _ld;
        float _lp = smoothstep(_fc - 0.5 * _fw, _fc + 0.5 * _fw, _dsp);
        float _season = mix(0.50, 0.80, _lp);
        float _rs = mix(0.35, 0.70, 1.0 - clamp(leafSeasonData.z, 0.0, 1.0));
        float _ye = max(mix(0.42, 0.76, clamp(uYellowPhaseWidth, 0.0, 1.0)), 0.09);
        float _yellow = smoothstep(0.05, _ye, _lp);
        float _autumn = smoothstep(max(0.82, _rs + 0.10), 1.0, _lp);
        vLeafPhase = vec3(smoothstep(0.0, 0.5, _season), _yellow, _autumn);
        if (uLeafGrowth < 0.9999) transformed = leafFallCenter + (transformed - leafFallCenter) * uLeafGrowth;
        transformed = leafFallPositionWithAge(transformed, fallingLeafRotation, _fallAge);`);
    shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>\nfloat _fallAge = leafFallAge();\nmat3 fallingLeafRotation = leafFallRotationWithAge(objectNormal, _fallAge);\nobjectNormal = fallingLeafRotation * objectNormal;`);
    shader.vertexShader = 'attribute float canopyVisibility; varying float vCanopyVisibility;\n' + shader.vertexShader.replace(
      '#include <begin_vertex>', '#include <begin_vertex>\nvCanopyVisibility = canopyVisibility;');
    shader.fragmentShader = 'uniform float uCrownAO; uniform float uSceneIllumination; uniform vec3 uMoonDirection; uniform float uMoonIntensity; varying float vCanopyVisibility;\n' + shader.fragmentShader;
    shader.fragmentShader = `uniform sampler2D uLeafDiffuse; uniform sampler2D uLeafProcedural;
      ${use3D ? 'uniform mediump sampler3D uLeafDisplay3D;' : 'uniform sampler2D uLeafDisplay;'}
      uniform vec3 uLeafRandom; uniform vec3 uYellowChroma; uniform vec3 uRedChroma;
      uniform vec3 uSunDirection; uniform float uSunIntensity;
      uniform float uRampThreshold; uniform float uToonSteps;
      varying vec2 vReferenceUv; varying vec3 vLeafPhase;\n` + shader.fragmentShader;
    // Inject after <common>, where Three's color conversion functions are already declared.
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\n' + (use3D ? colorFunctions3D : colorFunctions2D));
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      // list.png (sRGB) -> Invert Color, Fac 0.84 -> Diffuse BSDF.
      vec3 leafImageColor = texture2D(uLeafDiffuse, vLeafUv).rgb;
      diffuseColor.rgb = mix(leafImageColor, vec3(1.0)-leafImageColor, 0.8400000334);
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <envmap_fragment>', `
      #include <envmap_fragment>
      // Shader to RGB Color -> float uses luminance. CONSTANT selects the right
      // stop at 1.0; 0.44 is the position of the left stop, not the transition.
      // The precomputed sky visibility is stable while leaves sway. Dynamic
      // shadow-map texels made entire leaves flash between light and dark.
      vec3 canopyFill = reflectedLight.indirectDiffuse * mix(1.0, mix(0.42, 1.0, clamp(vCanopyVisibility, 0.0, 1.0)), uCrownAO);
      float illumination = dot(reflectedLight.directDiffuse+canopyFill, vec3(0.2126,0.7152,0.0722));
      vec3 green = uLeafType < 0.5 ? vec3(0.2488740087,0.3801255226,0.0387605503) : vec3(0.1756840050,0.3083614409,0.0248172097);
      // Preserve the exposed rim while making low sky visibility in the
      // inner crown noticeably darker.
      float canopyShade = smoothstep(0.10, 0.58, clamp(vCanopyVisibility, 0.0, 1.0));
      float ramp = smoothstep(uRampThreshold - 0.04, uRampThreshold + 0.04, illumination)
        * mix(1.0, canopyShade, min(1.0, uCrownAO * 1.8));
      vec3 procedural = texture2D(uLeafProcedural,vReferenceUv).rgb;
      // A shadowed leaf uses the original deep blue-black shadow colour.
      vec3 dark = vec3(0.0221054647, 0.0155322049, 0.0609656647);
      vec3 shadowBase = mix(dark, min(dark, procedural), 0.7466666698);
      vec3 seasonal = shadowBase;
      vec3 litDisplay;
      if (ramp <= 0.0001) {
        litDisplay = leafDisplayTransform(shadowBase);
      } else {
        vec3 base = mix(green, min(green, procedural), 0.7466666698);
        seasonal = base;
        if (uLeafType > 0.5 && vLeafPhase.x > 0.0001) {
          vec3 variant = mix(base, leafHueSat(base, 0.57, 1.1, 1.0), uLeafRandom.y);
          seasonal = mix(base, variant, vLeafPhase.x);
        }
        if (vLeafPhase.y > 0.0001) {
          float valY = max(seasonal.r, max(seasonal.g, seasonal.b));
          seasonal = mix(seasonal, uYellowChroma * valY, vLeafPhase.y);
        }
        if (vLeafPhase.z > 0.0001) {
          float valR = max(seasonal.r, max(seasonal.g, seasonal.b));
          seasonal = mix(seasonal, uRedChroma * valR, vLeafPhase.z);
        }
        seasonal = leafHueSat(seasonal, mix(0.55, 0.5, uLeafRandom.y), 1.0, 1.0);
        litDisplay = leafDisplayTransform(mix(shadowBase, seasonal, ramp));
      }
      // Compress strong daylight after the Blender transform to retain leaf
      // pigment/detail instead of boosting the brightest colours into clipping.
      float leafIllumination = uSceneIllumination / (1.0 + 0.32 * max(uSceneIllumination - 1.0, 0.0));
      outgoingLight = litDisplay * leafIllumination;
      if (uMoonIntensity > 0.0001 || (uSunIntensity > 0.0001 && ramp > 0.0001)) {
        vec3 nNorm = normalize(normal);
        if (uMoonIntensity > 0.0001) {
          float moonFacing = max(dot(nNorm, normalize(uMoonDirection)), 0.0);
          outgoingLight += mix(litDisplay, vec3(1.0), 0.18)
            * vec3(0.72, 0.84, 1.0) * uMoonIntensity * (0.06 + 0.55 * moonFacing);
        }

        // Thin leaves transmit a little sunlight towards their shaded side.
        // Match normal/view coordinates and attenuate leaves deep in the crown.
        if (uSunIntensity > 0.0001 && ramp > 0.0001) {
          vec3 transmittedSunDirection = normalize((viewMatrix * vec4(uSunDirection, 0.0)).xyz);
          float backlit = max(dot(-nNorm, transmittedSunDirection), 0.0);
          float towardsSun = pow(max(dot(-geometryViewDir, transmittedSunDirection), 0.0), 3.0);
          float crownTransmission = mix(0.15, 1.0, clamp(vCanopyVisibility, 0.0, 1.0));
          float transmittedLight = 0.30 * backlit * (0.35 + 0.65 * towardsSun)
            * crownTransmission * clamp(uSunIntensity, 0.0, 1.0);
          if (transmittedLight > 0.0001) {
            vec3 seasonalDisplay = ramp >= 0.9999 ? litDisplay : leafDisplayTransform(seasonal);
            outgoingLight += seasonalDisplay * vec3(1.12, 1.04, 0.72) * transmittedLight * ramp;
          }
        }
      }

    `);
  };
  return mat;
}
