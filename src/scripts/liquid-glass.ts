export {};

type GlassProfile = 'auto' | 'high' | 'balanced' | 'eco' | 'fallback';
type Quality = Exclude<GlassProfile, 'auto'>;

const surfaceSelector = [
  '.site-header', '.hero__scene', '.hero__portrait', '.identity-strip', '.featured',
  '.featured__diagram', '.project-row', '.finder-sidebar', '.finder-toolbar', '.finder-search',
  '.finder-main', '.filter-btn', '.finder-view button', '.journal-card', '.journal-article',
  '.journal-toc', '.journal-next', '.journal-progress', '.capability',
  '.stack-group', '.profile-portrait', '.identity-list > div', '.about-facts > div',
  '.principle', '.focus-list li', '.service-row', '.process-steps > li', '.faq-item',
  '.contact-form-wrap', '.contact-aside', '.form-field input', '.form-field select',
  '.form-field textarea', '.brief-ready', '.project-figure', '.project-aside', '.project-note',
  '.spec__row', '.next-project', '.page-hero > .container', '.project-hero > .container',
  '.not-found__grid', '.project-list__head', '.projects-note', '.empty-state', '.quick-look',
  '.spotlight', '.spotlight__search', '.spotlight__results a', '.mobile-menu', '.os-window', '.contact-block',
  '.channel-list li', '.footer__brand',
].join(',');

const profileFromPreference = (): GlassProfile => {
  const requested = new URLSearchParams(window.location.search).get('glass');
  const allowed: GlassProfile[] = ['auto', 'high', 'balanced', 'eco', 'fallback'];
  if (requested && allowed.includes(requested as GlassProfile)) return requested as GlassProfile;
  try {
    const saved = window.localStorage.getItem('obitoglory-glass-quality');
    if (saved && allowed.includes(saved as GlassProfile)) return saved as GlassProfile;
  } catch { /* Private browsing may disable localStorage; automatic mode still works. */ }
  return 'auto';
};

const getConnection = () => (navigator as Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
}).connection;

const getQuality = (profile: GlassProfile): Quality => {
  const reducedTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
  if (profile === 'fallback' || reducedTransparency) return 'fallback';
  if (profile !== 'auto') return profile;

  const connection = getConnection();
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
  const mobile = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
  const lowPowerNetwork = connection?.saveData || connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (lowPowerNetwork || reducedMotion || mobile || cores <= 4 || memory <= 4) return 'eco';
  if (cores >= 8 && memory >= 8 && window.devicePixelRatio <= 2) return 'high';
  return 'balanced';
};

const applyProfile = (profile: GlassProfile, forcedQuality?: Quality) => {
  const quality = forcedQuality ?? getQuality(profile);
  document.documentElement.dataset.glassQuality = quality;
  document.documentElement.dataset.glassProfile = profile;
  return quality;
};

const markGlassSurfaces = () => {
  document.querySelectorAll<HTMLElement>(surfaceSelector).forEach((element) => {
    element.classList.add('liquid-glass');
    if (element.matches('.hero__scene') && CSS.supports('backdrop-filter', 'blur(4px) url("#liquid-lens")')) {
      element.classList.add('liquid-glass--lens');
    }
    if (element.matches('.hero__scene, .site-header, .featured, .contact-form-wrap, .contact-aside, .project-aside, .journal-article, .page-hero > .container, .project-hero > .container, .not-found__grid, .mobile-menu, .spotlight, .quick-look, .contact-block')) {
      element.dataset.glassHover = 'true';
    }
    if (element.matches('.hero__scene, .project-row, .journal-card, .capability, .stack-group, .service-row, .featured, .project-figure, .project-aside')) {
      element.dataset.glassTilt = 'true';
      element.dataset.glassHover = 'true';
    }
  });
};

const installGlassControl = () => {
  const api = {
    setProfile(profile: GlassProfile) {
      const allowed: GlassProfile[] = ['auto', 'high', 'balanced', 'eco', 'fallback'];
      if (!allowed.includes(profile)) return;
      try { localStorage.setItem('obitoglory-glass-quality', profile); } catch { /* no-op */ }
      currentProfile = profile;
      const nextQuality = applyProfile(profile);
      mountShader(nextQuality);
    },
    getProfile: () => currentProfile,
    getQuality: () => document.documentElement.dataset.glassQuality ?? 'eco',
  };
  Object.defineProperty(window, 'obitoGlass', { configurable: true, value: api });
};

