import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

type Tier = 'low' | 'balanced' | 'high';
type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

type QualityProfile = {
  tier: Tier;
  pixelRatio: number;
  frameDelay: number;
  antialias: boolean;
  staticOnly: boolean;
};

const qualityProfile = (): QualityProfile => {
  const nav = navigator as NavigatorWithHints;
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory || 4;
  const saveData = nav.connection?.saveData === true;
  const veryLow = saveData || memory <= 2 || (window.innerWidth <= 360 && cores <= 2);
  if (veryLow) return { tier: 'low', pixelRatio: 1, frameDelay: 55, antialias: false, staticOnly: true };
  if (window.innerWidth <= 760 || memory <= 4 || cores <= 4) {
    return { tier: 'low', pixelRatio: 1, frameDelay: 48, antialias: false, staticOnly: false };
  }
  if (window.innerWidth < 1200 || memory <= 8 || cores <= 6) {
    return { tier: 'balanced', pixelRatio: 1.25, frameDelay: 34, antialias: false, staticOnly: false };
  }
  return { tier: 'high', pixelRatio: 1.55, frameDelay: 21, antialias: true, staticOnly: false };
};

const disposeTree = (object: THREE.Object3D) => {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => material.dispose());
  });
};

const fitModel = (model: THREE.Object3D, targetHeight: number) => {
  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const scale = targetHeight / Math.max(size.y, size.x, size.z, 0.001);
  model.scale.setScalar(scale);
  model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  model.updateMatrixWorld(true);
  return { frontZ: (size.z * scale) / 2, height: size.y * scale };
};

const setBaseMaterial = (root: THREE.Object3D, color: number, flatShading: boolean) => {
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.02, flatShading });
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const previous = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    previous.forEach((entry) => entry.dispose());
    mesh.material = material.clone();
    mesh.castShadow = false;
    mesh.receiveShadow = false;
  });
  material.dispose();
};

const ellipsoid = (
  parent: THREE.Object3D,
  position: [number, number, number],
  scale: [number, number, number],
  color: number,
  segments: number,
  roughness = 0.68,
) => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, segments, Math.max(8, Math.round(segments * 0.7))),
    new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.01 }),
  );
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  parent.add(mesh);
  return mesh;
};

const buildPenguinDetails = (group: THREE.Group, frontZ: number, segments: number) => {
  const white = 0xf5f4ec;
  const orange = 0xff9b42;
  const black = 0x121822;
  const patchZ = frontZ * 0.91;
  ellipsoid(group, [0, -0.18, patchZ], [0.39, 0.59, 0.105], white, segments);
  ellipsoid(group, [0, 0.49, patchZ + 0.006], [0.32, 0.235, 0.105], white, segments);
  for (const side of [-1, 1]) {
    ellipsoid(group, [side * 0.135, 0.50, frontZ + 0.12], [0.052, 0.066, 0.045], black, segments, 0.26);
    ellipsoid(group, [side * 0.147, 0.526, frontZ + 0.158], [0.014, 0.018, 0.012], 0xffffff, segments, 0.2);
    ellipsoid(group, [side * 0.22, -0.99, frontZ * 0.57], [0.19, 0.075, 0.235], orange, segments);
    const flipper = ellipsoid(group, [side * 0.48, -0.24, 0.02], [0.105, 0.36, 0.135], 0x182230, segments);
    flipper.rotation.z = -side * 0.2;
  }
  const beak = new THREE.Mesh(
    new THREE.ConeGeometry(0.105, 0.17, Math.max(6, Math.round(segments * 0.55))),
    new THREE.MeshStandardMaterial({ color: orange, roughness: 0.55 }),
  );
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 0.34, frontZ + 0.13);
  group.add(beak);
};

const buildDolphinDetails = (group: THREE.Group, frontZ: number, segments: number) => {
  ellipsoid(group, [-0.39, 0.18, frontZ + 0.075], [0.048, 0.055, 0.035], 0x112232, segments, 0.25);
  ellipsoid(group, [-0.402, 0.202, frontZ + 0.102], [0.012, 0.014, 0.009], 0xffffff, segments, 0.2);
};

