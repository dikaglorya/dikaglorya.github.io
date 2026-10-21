import type * as Three from 'three';

const mountScene = async () => {
  const root = document.querySelector<HTMLElement>('[data-hero-scene]');
  const canvas = root?.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  if (!root || !canvas || root.dataset.initialized === 'true') return;

  const desktopFinePointer = window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
  );
  if (!desktopFinePointer.matches || reducedMotion.matches || saveData) return;

  root.dataset.initialized = 'true';

  const THREE = await import('three');
  if (!root.isConnected) return;

  let renderer: Three.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
  } catch {
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  camera.position.set(0, 0, 7.5);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const sculpture = new THREE.Group();
  scene.add(sculpture);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.03, 5),
    new THREE.MeshPhysicalMaterial({
      color: 0x8b8b90,
      metalness: 0.72,
      roughness: 0.24,
      clearcoat: 0.8,
      clearcoatRoughness: 0.16,
      emissive: 0x202024,
      emissiveIntensity: 0.22,
    }),
  );
  sculpture.add(core);

  const wireframe = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.08, 2),
    new THREE.MeshBasicMaterial({ color: 0xe8e8ed, wireframe: true, transparent: true, opacity: 0.2 }),
  );
  sculpture.add(wireframe);

  const ringMaterials = [
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.62 }),
    new THREE.MeshBasicMaterial({ color: 0xbfc0c6, transparent: true, opacity: 0.54 }),
    new THREE.MeshBasicMaterial({ color: 0xe8e8ed, transparent: true, opacity: 0.3 }),
  ];
  const rings = ringMaterials.map((material, index) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.48 + index * 0.16, 0.008, 8, 160), material);
    ring.rotation.set(0.6 + index * 0.55, 0.2 + index * 0.72, index * 0.28);
    sculpture.add(ring);
    return ring;
  });

  const starPositions = new Float32Array(360 * 3);
  for (let index = 0; index < starPositions.length; index += 3) {
    starPositions[index] = (Math.random() - 0.5) * 8;
    starPositions[index + 1] = (Math.random() - 0.5) * 5;
    starPositions[index + 2] = (Math.random() - 0.5) * 3 - 1;
  }
  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starsGeometry,
    new THREE.PointsMaterial({ color: 0xe8e8ed, size: 0.012, transparent: true, opacity: 0.58 }),
  );
  scene.add(stars);

  scene.add(new THREE.AmbientLight(0xffffff, 1.35));
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
  keyLight.position.set(-3, 4, 5);
  scene.add(keyLight);
  const warmLight = new THREE.PointLight(0xd8d8de, 28, 12);
  warmLight.position.set(2, -1, 3);
  scene.add(warmLight);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let visible = false;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;

  const resize = () => {
    const bounds = root.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    renderer.setSize(bounds.width, bounds.height, false);
    camera.aspect = bounds.width / bounds.height;
    camera.position.x = 0;
    camera.updateProjectionMatrix();
    sculpture.scale.setScalar(bounds.width < 700 ? 1.08 : 1.42);
    renderer.render(scene, camera);
  };

  const animate = () => {
    if (!visible || document.hidden) return;
    pointerX += (targetX - pointerX) * 0.025;
    pointerY += (targetY - pointerY) * 0.025;
    sculpture.rotation.y += 0.0032;
    sculpture.rotation.x = pointerY * 0.08;
    sculpture.rotation.y += pointerX * 0.001;
    wireframe.rotation.y -= 0.003;
    rings.forEach((ring, index) => {
      ring.rotation.z += (index % 2 ? -1 : 1) * 0.0012;
    });
    stars.rotation.y += 0.00012;
    renderer.render(scene, camera);
    frame = window.requestAnimationFrame(animate);
  };

  const start = () => {
    if (!visible || document.hidden) return;
    if (reduceMotion.matches) {
      renderer.render(scene, camera);
      return;
    }
    if (!frame) frame = window.requestAnimationFrame(animate);
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
  });

  const onPointerMove = (event: PointerEvent) => {
    if (!finePointer.matches || reduceMotion.matches) return;
    const bounds = root.getBoundingClientRect();
    targetX = (event.clientX - bounds.left - bounds.width / 2) / bounds.width;
    targetY = (event.clientY - bounds.top - bounds.height / 2) / bounds.height;
  };

  const onMotionChange = () => {
    if (reduceMotion.matches) {
      window.cancelAnimationFrame(frame);
      frame = 0;
      renderer.render(scene, camera);
    } else start();
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    } else start();
  };

  const cleanup = () => {
    observer.disconnect();
    resizeObserver.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    reduceMotion.removeEventListener('change', onMotionChange);
    window.cancelAnimationFrame(frame);
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
    renderer.dispose();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(root);
  observer.observe(root);
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
  reduceMotion.addEventListener('change', onMotionChange);
  document.addEventListener('astro:before-swap', cleanup, { once: true });
  root.dataset.sceneReady = 'true';
  resize();
};

mountScene();
document.addEventListener('astro:page-load', mountScene);
