import * as THREE from 'three';
import { seasonColorForPosition } from './season_timeline.js?v=beech-calendar-1';

// Each intro copy owns only its leaf buffers and seasonal uniforms. Textures,
// lighting uniforms and all non-leaf geometry stay shared with the main tree.
export function createIntroTreeSeason({ leafControls, getPosition }) {
  return index => {
    const offset = index + 1;
    const season = { value: 0 };
    const time = { value: 0 };
    const growth = { value: 1 };
    const materials = new Map();
    const geometries = [];
    function materialFor(source) {
      if (materials.has(source)) return materials.get(source);
      const material = source.clone();
      const compile = source.onBeforeCompile;
      material.customProgramCacheKey = () => source.customProgramCacheKey() + '_intro_season_1';
      material.onBeforeCompile = function(shader, renderer) {
        compile.call(this, shader, renderer);
        shader.uniforms.uSeasonOffset = season;
        shader.uniforms.uLeafFallTime = time;
        shader.uniforms.uIntroGrowth = growth;
        shader.vertexShader = 'uniform float uIntroGrowth;\n' + shader.vertexShader.replace(
          'transformed = leafFallPosition(',
          'transformed = leafFallCenter + (transformed - leafFallCenter) * uIntroGrowth;\ntransformed = leafFallPosition(');
      };
      materials.set(source, material);
      return material;
    }
    return {
      offset,
      prepare(source, copy) {
        const model = leafControls.models.find(entry => entry.mesh === source);
        if (!model) return false;
        const geometry = source.geometry.clone();
        geometry.attributes.position.array.set(model.original);
        geometry.attributes.position.needsUpdate = true;
        const starts = geometry.attributes.leafFallStartTime;
        const seeds = geometry.attributes.leafFallSeed;
        for (let vertex = 0; vertex < starts.count; vertex++) {
          starts.setX(vertex, 2.48 * 12 + seeds.getX(vertex) * 4.5);
        }
        starts.needsUpdate = true;
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        geometries.push(geometry);
        copy.geometry = geometry;
        copy.material = Array.isArray(source.material)
          ? source.material.map(materialFor) : materialFor(source.material);
        if (source.customDepthMaterial) copy.customDepthMaterial = materialFor(source.customDepthMaterial);
        if (source.customDistanceMaterial) copy.customDistanceMaterial = materialFor(source.customDistanceMaterial);
        // Falling leaves can leave the original crown bounds.
        copy.frustumCulled = false;
        return true;
      },
      update() {
        const position = getPosition() + offset;
        const phase = ((position % 4) + 4) % 4;
        season.value = (seasonColorForPosition(position) - 0.5) * 0.44;
        time.value = phase * 12;
        growth.value = THREE.MathUtils.smoothstep(phase, 0, 0.35) * leafControls.scale;
      },
      dispose() {
        geometries.forEach(geometry => geometry.dispose());
        materials.forEach(material => material.dispose());
      }
    };
  };
}
