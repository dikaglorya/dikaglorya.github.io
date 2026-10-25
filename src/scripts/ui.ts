const THEME_KEY = 'theme';
const root = document.documentElement;
const themeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]'));
const themeLabels = Array.from(document.querySelectorAll<HTMLElement>('[data-theme-label]'));
const themeMeta = document.querySelector<HTMLMetaElement>('meta[data-theme-color]');
const lightQuery = window.matchMedia('(prefers-color-scheme: light)');

const storedTheme = (): 'light' | 'dark' | null => {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
};

const currentTheme = (): 'light' | 'dark' => (root.dataset.theme === 'light' ? 'light' : 'dark');

const syncThemeUI = () => {
  const theme = currentTheme();
  const next = theme === 'dark' ? 'terang' : 'gelap';
  themeButtons.forEach((button) => {
    const isRow = button.classList.contains('theme-row');
    const label = isRow
      ? `Tema: ${theme === 'dark' ? 'Gelap' : 'Terang'}. Aktifkan tema ${next}`
      : `Aktifkan tema ${next}`;
    button.setAttribute('aria-label', label);
    button.setAttribute('title', `Aktifkan tema ${next}`);
  });
  themeLabels.forEach((label) => {
    label.textContent = theme === 'dark' ? 'Gelap' : 'Terang';
  });
  if (themeMeta) themeMeta.content = theme === 'light' ? '#f2eee4' : '#07080a';
};

const applyTheme = (theme: 'light' | 'dark', persist: boolean) => {
  root.dataset.theme = theme;
  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* Storage may be unavailable; the theme still applies to this page. */
    }
  }
  syncThemeUI();
};

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
  });
});

lightQuery.addEventListener('change', (event) => {
  if (storedTheme()) return;
  applyTheme(event.matches ? 'light' : 'dark', false);
});

syncThemeUI();

/* ---------- Header and progress ----------------------------------------- */

const header = document.querySelector<HTMLElement>('[data-header]');
const progress = document.querySelector<HTMLElement>('[data-progress]');

const syncHeader = () => {
  header?.toggleAttribute('data-scrolled', window.scrollY > 8);
};

let progressFrame = 0;
const updateProgress = () => {
  progressFrame = 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  root.style.setProperty('--progress', value.toFixed(4));
};

const scheduleProgress = () => {
  if (progressFrame) return;
  progressFrame = window.requestAnimationFrame(updateProgress);
};

if (header) {
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();
}

if (progress) {
  window.addEventListener('scroll', scheduleProgress, { passive: true });
  window.addEventListener('resize', scheduleProgress, { passive: true });
  updateProgress();
}

/* ---------- Local clock ------------------------------------------------- */

const clock = document.querySelector<HTMLElement>('[data-clock]');
if (clock) {
  const format = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
    hour12: false,
  });
  const tick = () => {
    clock.textContent = `Kendal · ${format.format(new Date())} WIB`;
  };
  tick();
  window.setInterval(tick, 30_000);
}

/* ---------- Mobile menu ------------------------------------------------- */

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
  menuOpen.addEventListener('click', () => {
    if (typeof menu.showModal === 'function') menu.showModal();
    else menu.setAttribute('open', '');
    setMenuState(true);
    menuClose?.focus();
  });

  menuClose?.addEventListener('click', closeMenu);

  menu.addEventListener('close', () => {
    setMenuState(false);
    window.requestAnimationFrame(() => menuOpen.focus());
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.matchMedia('(min-width: 1101px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
}

/* ---------- Search palette --------------------------------------------- */

const spotlight = document.querySelector<HTMLDialogElement>('[data-spotlight]');
const spotlightOpen = document.querySelector<HTMLButtonElement>('[data-spotlight-open]');
const spotlightInput = document.querySelector<HTMLInputElement>('[data-spotlight-input]');
const spotlightItems = Array.from(document.querySelectorAll<HTMLLIElement>('[data-search-item]'));
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
  spotlight.addEventListener('close', () => {
    window.requestAnimationFrame(() => spotlightOpen.focus());
  });
  spotlight.addEventListener('click', (event) => {
    if (event.target === spotlight) spotlight.close();
  });
  spotlight.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !spotlight.open) return;
    event.preventDefault();
    spotlight.close();
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
        item.querySelector('a')?.classList.toggle('is-active', index === activeResult);
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

/* ---------- Cursor, tilt, and magnetic controls ------------------------- */

const finePointer = window.matchMedia('(pointer: fine)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const cursor = document.querySelector<HTMLElement>('[data-cursor]');

if (cursor && finePointer.matches && !reduceMotion.matches) {
  document.body.classList.add('cursor-ready');
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let currentX = x;
  let currentY = y;
  let frame = 0;

  const renderCursor = () => {
    frame = 0;
    currentX += (x - currentX) * 0.18;
    currentY += (y - currentY) * 0.18;
    cursor.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    frame = window.requestAnimationFrame(renderCursor);
  };

  window.addEventListener(
    'pointermove',
    (event) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(renderCursor);
    },
    { passive: true },
  );

  document.addEventListener('pointerover', (event) => {
    const target = event.target as HTMLElement;
    document.body.classList.toggle(
      'cursor-active',
      Boolean(target.closest('a, button, [data-cursor-active]')),
    );
  });
}

const tiltItems = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'));
if (tiltItems.length && finePointer.matches && !reduceMotion.matches) {
  tiltItems.forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      item.style.setProperty('--tilt-x', `${(-py * 4).toFixed(2)}deg`);
      item.style.setProperty('--tilt-y', `${(px * 6).toFixed(2)}deg`);
    });
    item.addEventListener('pointerleave', () => {
      item.style.setProperty('--tilt-x', '0deg');
      item.style.setProperty('--tilt-y', '0deg');
    });
  });
}

export {};