declare global {
  interface Window {
    obitoGlass?: {
      setProfile: (profile: GlassProfile) => void;
      getProfile: () => GlassProfile;
      getQuality: () => string;
    };
  }
}

let currentProfile = profileFromPreference();
let animationFrame = 0;
let pendingPointer: { target: HTMLElement; x: number; y: number; rx: number; ry: number } | null = null;
let shaderCleanup: (() => void) | null = null;
let shaderHost: HTMLElement | null = null;

const onPointerMove = (event: PointerEvent) => {
  if (document.documentElement.dataset.glassQuality !== 'high' || event.pointerType !== 'mouse') return;
  const target = (event.target as Element | null)?.closest<HTMLElement>('.liquid-glass[data-glass-tilt="true"]');
  if (!target) return;
  const rect = target.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const nx = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
  const ny = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
  pendingPointer = { target, x: (nx + 1) * 50, y: (ny + 1) * 50, rx: -ny * 1.25, ry: nx * 1.25 };
  if (animationFrame) return;
  animationFrame = requestAnimationFrame(() => {
    animationFrame = 0;
    if (!pendingPointer) return;
    const { target: surface, x, y, rx, ry } = pendingPointer;
    surface.style.setProperty('--glass-x', `${x}%`);
    surface.style.setProperty('--glass-y', `${y}%`);
    surface.style.setProperty('--glass-tilt-x', `${rx}deg`);
    surface.style.setProperty('--glass-tilt-y', `${ry}deg`);
  });
};

const resetTilt = (event: PointerEvent) => {
  const target = (event.target as Element | null)?.closest<HTMLElement>('.liquid-glass[data-glass-tilt="true"]');
  if (!target) return;
  target.style.setProperty('--glass-tilt-x', '0deg');
  target.style.setProperty('--glass-tilt-y', '0deg');
};

