/* A small raymarched chrome form. No 3D library, no network request: one
   fragment shader draws the object, the pointer tilts the camera, and the loop
   stops when the canvas leaves the viewport or the tab is hidden. */

const initHeroScene = () => {
  const root = document.querySelector<HTMLElement>('[data-hero-scene]');
  const canvas = root?.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  const fallback = root?.querySelector<HTMLElement>('[data-hero-fallback]');
  if (!root || !canvas || !fallback) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    depth: false,
    powerPreference: 'high-performance',
  });

  const showFallback = () => {
    canvas.hidden = true;
    fallback.hidden = false;
  };

  if (!gl) {
    showFallback();
    return;
  }

  const vertex = `
    attribute vec2 a;
    void main() { gl_Position = vec4(a, 0.0, 1.0); }
  `;

  const fragment = `
    precision highp float;
    uniform vec2 uRes;
    uniform float uTime;
    uniform vec2 uPointer;

    mat2 rot(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }

    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }

    float sdTorus(vec3 p, vec2 t) {
      vec2 q = vec2(length(p.xz) - t.x, p.y);
      return length(q) - t.y;
    }

    float map(vec3 p) {
      vec3 q = p;
      q.xz = rot(uTime * 0.11) * q.xz;
      q.xy = rot(0.22 + uTime * 0.08) * q.xy;

      vec3 a = vec3(sin(uTime * 0.52) * 0.42, cos(uTime * 0.47) * 0.26, 0.0);
      vec3 b = vec3(cos(uTime * 0.38 + 1.4) * -0.4, sin(uTime * 0.61) * 0.33, 0.18);
      vec3 c = vec3(sin(uTime * 0.29 + 2.1) * 0.24, cos(uTime * 0.54 + 0.7) * -0.4, -0.16);

      float d = length(q - a) - 0.58;
      d = smin(d, length(q - b) - 0.48, 0.42);
      d = smin(d, length(q - c) - 0.4, 0.42);

      d += 0.018 * sin(q.x * 6.0 + uTime * 1.3) *
           sin(q.y * 5.0 - uTime * 0.9) *
           sin(q.z * 7.0 + uTime * 0.7);
      return d;
    }

    vec3 normalAt(vec3 p) {
      vec2 e = vec2(0.0015, 0.0);
      return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
      ));
    }

    float march(vec3 ro, vec3 rd) {
      float t = 0.0;
      for (int i = 0; i < 84; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
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
      rd.xz = rot(uPointer.x * 0.12) * rd.xz;
      rd.yz = rot(-uPointer.y * 0.08) * rd.yz;

      float t = march(ro, rd);
      vec3 color = vec3(0.0);
      float alpha = 0.0;

      if (t < 9.0) {
        vec3 p = ro + rd * t;
        vec3 n = normalAt(p);
        vec3 v = -rd;
        vec3 r = reflect(rd, n);
        float diff = max(dot(n, normalize(vec3(1.2, 1.8, 2.0))), 0.0);
        float fresnel = pow(1.0 - max(dot(n, v), 0.0), 3.0);

        color = environment(r) * (0.4 + 0.6 * diff);
        vec3 refracted = environment(refract(rd, n, 0.72));
        color = mix(color, refracted, 0.18);
        vec3 film = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + fresnel * 1.8 + dot(n, v)));
        color += film * fresnel * 0.28;
        color += vec3(1.0, 0.32, 0.10) * pow(max(dot(n, normalize(vec3(-1.0, 0.2, 0.7))), 0.0), 2.2) * 0.75;
        color += vec3(0.18, 0.32, 1.0) * fresnel * 0.55;
        color += vec3(1.0) * pow(max(dot(n, v), 0.0), 22.0) * 0.34;
        alpha = 1.0;
      }

      gl_FragColor = vec4(pow(max(color, 0.0), vec3(0.92)), alpha);
    }
  `;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vs = compile(gl.VERTEX_SHADER, vertex);
  const fs = compile(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) {
    showFallback();
    return;
  }

  const program = gl.createProgram();
  if (!program) {
    showFallback();
    return;
  }
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    showFallback();
    return;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  if (!buffer) {
    showFallback();
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const location = gl.getAttribLocation(program, 'a');
  if (location < 0) {
    showFallback();
    return;
  }
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);

  const res = gl.getUniformLocation(program, 'uRes');
  const time = gl.getUniformLocation(program, 'uTime');
  const pointer = gl.getUniformLocation(program, 'uPointer');
  if (!res || !time || !pointer) {
    showFallback();
    return;
  }

  let width = 1;
  let height = 1;
  let raf = 0;
  let visible = true;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let started = performance.now();

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.2 : 1.5);
    width = Math.max(1, Math.round(rect.width * dpr));
    height = Math.max(1, Math.round(rect.height * dpr));
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.uniform2f(res, width, height);
  };

  const draw = (now: number) => {
    raf = 0;
    if (!visible || document.hidden) return;
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;
    gl.uniform2f(pointer, currentX, currentY);
    gl.uniform1f(time, reduceMotion.matches ? 0.6 : (now - started) / 1000);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduceMotion.matches) raf = requestAnimationFrame(draw);
  };

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(draw);
  };

  const onPointer = (event: PointerEvent) => {
    if (reduceMotion.matches) return;
    targetX = (event.clientX / window.innerWidth) * 2 - 1;
    targetY = -((event.clientY / window.innerHeight) * 2 - 1);
  };

  resize();
  gl.uniform1f(time, 0.6);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  const observer = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (visible) schedule();
  });
  observer.observe(root);

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) schedule();
  });
  reduceMotion.addEventListener('change', schedule);
  schedule();
};

initHeroScene();
