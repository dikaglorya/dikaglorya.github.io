// ObitoGlory OS window behavior: focus, collapse, minimize-to-dock chips,
// fullscreen, and pointer dragging with a light release inertia.
// Everything is progressive: on touch or reduced motion only the lights work.

export {};

const SHELL_CLEARANCE = 46; // menu bar (30px) + a little air
const DOCK_CLEARANCE = 96; // dock height + air

const bringToFront = (element: HTMLElement, counter: { z: number }) => {
  counter.z = Math.min(counter.z + 2, 288);
  element.style.zIndex = String(counter.z);
  document.querySelectorAll<HTMLElement>('.os-window.is-focused').forEach((focused) => {
    if (focused !== element) focused.classList.remove('is-focused');
  });
  element.classList.add('is-focused');
};

const startInertia = (
  element: HTMLElement,
  velocity: { x: number; y: number },
) => {
  let frame = 0;
  let decay = 0.9;
  const step = () => {
    velocity.x *= decay;
    velocity.y *= decay;
    if (Math.abs(velocity.x) < 0.08 && Math.abs(velocity.y) < 0.08) {
      frame = 0;
      return;
    }
    const nextX = element.offsetLeft + velocity.x;
    const nextY = element.offsetTop + velocity.y;
    const maxX = window.innerWidth - element.offsetWidth - 8;
    const maxY = window.innerHeight - element.offsetHeight - DOCK_CLEARANCE;
    element.style.left = `${Math.max(8, Math.min(maxX, nextX))}px`;
    element.style.top = `${Math.max(SHELL_CLEARANCE, Math.min(maxY, nextY))}px`;
    decay *= 0.94;
    frame = window.requestAnimationFrame(step);
  };
  frame = window.requestAnimationFrame(step);
  return () => window.cancelAnimationFrame(frame);
};

