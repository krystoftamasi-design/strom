import * as THREE from 'three';
import { leafFallDeclarations } from '../listy/leaf_fall.js?v=delayed-wind-5';

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
  // Type 1 / Material.003: list2.png. Type 2 / Material.005: list.png.
  // Visible coverage uses the source brush; shadows use its simplified outline.
  const alpha = [alpha0, alpha1];
  const stableAlpha = alpha.map((mask, type) => createStableBrushAlpha(mask.image, type));
  const shadowAlpha = alpha.map((mask, type) => createShadowBrushAlpha(mask.image, type));
  // Approved brush preview: distinct source masks, filtered stochastic pores,
  // and no additional default Gaussian feathering or surface grain.
  return { metadata, detail, diffuse, alpha, stableAlpha, shadowAlpha, edgeTransition: 0, procedural: [procedural0, procedural1], display };
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
  float leafCoverage = texture2D(uLeafAlpha, vLeafUv).a;
  // Only Material.005 has an alpha ramp. Material.003 uses image alpha directly.
  if (uLeafType > 0.5) leafCoverage = clamp((leafCoverage - 0.6145453453) / (1.0 - 0.6145453453), 0.0, 1.0);
  leafCoverage = clamp(leafCoverage * uLeafAlphaStrength * leafFade, 0.0, 1.0);
  if (uLeafDepth > 0.5) {
    // Fine stochastic pores alias in the single-sample shadow map and shimmer
    // across neighbouring leaves as the sun moves. Cast a solid brush contour.
    if (leafCoverage < 0.5) discard;
    diffuseColor.a = 1.0;
  } else if (uAlphaMode > 1.5) {
    // The brush keeps its stochastic coverage, fixed to the leaf rather than
    // rehashed from the current pixel footprint. Mipmaps integrate fine pores.
    float stableCoverage = clamp(texture2D(uStableLeafAlpha, vLeafUv).a * uLeafAlphaStrength * leafFade, 0.0, 1.0);
    if (stableCoverage <= 0.0) discard;
    diffuseColor.a = stableCoverage;
  } else if (uAlphaMode > 0.5 && uLeafDepth < 0.5) {
    // Solid leaf interiors; deterministic MSAA smoothing only at the contour.
    // Raw partial coverage across the whole brush makes the canopy sparkle.
    float alphaWidth = max(fwidth(leafCoverage), 1.0 / 255.0);
    diffuseColor.a = smoothstep(0.5-alphaWidth, 0.5+alphaWidth, leafCoverage);
    if (diffuseColor.a <= 0.0) discard;
  } else {
    // Shadow maps are not multisampled: use a stable contour, never dithering.
    if (leafCoverage < 0.5) discard;
    diffuseColor.a = 1.0;
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
  shader.fragmentShader = shader.fragmentShader.replace('#include <alphahash_fragment>', alphaFragment);
}

export function createLeafDepthMaterial(type, reference, uniforms) {
  const mat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, side: THREE.DoubleSide });
  mat.customProgramCacheKey = () => `reference_depth_${type}_simple_mask_v8`;
  mat.onBeforeCompile = shader => {
    shader.uniforms.uLeafShadowAlpha = { value: reference.shadowAlpha[type] };
    shader.uniforms.uLeafAlphaStrength = uniforms.uLeafAlphaStrength;
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
    shader.vertexShader = leafFallDeclarations + shader.vertexShader.replace(
      '#include <begin_vertex>', `#include <begin_vertex>
        transformed = leafFallPosition(transformed, leafFallRotation(normal));`);
  };
  return mat;
}

