/* Hand-rolled raymarched chrome form with deterministic additive particles. */

const initHeroScene = () => {
  const root = document.querySelector<HTMLElement>('[data-hero-scene]');
  const canvas = root?.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  const fallback = root?.querySelector<HTMLElement>('[data-hero-fallback]');
  if (!root || !canvas || !fallback) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gl = canvas.getContext('webgl', {
    alpha: true, antialias: true, depth: false, powerPreference: 'high-performance',
  });
  const showFallback = () => {
    canvas.hidden = true;
    fallback.hidden = false;
    root.removeAttribute('data-scene-ready');
  };
  if (!gl) { showFallback(); return; }

  const vertex = `
    attribute vec2 a;
    void main() { gl_Position = vec4(a, 0.0, 1.0); }
  `;
  const fragment = `
    precision highp float;
    uniform vec2 uRes;
    uniform float uTime;
    uniform vec2 uPointer;
    uniform float uScroll;
    uniform vec3 uRipple;
    uniform float uFade;
    uniform float uSteps;
    mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }
    float map(vec3 p) {
      vec3 q = p;
      q.xz = rot(uTime * 0.11 + uScroll * 0.45) * q.xz;
      q.xy = rot(0.22 + uTime * 0.08 + uScroll * 0.3) * q.xy;
      float morph = clamp(uScroll, 0.0, 1.0);
      vec3 a = vec3(sin(uTime * 0.52) * 0.42, cos(uTime * 0.47) * 0.26, 0.0);
      vec3 b = vec3(cos(uTime * 0.38 + 1.4) * -0.4, sin(uTime * 0.61) * 0.33, 0.18);
      vec3 c = vec3(sin(uTime * 0.29 + 2.1) * 0.24, cos(uTime * 0.54 + 0.7) * -0.4, -0.16);
      a *= 1.0 + morph * 0.2; b.y += morph * 0.28; c.x -= morph * 0.22;
      float d = length(q - a) - (0.58 - morph * 0.06);
      d = smin(d, length(q - b) - 0.48, 0.42);
      d = smin(d, length(q - c) - 0.4, 0.42);
      d += 0.018 * sin(q.x * 6.0 + uTime * 1.3) * sin(q.y * 5.0 - uTime * 0.9) * sin(q.z * 7.0 + uTime * 0.7);
      float rippleAge = max(0.0, uTime - uRipple.z);
      float rippleDist = abs(length(q.xy - uRipple.xy) - rippleAge * 1.8);
      d -= exp(-rippleDist * 18.0) * exp(-rippleAge * 1.8) * 0.035;
      return d;
    }
    vec3 normalAt(vec3 p) {
      vec2 e = vec2(0.0015, 0.0);
      return normalize(vec3(map(p + e.xyy) - map(p - e.xyy), map(p + e.yxy) - map(p - e.yxy), map(p + e.yyx) - map(p - e.yyx)));
    }
    float march(vec3 ro, vec3 rd) {
      float t = 0.0;
      for (int i = 0; i < 84; i++) {
        if (float(i) >= uSteps) break;
        vec3 p = ro + rd * t; float d = map(p);
        if (d < 0.0015) return t;
        if (t > 9.0) break;
        t += d * 0.9;
      }
      return 10.0;
    }
    vec3 environment(vec3 d) {
      float y = d.y * 0.5 + 0.5;
      vec3 base = mix(vec3(0.012, 0.014, 0.022), vec3(0.09, 0.11, 0.18), smoothstep(0.0, 1.0, y));
      base += vec3(0.95, 0.33, 0.12) * pow(max(d.x, 0.0), 3.0) * 0.75;
      base += vec3(0.18, 0.30, 0.95) * pow(max(-d.x, 0.0), 3.0) * 0.55;
      base += vec3(1.0) * pow(max(d.z, 0.0), 8.0) * 0.35;
      return base;
    }
    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);
      vec3 ro = vec3(uPointer.x * 0.42, uPointer.y * 0.28, 4.15);
      vec3 rd = normalize(vec3(uv, -2.05));
      rd.xz = rot(uPointer.x * 0.12) * rd.xz; rd.yz = rot(-uPointer.y * 0.08) * rd.yz;
      float t = march(ro, rd); vec3 color = vec3(0.0); float alpha = 0.0;
      if (t < 9.0) {
        vec3 p = ro + rd * t; vec3 n = normalAt(p); vec3 v = -rd; vec3 r = reflect(rd, n);
        float diff = max(dot(n, normalize(vec3(1.2, 1.8, 2.0))), 0.0);
        float fresnel = pow(1.0 - max(dot(n, v), 0.0), 3.0);
        color = environment(r) * (0.4 + 0.6 * diff);
        color = mix(color, environment(refract(rd, n, 0.72)), 0.18);
        vec3 film = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + fresnel * 1.8 + dot(n, v)));
        color += film * fresnel * 0.28;
        color += vec3(1.0, 0.32, 0.10) * pow(max(dot(n, normalize(vec3(-1.0, 0.2, 0.7))), 0.0), 2.2) * 0.75;
        color += vec3(0.18, 0.32, 1.0) * fresnel * 0.55;
        color += vec3(1.0) * pow(max(dot(n, v), 0.0), 22.0) * 0.34; alpha = 1.0;
      }
      float grain = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
      color += grain * 0.025;
      float vignette = 1.0 - smoothstep(0.35, 1.35, length(uv));
      color *= mix(0.48, 1.0, vignette);
      gl_FragColor = vec4(pow(max(color, 0.0), vec3(0.92)) * uFade, alpha * uFade);
    }
  `;
  const particleVertex = `
    attribute vec3 aPosition; attribute float aSeed;
    uniform float uTime; uniform vec2 uPointer; uniform vec2 uRes; uniform float uFade;
    varying float vAlpha; varying float vBlue;
    void main() {
      vec3 p = aPosition;
      float phase = aSeed * 6.2831853;
      p.z = mod(p.z + uTime * (0.12 + fract(aSeed * 13.7) * 0.24) + 5.0, 10.0) - 5.0;
      p.x += sin(uTime * 0.22 + phase) * 0.055 + uPointer.x * (0.05 + aSeed * 0.035);
      p.y += cos(uTime * 0.18 + phase) * 0.05 + uPointer.y * 0.035;
      vec4 view = vec4(p, 1.0); float depth = max(1.0, 5.0 - p.z);
      gl_Position = vec4(p.x / depth * 1.8, p.y / depth * 1.8, 0.0, 1.0);
      gl_PointSize = clamp((1.2 + fract(aSeed * 19.3) * 2.1) * uRes.y / 700.0 / depth, 1.0, 4.2);
      vAlpha = (0.22 + 0.55 * fract(aSeed * 7.13)) * uFade * smoothstep(-5.0, -2.0, p.z);
      vBlue = step(0.52, fract(aSeed * 11.71));
    }
  `;
  const particleFragment = `
    precision mediump float; varying float vAlpha; varying float vBlue;
    void main() {
      vec2 q = gl_PointCoord - 0.5; float d = length(q);
      float glow = exp(-d * d * 24.0) * (1.0 - smoothstep(0.12, 0.5, d)) * vAlpha;
      vec3 color = mix(vec3(1.0, 0.34, 0.08), vec3(0.16, 0.43, 1.0), vBlue);
      gl_FragColor = vec4(color * glow, glow);
    }
  `;
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
    return shader;
  };
  const buildProgram = (vsSource: string, fsSource: string) => {
    const vs = compile(gl.VERTEX_SHADER, vsSource), fs = compile(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) { if (vs) gl.deleteShader(vs); if (fs) gl.deleteShader(fs); return null; }
    const p = gl.createProgram();
    if (!p) { gl.deleteShader(vs); gl.deleteShader(fs); return null; }
    gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
    gl.deleteShader(vs); gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { gl.deleteProgram(p); return null; }
    return p;
  };
  const program = buildProgram(vertex, fragment), particleProgram = buildProgram(particleVertex, particleFragment);
  if (!program || !particleProgram) { if (program) gl.deleteProgram(program); if (particleProgram) gl.deleteProgram(particleProgram); showFallback(); return; }
  const buffer = gl.createBuffer(), particleBuffer = gl.createBuffer();
  if (!buffer || !particleBuffer) { if (buffer) gl.deleteBuffer(buffer); if (particleBuffer) gl.deleteBuffer(particleBuffer); gl.deleteProgram(program); gl.deleteProgram(particleProgram); showFallback(); return; }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const rayAttr = gl.getAttribLocation(program, 'a');
  if (rayAttr < 0) { gl.deleteBuffer(buffer); gl.deleteBuffer(particleBuffer); gl.deleteProgram(program); gl.deleteProgram(particleProgram); showFallback(); return; }
  const rayUniforms = {
    res: gl.getUniformLocation(program, 'uRes'), time: gl.getUniformLocation(program, 'uTime'),
    pointer: gl.getUniformLocation(program, 'uPointer'), scroll: gl.getUniformLocation(program, 'uScroll'),
    ripple: gl.getUniformLocation(program, 'uRipple'), fade: gl.getUniformLocation(program, 'uFade'),
    steps: gl.getUniformLocation(program, 'uSteps'),
  };
  const particleUniforms = {
    time: gl.getUniformLocation(particleProgram, 'uTime'), pointer: gl.getUniformLocation(particleProgram, 'uPointer'),
    res: gl.getUniformLocation(particleProgram, 'uRes'), fade: gl.getUniformLocation(particleProgram, 'uFade'),
  };
  if (Object.values(rayUniforms).some((x) => x === null) || Object.values(particleUniforms).some((x) => x === null)) {
    gl.deleteBuffer(buffer); gl.deleteBuffer(particleBuffer); gl.deleteProgram(program); gl.deleteProgram(particleProgram); showFallback(); return;
  }

  let width = 1, height = 1, raf = 0, visible = false, destroyed = false;
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0, scrollTarget = 0, scrollCurrent = 0;
  let rippleX = 99, rippleY = 99, rippleTime = -100;
  const started = performance.now();
  const mobile = () => window.matchMedia('(max-width: 759px)').matches;
  const seed = (n: number) => { let x = (n + 0x6d2b79f5) | 0; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
  const count = mobile() ? 720 : 1800;
  const particleData = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const j = i * 4, s = seed(i + 1);
    particleData[j] = (seed(i * 4 + 10) - 0.5) * 6.2;
    particleData[j + 1] = (seed(i * 4 + 11) - 0.5) * 4.2;
    particleData[j + 2] = seed(i * 4 + 12) * 10 - 5;
    particleData[j + 3] = s;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, particleData, gl.STATIC_DRAW);
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, mobile() ? 1.2 : 1.75);
    width = Math.max(1, Math.round(rect.width * dpr)); height = Math.max(1, Math.round(rect.height * dpr));
    canvas.width = width; canvas.height = height; gl.viewport(0, 0, width, height);
  };
  const updateScroll = () => {
    const rect = root.getBoundingClientRect();
    scrollTarget = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
  };
  const draw = (now: number) => {
    raf = 0;
    if (destroyed || !visible || document.hidden) return;
    if (!reduceMotion.matches) {
      currentX += (targetX - currentX) * 0.05; currentY += (targetY - currentY) * 0.05;
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.045;
    }
    const time = reduceMotion.matches ? 0.6 : (now - started) / 1000;
    const fade = reduceMotion.matches ? 1 : Math.min(1, (now - started) / 2000);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(rayAttr); gl.vertexAttribPointer(rayAttr, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(rayUniforms.res, width, height); gl.uniform1f(rayUniforms.time, time);
    gl.uniform2f(rayUniforms.pointer, currentX, currentY); gl.uniform1f(rayUniforms.scroll, scrollCurrent);
    gl.uniform3f(rayUniforms.ripple, rippleX, rippleY, rippleTime); gl.uniform1f(rayUniforms.fade, fade);
    gl.uniform1f(rayUniforms.steps, mobile() ? 56 : 84); gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.useProgram(particleProgram); gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
    const pos = gl.getAttribLocation(particleProgram, 'aPosition'), seedAttr = gl.getAttribLocation(particleProgram, 'aSeed');
    gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(seedAttr); gl.vertexAttribPointer(seedAttr, 1, gl.FLOAT, false, 16, 12);
    gl.uniform1f(particleUniforms.time, time); gl.uniform2f(particleUniforms.pointer, currentX, currentY);
    gl.uniform2f(particleUniforms.res, width, height); gl.uniform1f(particleUniforms.fade, fade);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.drawArrays(gl.POINTS, 0, count); gl.disable(gl.BLEND);
    if (!root.hasAttribute('data-scene-ready')) root.setAttribute('data-scene-ready', 'true');
    if (!reduceMotion.matches) schedule();
  };
  const schedule = () => { if (!raf && !destroyed && visible && !document.hidden && !reduceMotion.matches) raf = requestAnimationFrame(draw); };
  const renderStatic = () => { if (!destroyed && visible && !document.hidden) draw(performance.now()); };
  const onPointer = (event: PointerEvent) => {
    if (reduceMotion.matches) return;
    targetX = (event.clientX / window.innerWidth) * 2 - 1; targetY = -((event.clientY / window.innerHeight) * 2 - 1);
  };
  const onDown = (event: PointerEvent) => {
    if (reduceMotion.matches) return;
    const rect = canvas.getBoundingClientRect();
    rippleX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    rippleY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    rippleTime = (performance.now() - started) / 1000;
  };
  const onVisibility = () => { if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; } else { if (reduceMotion.matches) renderStatic(); else schedule(); } };
  const onMotionChange = () => { if (raf) cancelAnimationFrame(raf); raf = 0; if (reduceMotion.matches) renderStatic(); else schedule(); };
  const observer = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (visible) { updateScroll(); if (reduceMotion.matches) renderStatic(); else schedule(); }
    else if (raf) { cancelAnimationFrame(raf); raf = 0; }
  });
  const cleanup = () => {
    if (destroyed) return; destroyed = true;
    if (raf) cancelAnimationFrame(raf); observer.disconnect();
    window.removeEventListener('resize', onResize); window.removeEventListener('scroll', onScroll);
    window.removeEventListener('pointermove', onPointer); canvas.removeEventListener('pointerdown', onDown);
    document.removeEventListener('visibilitychange', onVisibility);
    reduceMotion.removeEventListener('change', onMotionChange);
    window.removeEventListener('pagehide', cleanup); document.removeEventListener('astro:before-swap', cleanup);
    gl.deleteBuffer(buffer); gl.deleteBuffer(particleBuffer); gl.deleteProgram(program); gl.deleteProgram(particleProgram);
    root.removeAttribute('data-scene-ready');
  };
  const onResize = () => { resize(); if (visible && reduceMotion.matches) renderStatic(); };
  const onScroll = () => { updateScroll(); };
  resize(); updateScroll(); observer.observe(root);
  window.addEventListener('resize', onResize, { passive: true }); window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pointermove', onPointer, { passive: true }); canvas.addEventListener('pointerdown', onDown, { passive: true });
  document.addEventListener('visibilitychange', onVisibility); reduceMotion.addEventListener('change', onMotionChange);
  window.addEventListener('pagehide', cleanup); document.addEventListener('astro:before-swap', cleanup);
  root.setAttribute('data-scene-ready', 'true');
};

initHeroScene();
