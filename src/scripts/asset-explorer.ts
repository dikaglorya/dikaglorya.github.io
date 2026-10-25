import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-asset-explorer]'));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const materialSpecs: Record<string, { color: number; metalness: number; roughness: number; emissive?: number; wireframe?: boolean }> = {
  chrome: { color: 0xb9c3d2, metalness: 0.94, roughness: 0.16 },
  clay: { color: 0xc56c4c, metalness: 0.05, roughness: 0.78 },
  wireframe: { color: 0xff6a38, metalness: 0.2, roughness: 0.45, wireframe: true },
  holo: { color: 0x536cff, metalness: 0.72, roughness: 0.22, emissive: 0x142061 },
};

type MeshRecord = { mesh: THREE.Mesh; position: THREE.Vector3; direction: THREE.Vector3 };

const initExplorer = (root: HTMLElement) => {
  if (root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';
  const canvasHost = root.querySelector<HTMLElement>('[data-explorer-canvas]');
  const loading = root.querySelector<HTMLElement>('[data-explorer-loading]');
  const error = root.querySelector<HTMLElement>('[data-explorer-error]');
  const polys = root.querySelector<HTMLElement>('[data-explorer-polys]');
  const modeLabel = root.querySelector<HTMLElement>('[data-explorer-mode]');
  const drawLabel = root.querySelector<HTMLElement>('[data-explorer-draws]');
  const fpsLabel = root.querySelector<HTMLElement>('[data-explorer-fps]');
  if (!canvasHost) return;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: window.devicePixelRatio < 2, powerPreference: 'high-performance' });
  } catch {
    if (loading) loading.hidden = true;
    if (error) error.hidden = false;
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(canvasHost.clientWidth, canvasHost.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;outline:none';
  canvasHost.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, canvasHost.clientWidth / Math.max(1, canvasHost.clientHeight), 0.1, 100);
  camera.position.set(0, 0.2, 4.6);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 2.6;
  controls.maxDistance = 7;
  controls.autoRotate = !reduceMotion.matches;
  controls.autoRotateSpeed = 0.55;
  controls.target.set(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xb8c9ff, 0x160d12, 1.4));
  const key = new THREE.DirectionalLight(0xffe6d5, 3.2);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0xff5a1f, 45, 10);
  rim.position.set(-3, 1, -2);
  scene.add(rim);
  const blue = new THREE.PointLight(0x3b5bff, 35, 10);
  blue.position.set(3, -1, -2);
  scene.add(blue);
  const group = new THREE.Group();
  scene.add(group);
  const meshRecords: MeshRecord[] = [];
  const removeInteractions: Array<() => void> = [];
  let raf = 0;
  let visible = false;
  let disposed = false;
  let exploded = false;
  let activeMode = 'chrome';
  let environment: THREE.Texture | null = null;
  let frameCount = 0;
  let lastFpsUpdate = performance.now();

  const frame = () => {
    raf = 0;
    if (disposed || !visible || document.hidden) return;
    const moving = controls.update();
    renderer.render(scene, camera);
    frameCount += 1;
    const now = performance.now();
    if (now - lastFpsUpdate >= 500) {
      if (fpsLabel) fpsLabel.textContent = String(Math.round(frameCount * 1000 / (now - lastFpsUpdate)));
      if (drawLabel) drawLabel.textContent = String(renderer.info.render.calls);
      frameCount = 0;
      lastFpsUpdate = now;
    }
    if (controls.autoRotate || moving) raf = requestAnimationFrame(frame);
  };
  const schedule = () => {
    if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const onCanvasKeyDown = (event: KeyboardEvent) => {
    const step = 0.12;
    const offset = camera.position.clone().sub(controls.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    if (event.key === 'ArrowLeft') spherical.theta -= step;
    else if (event.key === 'ArrowRight') spherical.theta += step;
    else if (event.key === 'ArrowUp') spherical.phi -= step;
    else if (event.key === 'ArrowDown') spherical.phi += step;
    else if (event.key === '+' || event.key === '=' || event.key === 'PageUp') offset.setLength(Math.max(controls.minDistance, offset.length() * 0.88));
    else if (event.key === '-' || event.key === '_' || event.key === 'PageDown') offset.setLength(Math.min(controls.maxDistance, offset.length() * 1.12));
    else if (event.key === 'Home') {
      controls.reset();
      camera.position.set(0, 0.2, 4.6);
      controls.target.set(0, 0, 0);
      schedule();
      event.preventDefault();
      return;
    } else return;
    if (event.key.startsWith('Arrow')) {
      spherical.makeSafe();
      camera.position.setFromSpherical(spherical).add(controls.target);
    } else {
      offset.setLength(THREE.MathUtils.clamp(offset.length(), controls.minDistance, controls.maxDistance));
      camera.position.copy(controls.target).add(offset);
    }
    camera.lookAt(controls.target);
    controls.update();
    schedule();
    event.preventDefault();
  };
  canvasHost.addEventListener('keydown', onCanvasKeyDown);
  removeInteractions.push(() => canvasHost.removeEventListener('keydown', onCanvasKeyDown));
  const resize = () => {
    const width = Math.max(1, canvasHost.clientWidth);
    const height = Math.max(1, canvasHost.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    schedule();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvasHost);
  controls.addEventListener('change', schedule);

  const applyMaterial = (mode: string) => {
    const spec = materialSpecs[mode] ?? materialSpecs.chrome;
    activeMode = mode;
    if (modeLabel) modeLabel.textContent = mode.toUpperCase();
    meshRecords.forEach(({ mesh }) => {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        const standard = material as THREE.MeshStandardMaterial;
        if ('color' in standard && standard.color?.isColor) standard.color.setHex(spec.color);
        if ('metalness' in standard) standard.metalness = spec.metalness;
        if ('roughness' in standard) standard.roughness = spec.roughness;
        if ('wireframe' in standard) standard.wireframe = Boolean(spec.wireframe);
        if ('emissive' in standard && standard.emissive?.isColor) standard.emissive.setHex(spec.emissive ?? 0x000000);
        material.needsUpdate = true;
      });
    });
    root.querySelectorAll<HTMLButtonElement>('[data-explorer-material]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.explorerMaterial === mode));
    });
    schedule();
  };
  const bindClick = (button: HTMLButtonElement | null, handler: () => void) => {
    if (!button) return;
    button.addEventListener('click', handler);
    removeInteractions.push(() => button.removeEventListener('click', handler));
  };
  const toggleExplode = () => {
    exploded = !exploded;
    root.querySelector<HTMLButtonElement>('[data-explorer-explode]')?.setAttribute('aria-pressed', String(exploded));
    meshRecords.forEach(({ mesh, position, direction }) => {
      const target = exploded ? position.clone().addScaledVector(direction, 0.48) : position;
      mesh.position.copy(target);
    });
    schedule();
  };
  root.querySelectorAll<HTMLButtonElement>('[data-explorer-material]').forEach((button) => {
    bindClick(button, () => applyMaterial(button.dataset.explorerMaterial ?? 'chrome'));
  });
  bindClick(root.querySelector<HTMLButtonElement>('[data-explorer-explode]'), toggleExplode);
  const resetView = () => {
    controls.reset();
    camera.position.set(0, 0.2, 4.6);
    controls.target.set(0, 0, 0);
    exploded = false;
    root.querySelector<HTMLButtonElement>('[data-explorer-explode]')?.setAttribute('aria-pressed', 'false');
    meshRecords.forEach(({ mesh, position }) => mesh.position.copy(position));
    schedule();
  };
  bindClick(root.querySelector<HTMLButtonElement>('[data-explorer-reset]'), resetView);
  const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
    controls.autoRotate = !event.matches;
    schedule();
  };
  reduceMotion.addEventListener('change', onMotionPreferenceChange);

  const recordModel = (object: THREE.Object3D) => {
    let triangleCount = 0;
    object.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      node.castShadow = false;
      node.frustumCulled = true;
      const position = node.position.clone();
      meshRecords.push({ mesh: node, position, direction: position.lengthSq() > 0.0001 ? position.clone().normalize() : new THREE.Vector3(0, 1, 0) });
      triangleCount += (node.geometry.index?.count ?? node.geometry.getAttribute('position')?.count ?? 0) / 3;
    });
    if (polys) polys.textContent = Math.round(triangleCount).toLocaleString('id-ID');
    applyMaterial(activeMode);
  };
  const showReady = () => {
    if (loading) loading.hidden = true;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    schedule();
  };
  const fallback = () => {
    if (group.children.length) return;
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.23, 180, 24, 2, 3), new THREE.MeshStandardMaterial({ color: 0xabb6c8, metalness: 0.9, roughness: 0.2 }));
    group.add(knot);
    recordModel(group);
    if (polys) polys.textContent = 'PROCEDURAL';
    showReady();
  };
  const loader = new GLTFLoader();
  const envLoader = new RGBELoader();
  envLoader.load('/hdr/royal_esplanade_1k.hdr', (hdr) => {
    if (disposed) { hdr.dispose(); return; }
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromEquirectangular(hdr).texture;
    hdr.dispose();
    pmrem.dispose();
    if (disposed) { env.dispose(); return; }
    environment = env;
    scene.environment = env;
    schedule();
  }, undefined, () => {});
  loader.load('/models/explorer-model.glb', (gltf) => {
    if (disposed) {
      gltf.scene.traverse((node) => {
        if (!(node instanceof THREE.Mesh)) return;
        node.geometry.dispose();
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach((material) => {
          Object.values(material).forEach((value) => { if (value instanceof THREE.Texture) value.dispose(); });
          material.dispose();
        });
      });
      return;
    }
    const bounds = new THREE.Box3().setFromObject(gltf.scene);
    const size = bounds.getSize(new THREE.Vector3());
    const scale = 2.35 / Math.max(size.x, size.y, size.z, 0.001);
    gltf.scene.scale.setScalar(scale);
    const center = bounds.getCenter(new THREE.Vector3());
    gltf.scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    group.add(gltf.scene);
    recordModel(gltf.scene);
    showReady();
  }, undefined, fallback);

  const intersection = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (visible) schedule();
    else if (raf) cancelAnimationFrame(raf);
  }, { rootMargin: '180px' });
  intersection.observe(root);
  const onVisibility = () => document.hidden ? (raf && cancelAnimationFrame(raf), raf = 0) : schedule();
  document.addEventListener('visibilitychange', onVisibility);
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    intersection.disconnect();
    resizeObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    reduceMotion.removeEventListener('change', onMotionPreferenceChange);
    controls.removeEventListener('change', schedule);
    removeInteractions.forEach((remove) => remove());
    controls.dispose();
    scene.environment = null;
    environment?.dispose();
    environment = null;
    const releasedTextures = new Set<THREE.Texture>();
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          Object.values(material).forEach((value) => {
            if (value instanceof THREE.Texture && !releasedTextures.has(value)) {
              value.dispose();
              releasedTextures.add(value);
            }
          });
          material.dispose();
        });
      }
    });
    renderer.dispose();
    renderer.domElement.remove();
    window.removeEventListener('pagehide', dispose);
    window.removeEventListener('astro:before-swap', dispose);
  };
  window.addEventListener('pagehide', dispose, { once: true });
  window.addEventListener('astro:before-swap', dispose, { once: true });
};

const observeRoot = (root: HTMLElement) => {
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    initExplorer(root);
  }, { rootMargin: '160px' });
  observer.observe(root);
};
roots.forEach(observeRoot);