const colorFunctions = `
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
  // Blender's COLOR mix uses B's hue/saturation and A's value.
  vec3 leafColorBlend(vec3 a, vec3 b) {
    vec3 ah = leafRgbToHsv(a), bh = leafRgbToHsv(b);
    return leafHsvToRgb(vec3(bh.xy, ah.z));
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

export function createLeafMaterial(type, reference, uniforms) {
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide, alphaToCoverage: uniforms.uAlphaMode.value > 0.5, depthWrite: true });
  mat.name = type === 0 ? 'Material.003 (Blender reference)' : 'Material.005 (Blender reference)';
  mat.toneMapped = false; // Blender's saved AgX High Contrast transform is applied with a LUT.
  mat.customProgramCacheKey = () => `reference_leaf_${type}_narrow_canopy_shade_v6`;
  mat.onBeforeCompile = shader => {
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
      uLeafDisplay: { value: reference.display }, uLeafRandom: { value: new THREE.Vector3(...reference.metadata.materials[type].random) },
      uLeafSourceAtlas: { value: new THREE.Vector4(reference.metadata.atlas.size, reference.metadata.atlas.tile, 3, Math.floor(reference.metadata.atlas.size / reference.metadata.atlas.tile)) },
      uLeafDetailAtlas: { value: new THREE.Vector4(reference.detail.atlas.size, reference.detail.atlas.tile, reference.detail.atlas.padding, reference.detail.atlas.grid) },
      uSeasonOffset: uniforms.uSeasonOffset, uLeafFallEnabled: uniforms.uLeafFallEnabled, uLeafFallTime: uniforms.uLeafFallTime, uLeafFallSpeed: uniforms.uLeafFallSpeed, uDryingSpeed: uniforms.uDryingSpeed, uYellowPhaseWidth: uniforms.uYellowPhaseWidth, uDryingSharpness: uniforms.uDryingSharpness, uDryingFrontWidth: uniforms.uDryingFrontWidth, uRampThreshold: uniforms.uRampThreshold, uToonSteps: uniforms.uToonSteps,
      uCrownAO: uniforms.uCrownAO,
      uSceneIllumination: uniforms.uSceneIllumination || { value: 1 },
      uSunDirection: uniforms.uSunDirection || { value: new THREE.Vector3(0, 1, 0) },
      uSunIntensity: uniforms.uSunIntensity || { value: 0 },
      uMoonDirection: uniforms.uMoonDirection || { value: new THREE.Vector3(0, 1, 0) },
      uMoonIntensity: uniforms.uMoonIntensity || { value: 0 }
    });
    shader.vertexShader = leafFallDeclarations + `
      attribute vec2 referenceUv; attribute float referenceSeason; attribute float dryingPriority; attribute float dryingRegionPriority; attribute float seasonalRedResponse; attribute float seasonalDelay;
      uniform vec4 uLeafSourceAtlas; uniform vec4 uLeafDetailAtlas;
      varying vec2 vReferenceUv; varying float vReferenceSeason; varying float vDryingPriority; varying float vDryingRegionPriority; varying float vSeasonalRedResponse; varying float vSeasonalDelay;
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
        vReferenceUv = leafDetailUv(referenceUv); vReferenceSeason = referenceSeason; vDryingPriority = dryingPriority; vDryingRegionPriority = dryingRegionPriority; vSeasonalRedResponse = seasonalRedResponse; vSeasonalDelay = seasonalDelay;
        transformed = leafFallPosition(transformed, fallingLeafRotation);`);
    shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>\nmat3 fallingLeafRotation = leafFallRotation(objectNormal);\nobjectNormal = fallingLeafRotation * objectNormal;`);
    shader.vertexShader = 'attribute float canopyVisibility; varying float vCanopyVisibility;\n' + shader.vertexShader.replace(
      '#include <begin_vertex>', '#include <begin_vertex>\nvCanopyVisibility = canopyVisibility;');
    shader.fragmentShader = 'uniform float uCrownAO; uniform float uSceneIllumination; uniform vec3 uMoonDirection; uniform float uMoonIntensity; varying float vCanopyVisibility;\n' + shader.fragmentShader;
    shader.fragmentShader = `uniform sampler2D uLeafDiffuse; uniform sampler2D uLeafProcedural;
      uniform sampler2D uLeafDisplay; uniform vec3 uLeafRandom;
      uniform vec3 uSunDirection; uniform float uSunIntensity;
      uniform float uSeasonOffset; uniform float uDryingSpeed; uniform float uYellowPhaseWidth; uniform float uDryingSharpness; uniform float uDryingFrontWidth; uniform float uRampThreshold; uniform float uToonSteps;
      varying vec2 vReferenceUv; varying float vReferenceSeason; varying float vDryingPriority; varying float vDryingRegionPriority; varying float vSeasonalRedResponse; varying float vSeasonalDelay;\n` + shader.fragmentShader;
    // Inject after <common>, where Three's color conversion functions are already declared.
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\n' + colorFunctions);
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
      vec3 base = mix(green,min(green,procedural),0.7466666698);
      // Longer precomputed branch paths from the trunk base dry first.
      float seasonProgress = clamp(uSeasonOffset / 0.44 + 0.5, 0.0, 1.0);
      // About 25% of leaves start their color transition later, but the
      // normalized range still reaches the same brown endpoint at 100%.
      float delayedSeasonProgress = clamp(
        (seasonProgress - clamp(vSeasonalDelay, 0.0, 0.40)) /
        max(0.001, 1.0 - clamp(vSeasonalDelay, 0.0, 0.40)),
        0.0,
        1.0
      );
      // Speed changes only the local color blend, preserving branch order.
      // Even the slowest setting reaches the dry endpoint at season 100%.
      float sharpness = clamp(uDryingSharpness,0.0,1.0);
      float priority = mix(vDryingPriority,vDryingRegionPriority,sharpness);
      float leafStart = 0.385 + (1.0-clamp(priority,0.0,1.0)) * 0.38;
      float leafDuration = min(0.12/max(uDryingSpeed,0.05),1.0-leafStart);
      // At maximum sharpness the spatial frontier spans about 1–2 regions,
      // regardless of speed. Region coherence avoids scattered leaf gradients.
      float frontWidth = mix(leafDuration,min(leafDuration,uDryingFrontWidth),sharpness);
      float frontCenter = leafStart+0.5*leafDuration;
      float leafProgress = smoothstep(frontCenter-0.5*frontWidth,frontCenter+0.5*frontWidth,delayedSeasonProgress);
      float season = mix(0.50,0.80,leafProgress);
      // Season: two Hue/Saturation nodes -> Mix -> COLOR mix -> Hue/Saturation.
      vec3 variant = leafHueSat(base,0.57,1.1,1.0);
      variant = mix(base,variant,uLeafRandom.y);
      vec3 seasonal = uLeafType < 0.5 ? base : mix(base,variant,smoothstep(0.0,0.5,season));
      // Randomness delays the red/brown transition but never weakens its
      // final endpoint: at leafProgress == 1 every leaf reaches brown.
      float redResponse = clamp(vSeasonalRedResponse, 0.0, 1.0);
      float redStart = mix(0.35, 0.70, 1.0 - redResponse);
      float yellowPhaseWidth = clamp(uYellowPhaseWidth, 0.0, 1.0);
      float yellowStart = 0.05;
      // Yellow has its own duration and then holds briefly before red begins.
      // This lets the slider lengthen yellow without removing the red phase.
      float yellowEnd = mix(0.42, 0.76, yellowPhaseWidth);
      yellowEnd = max(yellowEnd, yellowStart + 0.04);
      float yellow = smoothstep(yellowStart, yellowEnd, leafProgress);
      vec3 yellowColor = uLeafType < 0.5 ? vec3(0.78, 0.60, 0.055) : vec3(0.84, 0.54, 0.035);
      seasonal = mix(seasonal,leafColorBlend(seasonal,yellowColor),yellow);
      float redBegin = max(0.82, redStart + 0.10);
      float autumn = smoothstep(redBegin, 1.0, leafProgress);
      vec3 red = uLeafType < 0.5 ? vec3(0.8589947224,0.0204435382,0.0008851319) : vec3(0.8589913845,0.0085899057,0.0085899057);
      seasonal = mix(seasonal,leafColorBlend(seasonal,red),autumn);
      seasonal = leafHueSat(seasonal,mix(0.55,0.5,uLeafRandom.y),1.0,1.0);
      // Compress strong daylight after the Blender transform to retain leaf
      // pigment/detail instead of boosting the brightest colours into clipping.
      float leafIllumination = uSceneIllumination / (1.0 + 0.32 * max(uSceneIllumination - 1.0, 0.0));
      outgoingLight = leafDisplayTransform(mix(shadowBase,seasonal,ramp)) * leafIllumination;
      float moonFacing = max(dot(normalize(normal), normalize(uMoonDirection)), 0.0);
      outgoingLight += mix(leafDisplayTransform(mix(shadowBase,seasonal,ramp)), vec3(1.0), 0.18)
        * vec3(0.72, 0.84, 1.0) * uMoonIntensity * (0.06 + 0.55 * moonFacing);

      // Thin leaves transmit a little sunlight towards their shaded side.
      // Match normal/view coordinates and attenuate leaves deep in the crown.
      vec3 transmittedSunDirection = normalize((viewMatrix * vec4(uSunDirection, 0.0)).xyz);
      float backlit = max(dot(-normalize(normal), transmittedSunDirection), 0.0);
      float towardsSun = pow(max(dot(-geometryViewDir, transmittedSunDirection), 0.0), 3.0);
      float crownTransmission = mix(0.15, 1.0, clamp(vCanopyVisibility, 0.0, 1.0));
      float transmittedLight = 0.30 * backlit * (0.35 + 0.65 * towardsSun)
        * crownTransmission * clamp(uSunIntensity, 0.0, 1.0);
      outgoingLight += leafDisplayTransform(seasonal) * vec3(1.12, 1.04, 0.72) * transmittedLight * ramp;

    `);
  };
  return mat;
}