const attachWindow = (element: HTMLElement, counter: { z: number }) => {
  if (element.dataset.windowReady === 'true') return;
  element.dataset.windowReady = 'true';

  const bar = element.querySelector<HTMLElement>('[data-window-bar]');
  if (!bar) return;

  const collapseButton = element.querySelector<HTMLButtonElement>('[data-window-collapse]');
  const uncollapseButton = element.querySelector<HTMLButtonElement>('[data-window-uncollapse]');
  const minimizeButton = element.querySelector<HTMLButtonElement>('[data-window-minimize]');
  const fullscreenButton = element.querySelector<HTMLButtonElement>('[data-window-fullscreen]');

  const canFloat = () =>
    Boolean(finePointer.matches && !reduceMotion.matches && window.innerWidth >= 900);

  const restoreFloated = () => {
    element.style.position = '';
    element.style.left = '';
    element.style.top = '';
    element.style.width = '';
    element.classList.remove('is-floating', 'is-dragging');
  };

  collapseButton?.addEventListener('click', () => {
    const collapsed = element.classList.toggle('is-collapsed');
    collapseButton.setAttribute('aria-expanded', String(!collapsed));
    (collapsed ? uncollapseButton : collapseButton)?.focus();
  });

  uncollapseButton?.addEventListener('click', () => {
    element.classList.remove('is-collapsed');
    collapseButton?.setAttribute('aria-expanded', 'true');
    collapseButton?.focus();
  });

  fullscreenButton?.addEventListener('click', () => {
    const expanded = element.classList.toggle('is-fullscreen');
    fullscreenButton.setAttribute('aria-expanded', String(expanded));
    bringToFront(element, counter);
  });

  /** Yellow: shrink into a dock chip; the chip leads back to the window. */
  minimizeButton?.addEventListener('click', () => {
    if (!canFloat()) return;
    element.classList.add('is-minimizing');
    window.setTimeout(() => {
      element.classList.remove('is-minimizing');
      element.classList.add('is-minimized');
      addRestoreChip(element, counter);
    }, 240);
  });

  bar.addEventListener('pointerdown', () => bringToFront(element, counter));

  if (element.dataset.draggable === undefined) return;

  bar.addEventListener('pointerdown', (event) => {
    if (!canFloat()) return;
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest('button')) return;

    event.preventDefault();
    bar.setPointerCapture(event.pointerId);
    bringToFront(element, counter);

    if (!element.classList.contains('is-floating')) {
      const rect = element.getBoundingClientRect();
      element.classList.add('is-floating');
      element.style.left = `${rect.left}px`;
      element.style.top = `${rect.top}px`;
      element.style.width = `${rect.width}px`;
    }
    element.classList.add('is-dragging');

    const startX = event.clientX;
    const startY = event.clientY;
    const originLeft = element.offsetLeft;
    const originTop = element.offsetTop;
    const velocity = { x: 0, y: 0 };
    let lastX = event.clientX;
    let lastY = event.clientY;
    let lastTime = event.timeStamp;

    const onMove = (move: PointerEvent) => {
      const nextX = originLeft + (move.clientX - startX);
      const nextY = originTop + (move.clientY - startY);
      const maxX = window.innerWidth - element.offsetWidth - 8;
      const maxY = window.innerHeight - element.offsetHeight - DOCK_CLEARANCE;
      const clampedX = Math.max(8, Math.min(maxX, nextX));
      const clampedY = Math.max(SHELL_CLEARANCE, Math.min(maxY, nextY));
      element.style.left = `${clampedX}px`;
      element.style.top = `${clampedY}px`;
      const dt = move.timeStamp - lastTime;
      if (dt > 0) {
        velocity.x = ((move.clientX - lastX) / dt) * 14;
        velocity.y = ((move.clientY - lastY) / dt) * 14;
      }
      lastX = move.clientX;
      lastY = move.clientY;
      lastTime = move.timeStamp;
    };

    const onUp = () => {
      bar.removeEventListener('pointermove', onMove);
      bar.removeEventListener('pointerup', onUp);
      bar.removeEventListener('pointercancel', onUp);
      element.classList.remove('is-dragging', 'is-minimizing');
      startInertia(element, velocity);
    };

    bar.addEventListener('pointermove', onMove);
    bar.addEventListener('pointerup', onUp);
    bar.addEventListener('pointercancel', onUp);
  });

  const onResize = () => {
    window.clearTimeout(element.dataset.resizeTimer ? Number(element.dataset.resizeTimer) : 0);
    const timer = window.setTimeout(() => {
      if (!canFloat() && element.classList.contains('is-floating')) {
        restoreFloated();
      }
    }, 180);
    element.dataset.resizeTimer = String(timer);
  };
  window.addEventListener('resize', onResize, { passive: true });

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    if (element.classList.contains('is-fullscreen')) {
      element.classList.remove('is-fullscreen');
      fullscreenButton?.setAttribute('aria-expanded', 'false');
    }
  };
  element.addEventListener('keydown', onKeydown);

  return () => {
    window.removeEventListener('resize', onResize);
    element.removeEventListener('keydown', onKeydown);
  };
};

const addRestoreChip = (element: HTMLElement, counter: { z: number }) => {
  const dock = document.querySelector<HTMLElement>('[data-dock-restore]');
  if (!dock) return;
  const title = element.querySelector<HTMLElement>('[data-window-bar] b')?.textContent?.trim();
  if (!title) return;
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.textContent = title;
  chip.addEventListener('click', () => {
    element.classList.remove('is-minimized');
    bringToFront(element, counter);
    element.classList.add('pop');
    window.setTimeout(() => element.classList.remove('pop'), 320);
    chip.remove();
  });
  dock.appendChild(chip);
};

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const counter = { z: 262 };

const resetLayout = () => {
  document.querySelectorAll<HTMLElement>('.os-window.is-floating').forEach((element) => {
    element.style.position = '';
    element.style.left = '';
    element.style.top = '';
    element.style.width = '';
    element.classList.remove('is-floating', 'is-dragging');
  });
  document.querySelectorAll<HTMLElement>('.os-window.is-minimized').forEach((element) => {
    element.classList.remove('is-minimized');
  });
  const dock = document.querySelector<HTMLElement>('[data-dock-restore]');
  if (dock) dock.replaceChildren();
};

const layoutResetButton = document.querySelector<HTMLButtonElement>('[data-window-reset]');
layoutResetButton?.addEventListener('click', resetLayout);

const initWindows = () => {
  document.querySelectorAll<HTMLElement>('[data-window]').forEach((element) => {
    attachWindow(element, counter);
  });
};

initWindows();
document.addEventListener('astro:page-load', initWindows);

document.addEventListener('astro:before-swap', resetLayout, { once: true });