export const initHeroScene = (root: HTMLElement) => {
  if (root.dataset.sceneInitialized === 'true') return;
  root.dataset.sceneInitialized = 'true';
  const canvas = root.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  const fallback = root.querySelector<HTMLElement>('[data-hero-fallback]');
  if (!canvas || !fallback) return;

  const profile = qualityProfile();
  root.dataset.renderTier = profile.tier;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const showFallback = () => {
    canvas.hidden = true;
    fallback.hidden = false;
    root.setAttribute('data-scene-ready', 'true');
  };
  if (profile.staticOnly) { showFallback(); return; }

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: profile.antialias,
      powerPreference: profile.tier === 'high' ? 'high-performance' : 'low-power',
      stencil: false,
      depth: true,
      preserveDrawingBuffer: false,
    });
  } catch {
    showFallback();
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, profile.pixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const mobile = window.matchMedia('(max-width: 760px)').matches;
  const penguinBaseY = mobile ? 0.12 : 0.22;
  const camera = new THREE.PerspectiveCamera(mobile ? 38 : 34, 1, 0.1, 80);
  const focusX = mobile ? 0.42 : 0.65;
  camera.position.set(focusX, 0.04, mobile ? 7.2 : 6.7);
  camera.lookAt(focusX, 0.02, 0);
  scene.add(new THREE.HemisphereLight(0xccecff, 0x152033, 1.8));
  const key = new THREE.DirectionalLight(0xffefe0, 2.4);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const blueRim = new THREE.PointLight(0x48a9ff, 15, 12);
  blueRim.position.set(3, 1.8, -2.5);
  scene.add(blueRim);
  const warmFill = new THREE.PointLight(0xff8e4d, 8, 10);
  warmFill.position.set(-3, -1, 3);
  scene.add(warmFill);

  const stage = new THREE.Group();
  stage.position.x = mobile ? 0.1 : 0.92;
  scene.add(stage);
  const penguin = new THREE.Group();
  const dolphin = new THREE.Group();
  stage.add(penguin, dolphin);
  const detailSegments = profile.tier === 'low' ? 12 : 18;
  let visible = false;
  let destroyed = false;
  let loaded = false;
  let raf = 0;
  let timer = 0;
  let targetX = 0;
  let targetY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let resizeObserver: ResizeObserver | undefined;

  const resize = () => {
    if (destroyed) return;
    const rect = root.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, profile.pixelRatio));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (visible && loaded) draw(performance.now());
  };

  const draw = (now: number) => {
    raf = 0;
    if (destroyed || !visible || document.hidden || !loaded) return;
    if (reduceMotion.matches) {
      stage.rotation.set(0, 0, 0);
      penguin.position.y = penguinBaseY;
      penguin.rotation.set(0, 0, 0);
      dolphin.position.y = mobile ? 0.48 : 0.62;
      dolphin.rotation.set(0, 0, -0.08);
      renderer.render(scene, camera);
      return;
    }
    const elapsed = now / 1000;
    const blend = profile.tier === 'low' ? 0.055 : 0.075;
    pointerX += (targetX - pointerX) * blend;
    pointerY += (targetY - pointerY) * blend;
    stage.rotation.y = Math.sin(elapsed * 0.35) * 0.045 + pointerX * 0.1;
    stage.rotation.x = pointerY * 0.045;
    penguin.position.y = penguinBaseY + Math.sin(elapsed * 1.05) * 0.035;
    penguin.rotation.z = Math.sin(elapsed * 0.55) * 0.018;
    dolphin.position.y = 0.52 + Math.sin(elapsed * 1.3 + 0.6) * 0.075;
    dolphin.rotation.z = -0.08 + Math.sin(elapsed * 0.8) * 0.035;
    dolphin.rotation.y = Math.sin(elapsed * 0.45) * 0.07;
    renderer.render(scene, camera);
    timer = window.setTimeout(() => {
      timer = 0;
      schedule();
    }, profile.frameDelay);
  };

  const schedule = () => {
    if (!raf && !timer && !destroyed && visible && !document.hidden && loaded && !reduceMotion.matches) {
      raf = window.requestAnimationFrame(draw);
    }
  };
  const cancelRender = () => {
    if (raf) window.cancelAnimationFrame(raf);
    if (timer) window.clearTimeout(timer);
    raf = 0;
    timer = 0;
  };
  const renderStatic = () => {
    if (destroyed || !visible || document.hidden || !loaded) return;
    cancelRender();
    stage.rotation.set(0, 0, 0);
    penguin.position.y = penguinBaseY;
    penguin.rotation.set(0, 0, 0);
    dolphin.position.y = mobile ? 0.48 : 0.62;
    dolphin.rotation.set(0, 0, -0.08);
    renderer.render(scene, camera);
  };
  const onMotionChange = () => {
    cancelRender();
    if (reduceMotion.matches) renderStatic();
    else schedule();
  };
  const onPointer = (event: PointerEvent) => {
    if (reduceMotion.matches || profile.tier === 'low') return;
    const rect = root.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
    targetY = -((event.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
  };
  const onVisibility = () => {
    if (document.hidden) cancelRender();
    else if (reduceMotion.matches) renderStatic();
    else schedule();
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    showFallback();
    cleanup();
  };
  const observer = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (!visible) { cancelRender(); return; }
    if (loaded && reduceMotion.matches) renderStatic();
    else schedule();
  }, { threshold: 0.05 });

  const cleanup = () => {
    if (destroyed) return;
    destroyed = true;
    cancelRender();
    observer.disconnect();
    resizeObserver?.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('astro:before-swap', cleanup);
    window.removeEventListener('pagehide', cleanup);
    reduceMotion.removeEventListener('change', onMotionChange);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    disposeTree(stage);
    renderer.dispose();
    root.removeAttribute('data-scene-ready');
  };

  resize();
  observer.observe(root);
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
  }
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  document.addEventListener('astro:before-swap', cleanup);
  window.addEventListener('pagehide', cleanup);
  reduceMotion.addEventListener('change', onMotionChange);
  canvas.addEventListener('webglcontextlost', onContextLost, { once: true });

  const loader = new GLTFLoader();
  const assetUrl = (name: string) => new URL(`/models/${name}`, window.location.origin).toString();
  Promise.all([
    loader.loadAsync(assetUrl('hero-penguin.glb')),
    loader.loadAsync(assetUrl('hero-dolphin.glb')),
  ]).then(([penguinGltf, dolphinGltf]) => {
    if (destroyed) {
      disposeTree(penguinGltf.scene);
      disposeTree(dolphinGltf.scene);
      return;
    }
    const penguinModel = penguinGltf.scene;
    const penguinBounds = fitModel(penguinModel, mobile ? 1.55 : 1.75);
    setBaseMaterial(penguinModel, 0x17202b, profile.tier === 'low');
    penguin.add(penguinModel);
    buildPenguinDetails(penguin, penguinBounds.frontZ, detailSegments);
    penguin.position.set(mobile ? 0.12 : 0.35, penguinBaseY, 0);

    const dolphinModel = dolphinGltf.scene;
    const dolphinBounds = fitModel(dolphinModel, mobile ? 0.86 : 0.98);
    setBaseMaterial(dolphinModel, 0x2c9dd2, profile.tier === 'low');
    dolphin.add(dolphinModel);
    buildDolphinDetails(dolphin, dolphinBounds.frontZ, detailSegments);
    dolphin.position.set(mobile ? 1.12 : 1.45, mobile ? 0.48 : 0.62, 0.18);
    dolphin.rotation.z = -0.08;

    loaded = true;
    canvas.hidden = false;
    fallback.hidden = true;
    root.setAttribute('data-scene-ready', 'true');
    if (visible && reduceMotion.matches) renderStatic();
    else schedule();
  }).catch(() => {
    if (!destroyed) showFallback();
  });

  // Keep a single draw on first visibility even when motion is reduced.
  const initialStaticFrame = () => {
    if (visible && loaded && reduceMotion.matches) renderStatic();
  };
  window.setTimeout(initialStaticFrame, 0);
};
