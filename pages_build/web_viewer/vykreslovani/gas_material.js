// The leaf shader's solid-interior alpha mode, adapted to gas sprite textures.
export function applyGasLeafStyle(material) {
  material.transparent = false;
  material.opacity = 1;
  material.alphaTest = 0;
  material.alphaToCoverage = true;
  material.depthWrite = true;
  material.customProgramCacheKey = () => 'gas_leaf_alpha_edges_v2';
  material.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <alphatest_fragment>', `
      float coverage = diffuseColor.a;
      float alphaWidth = max(fwidth(coverage), 1.0 / 255.0);
      diffuseColor.a = smoothstep(0.5 - alphaWidth, 0.5 + alphaWidth, coverage);
      if (diffuseColor.a <= 0.0) discard;
    `);
    // Preserve contour coverage for MSAA rather than forcing opaque edge pixels.
    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
      #undef OPAQUE
      #include <opaque_fragment>
    `);
  };
  return material;
}