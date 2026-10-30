// The same small vertex motion is used by leaf color and shadow materials.
// Only time/strength uniforms change each frame; geometry stays on the GPU.
export function setupLeafBreeze(materials, { leafCenters = false } = {}) {
  const strength = { value: 0.25 };
  const time = { value: 0 };
  const input = document.getElementById('sliderLeafWind');
  const label = document.getElementById('valLeafWind');
  const sync = () => {
    strength.value = Number(input.value) / 100;
    label.textContent = `${input.value} %`;
  };
  input.addEventListener('input', sync);
  sync();
  const declarations = `
    uniform float uBreezeStrength;
    uniform float uBreezeTime;
    mat3 leafBreezeRotation(vec3 center) {
      float phase = dot(center, vec3(1.37, 0.61, 1.91));
      float gust = 0.65 + 0.35 * sin(uBreezeTime * 0.53 + center.x * 0.24);
      float angle = uBreezeStrength * gust *
        (0.10 * sin(uBreezeTime * 1.65 + phase) + 0.045 * sin(uBreezeTime * 3.1 + phase * 1.7));
      ${leafCenters ? 'if (leafFallAge() > 0.0) angle = 0.0;' : ''}
      float s = sin(angle), c = cos(angle);
      return mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0);
    }
    vec3 leafBreezeOffset(vec3 center) {
      float phase = dot(center, vec3(0.37, 0.21, 0.41));
      float amount = uBreezeStrength;
      ${leafCenters ? 'if (leafFallAge() > 0.0) amount = 0.0;' : ''}
      return vec3(sin(uBreezeTime * 1.1 + phase), sin(uBreezeTime * 1.7 + phase) * 0.2,
        cos(uBreezeTime * 0.9 + phase)) * (0.045 * amount);
    }
  `;
  for (const material of materials) {
    const compile = material.onBeforeCompile;
    const cacheKey = material.customProgramCacheKey();
    material.customProgramCacheKey = () => `${cacheKey}_breeze_1`;
    material.onBeforeCompile = function(shader, renderer) {
      compile.call(this, shader, renderer);
      shader.uniforms.uBreezeStrength = strength;
      shader.uniforms.uBreezeTime = time;
      // Add after existing declarations, including leafFallAge in modern materials.
      shader.vertexShader = shader.vertexShader.replace('void main() {', declarations + '\nvoid main() {');
      const center = leafCenters ? 'leafFallCenter' : 'position';
      shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>',
        `#include <beginnormal_vertex>\nobjectNormal = leafBreezeRotation(${center}) * objectNormal;`);
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',
        `#include <begin_vertex>\ntransformed = ${center} + leafBreezeRotation(${center}) * (transformed - ${center}) + leafBreezeOffset(${center});`);
    };
    material.needsUpdate = true;
  }
  return {
    update(seconds) { time.value = seconds; },
    get active() { return strength.value > 0; }
  };
}
