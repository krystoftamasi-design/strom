// Shared by the visible and shadow shaders. No per-frame geometry uploads.
export const leafFallDeclarations = `
  uniform float uLeafFallEnabled;
  uniform float uLeafFallTime;
  uniform float uLeafFallSpeed;
  attribute float leafFallSeed;
  attribute float leafFallStartTime;
  attribute vec3 leafFallCenter;
  attribute vec3 leafFallLanding;
  varying float vLeafFallProgress;

  mat3 leafAxisRotation(vec3 axis, float angle) {
    float s = sin(angle), c = cos(angle), k = 1.0 - c;
    vec3 a = normalize(axis);
    return mat3(
      c+a.x*a.x*k, a.y*a.x*k+a.z*s, a.z*a.x*k-a.y*s,
      a.x*a.y*k-a.z*s, c+a.y*a.y*k, a.z*a.y*k+a.x*s,
      a.x*a.z*k+a.y*s, a.y*a.z*k-a.x*s, c+a.z*a.z*k
    );
  }
  float leafFallAge() {
    return uLeafFallEnabled > 0.5 ? max(0.0, uLeafFallTime - leafFallStartTime) : 0.0;
  }
  float leafFallSpeed() { return (2.1 + leafFallSeed * 1.5) * max(uLeafFallSpeed, 0.05); }
  float leafWindDelay() { return 0.55 + leafFallSeed * 0.35; }
  float leafWindRelease(float t) { return smoothstep(leafWindDelay(), leafWindDelay() + 1.2, t); }
  // Integral of the wind ramp: zero lateral velocity on release, then smooth acceleration.
  float leafWindTime(float t) {
    float elapsed = max(0.0, t - leafWindDelay());
    float ramp = clamp(elapsed / 1.2, 0.0, 1.0);
    return 1.2 * ramp * ramp * ramp * (1.0 - 0.5 * ramp) + max(0.0, elapsed - 1.2);
  }
  float leafFlightTime() {
    float height = length((modelMatrix * vec4(leafFallCenter - leafFallLanding, 0.0)).xyz);
    return height / leafFallSpeed() + 0.65;
  }
  mat3 leafFallRotation(vec3 originalNormal) {
    float age = leafFallAge();
    if (age <= 0.0) return mat3(1.0);
    float flight = leafFlightTime();
    float t = min(age, flight);
    float phase = leafFallSeed * 6.2831853;
    float release = leafWindRelease(t);
    float windTime = leafWindTime(t);
    vec3 up = normalize(leafFallCenter - leafFallLanding);
    vec3 side = normalize(cross(up, vec3(0.0, 0.0, 1.0)));
    vec3 forward = cross(side, up);
    // Flutter and an uneven roll instead of a constant propeller spin.
    float pitch = (sin(windTime * (4.1 + leafFallSeed * 2.0) + phase) * 0.7 + sin(windTime * 1.3 + phase) * 0.35) * release;
    float roll = (windTime * (leafFallSeed - 0.5) * 1.8 + sin(windTime * 3.2 + phase) * 0.45) * release;
    mat3 rotation = leafAxisRotation(up, windTime * (0.35 + leafFallSeed * 0.55) * release)
      * leafAxisRotation(side, pitch) * leafAxisRotation(forward, roll);
    // Ease onto the ground as one rigid leaf, with its plane lying flat.
    vec3 n = normalize(rotation * originalNormal);
    vec3 target = dot(n, up) < 0.0 ? -up : up;
    vec3 axis = cross(n, target);
    float axisLength = length(axis);
    float settle = smoothstep(flight - 0.35, flight + 0.55, age);
    if (axisLength > 0.0001) rotation = leafAxisRotation(axis / axisLength, atan(axisLength, dot(n, target)) * settle) * rotation;
    return rotation;
  }
  vec3 leafFallPosition(vec3 position, mat3 rotation) {
    float age = leafFallAge();
    vLeafFallProgress = 0.0;
    if (age <= 0.0) return position;
    float flight = leafFlightTime();
    float t = min(age, flight);
    float phase = leafFallSeed * 6.2831853;
    float height = length((modelMatrix * vec4(leafFallCenter - leafFallLanding, 0.0)).xyz);
    // Accelerate out of the branch, then approach an aerodynamic terminal speed.
    float drop = leafFallSpeed() * (t - 0.65 * (1.0 - exp(-t / 0.65)));
    float totalDrop = leafFallSpeed() * (flight - 0.65 * (1.0 - exp(-flight / 0.65)));
    float descent = clamp(drop / max(totalDrop, 0.01), 0.0, 1.0);
    vec3 up = normalize(leafFallCenter - leafFallLanding);
    vec3 side = normalize(cross(up, vec3(0.0, 0.0, 1.0)));
    vec3 forward = cross(side, up);
    float release = leafWindRelease(t);
    float windTime = leafWindTime(t);
    float airborne = 1.0 - smoothstep(0.85, 1.0, descent);
    // Several independent air streams: the main gust, a cross current and a
    // slower eddy. Their phase is stable per leaf, so motion stays random but
    // does not shimmer when the camera moves.
    float gust = sin(windTime * 0.9 + phase) - sin(phase);
    float sway = sin(windTime * 2.0 + phase * 1.7) - sin(phase * 1.7);
    float eddy = sin(windTime * 0.52 + phase * 2.7) - sin(phase * 2.7);
    float windSpeed = 1.1 + fract(leafFallSeed * 17.31) * 1.05;
    float phaseB = phase * 1.91 + 1.37;
    float phaseC = phase * 3.17 + 4.21;
    vec3 windDirection = normalize(side * cos(phase) + forward * sin(phase));
    vec3 crossDirection = normalize(side * cos(phaseB) + forward * sin(phaseB));
    vec3 eddyDirection = normalize(side * cos(phaseC) + forward * sin(phaseC));
    float wander = (cos(phase * 2.3) - cos(windTime * 0.65 + phase * 2.3)) / 0.65;
    float crossWander = (sin(phaseB) - sin(windTime * 0.78 + phaseB)) / 0.78;
    vec3 drift = windDirection * (windTime * windSpeed)
      + crossDirection * crossWander * 0.62 * windSpeed * release
      + eddyDirection * eddy * 0.48 * windSpeed * release
      + side * wander * 0.35 * windSpeed * release
      + side * gust * 1.15 * release
      + forward * sway * 1.25 * release;
    vec3 center = mix(leafFallCenter, leafFallLanding, descent) + drift;
    center += up * sin(t * 4.3 + phase) * 0.10 * release * airborne;
    vLeafFallProgress = smoothstep(flight + 4.0, flight + 7.0, age);
    return center + rotation * (position - leafFallCenter);
  }
`;
