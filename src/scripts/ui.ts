const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menu = document.querySelector<HTMLDialogElement>('[data-menu]');
const menuOpen = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const menuClose = document.querySelector<HTMLButtonElement>('[data-menu-close]');

const setMenuState = (open: boolean) => {
  document.body.classList.toggle('menu-open', open);
  menuOpen?.setAttribute('aria-expanded', String(open));
};

const closeMenu = () => {
  if (!menu?.open) return;
  menu.close();
};

if (menu && menuOpen) {
  menuOpen.setAttribute('aria-expanded', 'false');
  menuOpen.addEventListener('click', () => {
    if (typeof menu.showModal === 'function') {
      menu.showModal();
    } else {
      menu.setAttribute('open', '');
    }
    setMenuState(true);
    menuClose?.focus();
  });

  menuClose?.addEventListener('click', closeMenu);

  menu.addEventListener('close', () => {
    setMenuState(false);
    menuOpen.focus();
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  const desktop = window.matchMedia('(min-width: 901px)');
  desktop.addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
}

const spotlight = document.querySelector<HTMLDialogElement>('[data-spotlight]');
const spotlightOpen = document.querySelector<HTMLButtonElement>('[data-spotlight-open]');
const spotlightInput = document.querySelector<HTMLInputElement>('[data-spotlight-input]');
const spotlightItems = Array.from(
  document.querySelectorAll<HTMLLIElement>('[data-search-item]'),
);
const spotlightEmpty = document.querySelector<HTMLElement>('[data-spotlight-empty]');
let activeResult = -1;

const visibleResults = () => spotlightItems.filter((item) => !item.hidden);

const updateSpotlightResults = () => {
  const query = spotlightInput?.value.trim().toLocaleLowerCase() ?? '';
  let visibleCount = 0;

  spotlightItems.forEach((item) => {
    const matches = item.dataset.searchLabel?.includes(query) ?? false;
    item.hidden = !matches;
    item.querySelector('a')?.classList.remove('is-active');
    if (matches) visibleCount += 1;
  });

  activeResult = -1;
  if (spotlightEmpty) spotlightEmpty.hidden = visibleCount > 0;
};

const openSpotlight = () => {
  if (!spotlight) return;
  if (spotlightInput) spotlightInput.value = '';
  updateSpotlightResults();
  if (typeof spotlight.showModal === 'function') spotlight.showModal();
  else spotlight.setAttribute('open', '');
  window.requestAnimationFrame(() => spotlightInput?.focus());
};

if (spotlight && spotlightOpen && spotlightInput) {
  spotlightOpen.addEventListener('click', openSpotlight);
  spotlight.addEventListener('close', () => spotlightOpen.focus());
  spotlight.addEventListener('click', (event) => {
    if (event.target === spotlight) spotlight.close();
  });
  spotlightInput.addEventListener('input', updateSpotlightResults);
  spotlightInput.addEventListener('keydown', (event) => {
    const results = visibleResults();
    if (!results.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      activeResult = (activeResult + direction + results.length) % results.length;
      results.forEach((item, index) => {
        const link = item.querySelector('a');
        link?.classList.toggle('is-active', index === activeResult);
      });
    } else if (event.key === 'Enter' && activeResult >= 0) {
      const href = results[activeResult]?.querySelector('a')?.href;
      if (href) window.location.assign(href);
    }
  });

  spotlightItems.forEach((item) => {
    item.querySelector('a')?.addEventListener('click', () => spotlight.close());
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (spotlight.open) spotlight.close();
      else openSpotlight();
    }
  });
}

const progress = document.querySelector<HTMLElement>('[data-progress]');
const header = document.querySelector<HTMLElement>('[data-header]');

const syncHeader = () => {
  header?.toggleAttribute('data-scrolled', window.scrollY > 8);
};

if (header) {
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();
}

if (progress) {
  let ticking = false;
  const updateProgress = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    document.documentElement.style.setProperty('--progress', value.toFixed(4));
  };
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateProgress);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  updateProgress();
}

const reduceMotionState = () => reduceMotion.matches;
if (reduceMotionState()) {
  document.documentElement.classList.remove('js');
}

export {};