const compileShader = (gl: WebGLRenderingContext, type: number, source: string) => {
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

const mountShader = async (quality: Quality) => {
  if (quality !== 'high' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(max-width: 900px), (pointer: coarse)').matches) {
    shaderCleanup?.();
    shaderCleanup = null;
    shaderHost = null;
    return;
  }

  const host = document.querySelector<HTMLElement>('[data-hero-scene]');
  if (!host || host === shaderHost || !('IntersectionObserver' in window)) return;
  const batteryNavigator = navigator as Navigator & {
    getBattery?: () => Promise<{ level: number; charging: boolean }>;
  };
  if (batteryNavigator.getBattery) {
    try {
      const battery = await batteryNavigator.getBattery();
      if (!battery.charging && battery.level <= 0.18) return;
    } catch { /* Battery API is optional and unavailable in most browsers. */ }
  }
  if (document.documentElement.dataset.glassQuality !== 'high') return;
  shaderCleanup?.();
  const canvas = document.createElement('canvas');
  canvas.className = 'liquid-glass-shader';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('role', 'presentation');
  host.prepend(canvas);

  let gl: WebGLRenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', premultipliedAlpha: false });
  } catch { gl = null; }
  if (!gl) { canvas.remove(); return; }

  const vertex = compileShader(gl, gl.VERTEX_SHADER, 'attribute vec2 a_position; varying vec2 v_uv; void main(){ v_uv=a_position*0.5+0.5; gl_Position=vec4(a_position,0.0,1.0); }');
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, `precision mediump float;
    varying vec2 v_uv; uniform float u_time; uniform vec2 u_pointer; uniform vec2 u_resolution;
    void main(){
      vec2 uv=v_uv; float t=u_time*0.00018;
      float pointer=exp(-distance(uv,u_pointer)*5.0);
      float wave=sin((uv.x*2.8+uv.y*1.65+t+pointer*0.24)*6.28318);
      float wave2=cos((uv.y*2.2-uv.x*1.15-t*0.7+pointer*0.18)*6.28318);
      float rim=1.0-smoothstep(0.10,0.82,min(min(uv.x,1.0-uv.x),min(uv.y,1.0-uv.y)));
      float caustic=smoothstep(0.35,0.98,0.5+0.25*wave+0.25*wave2);
      float glow=clamp(rim*(0.16+caustic*0.34)+pointer*0.08,0.0,0.32);
      vec3 color=vec3(1.0);
      float shade=0.5+0.5*sin(wave2+u_time*0.0001);
      gl_FragColor=vec4(color,glow*shade*0.3);
    }`);
  if (!vertex || !fragment) { canvas.remove(); return; }
  const program = gl.createProgram();
  if (!program) { canvas.remove(); return; }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { canvas.remove(); return; }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const timeLocation = gl.getUniformLocation(program, 'u_time');
  const pointerLocation = gl.getUniformLocation(program, 'u_pointer');
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  let raf = 0;
  let visible = false;
  let pointer = [0.5, 0.5];
  let lastFrame = 0;
  let sampleStart = 0;
  let sampleFrames = 0;
  let observer: IntersectionObserver;
  let resizeObserver: ResizeObserver;
  const resize = () => {
    const bounds = host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const width = Math.max(1, Math.floor(bounds.width * dpr));
    const height = Math.max(1, Math.floor(bounds.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl?.viewport(0, 0, width, height);
      gl?.uniform2f(resolutionLocation, width, height);
    }
  };
  const draw = (now: number) => {
    raf = 0;
    if (!visible || document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!sampleStart) sampleStart = now;
    sampleFrames += 1;
    if (now - sampleStart > 3200) {
      const fps = sampleFrames * 1000 / (now - sampleStart);
      if (fps < 43) {
        applyProfile(currentProfile, 'balanced');
        cleanup();
        return;
      }
      sampleStart = now;
      sampleFrames = 0;
    }
    if (now - lastFrame < 27) { raf = requestAnimationFrame(draw); return; }
    lastFrame = now;
    gl?.clear(gl.COLOR_BUFFER_BIT);
    gl?.uniform1f(timeLocation, now);
    gl?.uniform2f(pointerLocation, pointer[0], pointer[1]);
    gl?.drawArrays(gl.TRIANGLES, 0, 6);
    raf = requestAnimationFrame(draw);
  };
  const start = () => { if (visible && !document.hidden && !raf) raf = requestAnimationFrame(draw); };
  const onPointer = (event: PointerEvent) => {
    const bounds = host.getBoundingClientRect();
    pointer = [(event.clientX - bounds.left) / Math.max(1, bounds.width), 1 - (event.clientY - bounds.top) / Math.max(1, bounds.height)];
  };
  const onVisibility = () => document.hidden ? cancelAnimationFrame(raf) : start();
  const onMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? cancelAnimationFrame(raf) : start();
  const cleanup = () => {
    observer?.disconnect();
    resizeObserver?.disconnect();
    window.removeEventListener('resize', resize);
    host.removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', onVisibility);
    window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change', onMotion);
    cancelAnimationFrame(raf);
    const lose = gl?.getExtension('WEBGL_lose_context');
    lose?.loseContext();
    canvas.remove();
    if (shaderHost === host) shaderHost = null;
  };
  shaderCleanup = cleanup;

  observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start(); else cancelAnimationFrame(raf);
  }, { rootMargin: '100px' });
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  observer.observe(host);
  host.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', onMotion);
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('astro:before-swap', cleanup, { once: true });
  shaderHost = host;
  resize();
};

const boot = () => {
  markGlassSurfaces();
  const quality = applyProfile(currentProfile);
  installGlassControl();
  document.removeEventListener('pointermove', onPointerMove);
  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.removeEventListener('pointerout', resetTilt);
  document.addEventListener('pointerout', resetTilt, { passive: true });
  void mountShader(quality);
};

boot();
document.addEventListener('astro:page-load', boot);
const refreshForAccessibilityPreference = () => {
  const quality = applyProfile(currentProfile);
  void mountShader(quality);
};
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', refreshForAccessibilityPreference);
window.matchMedia('(prefers-reduced-transparency: reduce)').addEventListener('change', refreshForAccessibilityPreference);
