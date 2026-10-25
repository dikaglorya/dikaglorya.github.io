const initCinematicIntro = () => {
  const layer = document.querySelector<HTMLElement>('[data-cinematic-intro]');
  if (!layer || layer.dataset.ready === 'true') return;
  layer.dataset.ready = 'true';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let alreadyPlayed = false;
  try {
    alreadyPlayed = sessionStorage.getItem('kendal-intro-seen') === '1';
  } catch {
    alreadyPlayed = false;
  }
  if (alreadyPlayed || reduceMotion.matches) return;

  const focusBeforeIntro = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const skip = layer.querySelector<HTMLButtonElement>('[data-intro-skip]');
  let finished = false;
  let closeTimer = 0;
  let finishClosing = () => {};
  const removeListeners = () => {
    window.removeEventListener('keydown', onKey);
    reduceMotion.removeEventListener('change', onMotionPreferenceChange);
  };
  const finish = () => {
    if (finished || layer.hidden) return;
    finished = true;
    try {
      sessionStorage.setItem('kendal-intro-seen', '1');
    } catch {
      // The intro remains a one-time-per-page animation when storage is blocked.
    }
    finishClosing = () => {
      if (layer.hidden) return;
      document.documentElement.classList.remove('intro-active');
      layer.hidden = true;
      layer.setAttribute('aria-hidden', 'true');
      layer.classList.remove('is-playing', 'is-leaving');
      removeListeners();
      if (focusBeforeIntro?.isConnected) focusBeforeIntro.focus({ preventScroll: true });
    };
    if (reduceMotion.matches) {
      finishClosing();
    } else {
      layer.classList.add('is-leaving');
      closeTimer = window.setTimeout(finishClosing, 520);
    }
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      skip?.focus({ preventScroll: true });
      return;
    }
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault();
      finish();
    }
  };
  const onMotionPreferenceChange = () => {
    if (!reduceMotion.matches) return;
    if (!finished) {
      finish();
      return;
    }
    window.clearTimeout(closeTimer);
    finishClosing();
  };

  layer.hidden = false;
  layer.setAttribute('aria-hidden', 'false');
  layer.classList.add('is-playing');
  document.documentElement.classList.add('intro-active');
  window.addEventListener('keydown', onKey);
  reduceMotion.addEventListener('change', onMotionPreferenceChange);
  skip?.addEventListener('click', finish, { once: true });
  skip?.focus({ preventScroll: true });
  window.setTimeout(finish, 1120);
};

export { initCinematicIntro };
