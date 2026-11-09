import * as THREE from 'three';

// The supplied PNG has black RGB and the complete brush in its alpha channel.
// Its principal stroke is x=494..536; a tiny stray mark at x~690 is excluded.
export async function createWaterBrushMaterial(loader, uniforms) {
  const brush = await loader.loadAsync('./web_assets/water_brush.png?v=cara-1');
  brush.flipY = false;
  brush.colorSpace = THREE.NoColorSpace;
  brush.wrapS = brush.wrapT = THREE.ClampToEdgeWrapping;
  brush.minFilter = THREE.LinearMipmapLinearFilter;
  brush.magFilter = THREE.LinearFilter;
  Object.assign(uniforms, {
    uSelected: { value: 0.0 },
    uBrushMap: { value: brush },
    // Crop both tapered ends: only the solid part from row 40 to 920 repeats.
    uBrushRect: { value: new THREE.Vector4(0.493, 0.040, 0.045, 0.880) },
    uStrokeLength: { value: 4.0 },
    uHighlightColor: { value: new THREE.Color(0x248cff) },
    uFlowDirection: { value: 1.0 },
    uWidthScale: { value: 1.0 },
    uFlowCutoff: { value: -1000000.0 },
    uFlowRevealBottom: { value: 0.0 }
  });
  const material = new THREE.ShaderMaterial({
    name: 'Water — cara.png blue brush',
    uniforms,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    side: THREE.FrontSide,
    vertexShader: `
      attribute vec3 flowCenter;
      attribute vec3 flowTangent;
      attribute float flowDistance;
      uniform float uWidthScale;
      uniform float uSelected;
      uniform float uTime;
      varying float vBrushX;
      varying float vFlowDistance;
      varying float vSelectionPulse;
      void main() {
        float selectionWave = 0.5 + 0.5 * sin(uTime * 3.2 - flowDistance * 1.7);
        vSelectionPulse = selectionWave;
        float selectedWidth = 1.0 + uSelected * (4.0 + 0.8 * selectionWave);
        vec3 scaledPosition = flowCenter + (position - flowCenter) * uWidthScale * selectedWidth;
        vec4 viewPosition = modelViewMatrix * vec4(scaledPosition, 1.0);
        vec3 tangent = mat3(modelViewMatrix) * flowTangent;
        vec2 axis = length(tangent.xy) > 0.0001 ? normalize(tangent.xy) : vec2(0.0, 1.0);
        vec2 across = vec2(-axis.y, axis.x);
        vec3 radial = mat3(modelViewMatrix) * (position - flowCenter);
        // Project across the visible diameter, rather than wrapping a narrow
        // stroke onto the back of the tube when the camera rotates.
        vBrushX = 0.5 + 0.5 * dot(radial.xy, across) / max(length(radial), 0.0001);
        vFlowDistance = flowDistance;
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D uBrushMap;
      uniform vec4 uBrushRect;
      uniform float uStrokeLength;
      uniform float uTime;
      uniform float uGlow;
      uniform float uSelected;
      uniform float uOpacity;
      uniform vec3 uColor;
      uniform vec3 uHighlightColor;
      uniform float uFlowDirection;
      uniform float uFlowCutoff;
      uniform float uFlowRevealBottom;
      varying float vBrushX;
      varying float vFlowDistance;
      varying float vSelectionPulse;
      float brushAlpha(float x, float phase) {
        vec2 uv = uBrushRect.xy + vec2(clamp(x,0.0,1.0), phase) * uBrushRect.zw;
        return texture2D(uBrushMap, uv).a;
      }
      void main() {
        float phase = fract(vFlowDistance / (uStrokeLength * 2.0) - uTime * 0.09 * uFlowDirection);
        // Mirrored repetition meets at exactly the same source row at either
        // seam. No end-to-start jump or dim overlapping tip can break the line.
        float joinedPhase = 1.0 - abs(phase * 2.0 - 1.0);
        float stroke = brushAlpha(vBrushX, joinedPhase);
        float remainingFlow = mix(
          smoothstep(uFlowCutoff, uFlowCutoff + 0.35, vFlowDistance),
          1.0 - smoothstep(uFlowCutoff, uFlowCutoff + 0.35, vFlowDistance),
          uFlowRevealBottom
        );
        float selectionAlpha = mix(1.0, 0.75 + 0.25 * vSelectionPulse, uSelected);
        float alpha = stroke * uOpacity * remainingFlow * selectionAlpha;
        if (alpha < 1.0 / 255.0) discard;
        float pulse = sin(vFlowDistance * 3.0 - uTime * 2.2 * uFlowDirection) * 0.5 + 0.5;
        float highlight = pow(pulse, 3.5) * clamp(uGlow, 0.0, 2.5) * 0.55;
        vec3 color = mix(uColor, uHighlightColor, clamp(highlight, 0.0, 0.8));
        gl_FragColor = vec4(color, alpha);
      }
    `
  });
  return material;
}

// Static attributes: no geometry rebuild or CPU work is needed during motion.
export function addWaterBrushAttributes(geometry, curve = null, offset = 0) {
  const count = geometry.attributes.position.count;
  const centers = new Float32Array(count * 3), tangents = new Float32Array(count * 3);
  const distances = new Float32Array(count);
  if (curve) {
    const segments = geometry.parameters.tubularSegments;
    const ringSize = geometry.parameters.radialSegments + 1, length = curve.getLength();
    const center = new THREE.Vector3(), tangent = new THREE.Vector3();
    for (let ring = 0; ring <= segments; ring++) {
      const t = ring / segments;
      curve.getPointAt(t, center); curve.getTangentAt(t, tangent);
      for (let j = 0; j < ringSize; j++) {
        const i = ring * ringSize + j;
        center.toArray(centers, i * 3); tangent.toArray(tangents, i * 3);
        distances[i] = t * length + offset;
      }
    }
  } else {
    // The junction sphere is centered in its own local coordinates and uses
    // the same distance zero as all roots meeting the trunk.
    for (let i = 0; i < count; i++) tangents[i * 3 + 1] = 1;
  }
  geometry.setAttribute('flowCenter', new THREE.BufferAttribute(centers, 3));
  geometry.setAttribute('flowTangent', new THREE.BufferAttribute(tangents, 3));
  geometry.setAttribute('flowDistance', new THREE.BufferAttribute(distances, 1));
}
