import * as THREE from 'three';

export async function loadBarkReference() {
  const response = await fetch('./web_assets/bark_reference.json');
  if (!response.ok) throw Error('Chybí materiál Bark_GraphML_Tree z Blenderu');
  return response.json();
}

export async function loadBarkAttributes(modelUrl) {
  const base = modelUrl.replace(/\.glb$/, '');
  const values = await Promise.all(['trunk','roots'].map(async kind => {
    const response = await fetch(`${base}_bark_${kind}.bin`);
    if (!response.ok) throw Error(`Chybí kresba kůry: ${kind}`);
    return new Uint16Array(await response.arrayBuffer());
  }));
  return { trunk: values[0], roots: values[1] };
}

export function attachBarkAttributes(geometry, data) {
  if (data.length !== geometry.attributes.position.count * 3) throw Error('Nesouhlasí kresba kůry s geometrií modelu');
  geometry.setAttribute('barkPattern',new THREE.BufferAttribute(data,3,true));
}

export function createBarkMaterial(reference, leafReference, uniforms) {
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.FrontSide });
  material.name = 'Bark_GraphML_Tree (Blender reference)';
  material.toneMapped = false;
  material.customProgramCacheKey = () => 'blender_bark_reference_stable_shadow_v4';
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, {
      uBarkDiffuse: { value: leafReference.diffuse },
      uBarkDisplay: { value: leafReference.display },
      uBarkInvert: { value: reference.invert },
      uBarkDarken: { value: reference.darken },
      uBarkThreshold: { value: reference.ramp[1].position },
      uBarkShadow: { value: new THREE.Vector3(...reference.ramp[0].color.slice(0,3)) },
      uBarkLit: { value: new THREE.Vector3(...reference.ramp[1].color.slice(0,3)) },
      uBarkToonSteps: uniforms.uToonSteps,
      uSceneIllumination: uniforms.uSceneIllumination || { value: 1 },
      uMoonDirection: uniforms.uMoonDirection || { value: new THREE.Vector3(0, 1, 0) },
      uMoonIntensity: uniforms.uMoonIntensity || { value: 0 }
    });
    shader.vertexShader = `attribute vec3 barkPattern; varying vec3 vBarkPattern; varying vec2 vBarkUv;\n` + shader.vertexShader.replace(
      '#include <begin_vertex>', '#include <begin_vertex>\nvBarkPattern=barkPattern; vBarkUv=uv;');
    shader.fragmentShader = `
      uniform sampler2D uBarkDiffuse;
      uniform sampler2D uBarkDisplay;
      uniform float uBarkInvert;
      uniform float uBarkDarken;
      uniform float uBarkThreshold;
      uniform float uBarkToonSteps;
      uniform float uSceneIllumination;
      uniform vec3 uMoonDirection;
      uniform float uMoonIntensity;
      uniform vec3 uBarkShadow;
      uniform vec3 uBarkLit;
      varying vec3 vBarkPattern;
      varying vec2 vBarkUv;
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `
      #include <common>
      vec3 barkDisplaySlice(vec3 color, float slice) {
        return texture2D(uBarkDisplay,vec2((slice*64.0+color.r*63.0+0.5)/4096.0,(color.g*63.0+0.5)/64.0)).rgb;
      }
      vec3 barkDisplayTransform(vec3 color) {
        color=clamp(color,0.0,1.0);
        float b=color.b*63.0;
        vec3 srgb=mix(barkDisplaySlice(color,floor(b)),barkDisplaySlice(color,min(floor(b)+1.0,63.0)),fract(b));
        return mix(pow((srgb+0.055)/1.055,vec3(2.4)),srgb/12.92,lessThanEqual(srgb,vec3(0.04045)));
      }
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      // The original image -> Invert Color -> Diffuse BSDF, in linear RGB.
      vec3 sourceColor=texture2D(uBarkDiffuse,vBarkUv).rgb;
      diffuseColor.rgb=mix(sourceColor,vec3(1.0)-sourceColor,uBarkInvert);
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <envmap_fragment>', `
      #include <envmap_fragment>
      float lightValue=dot(reflectedLight.directDiffuse+reflectedLight.indirectDiffuse,vec3(0.2126,0.7152,0.0722));
      // CONSTANT switches at the right stop (1.0), not the black stop (0.16).
      float edgeWidth = uBarkToonSteps == 0.0 ? 0.1 : 0.035;
      float ramp = smoothstep(uBarkThreshold-edgeWidth,uBarkThreshold+edgeWidth,lightValue);
      vec3 base=mix(uBarkShadow,uBarkLit,ramp);
      // Blender's actual Noise -> Manhattan Voronoi -> EASE ramp sampled on
      // this mesh. No invented trunk/root color or screen-space grain.
      vec3 result=mix(base,min(base,vBarkPattern),uBarkDarken);
      outgoingLight=barkDisplayTransform(result) * uSceneIllumination;
      float moonFacing = max(dot(normalize(normal), normalize(uMoonDirection)), 0.0);
      outgoingLight += mix(barkDisplayTransform(result), vec3(1.0), 0.18)
        * vec3(0.72, 0.84, 1.0) * uMoonIntensity * (0.06 + 0.55 * moonFacing);
    `);
  };
  return material;
}
