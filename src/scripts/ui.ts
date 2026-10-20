const menu = document.querySelector<HTMLDialogElement>('[data-menu]');
const menuOpen = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const menuClose = document.querySelector<HTMLButtonElement>('[data-menu-close]');

const closeMenu = () => {
  if (!menu?.open) return;
  menu.close();
};

if (menu && menuOpen) {
  menuOpen.addEventListener('click', () => {
    if (typeof menu.showModal === 'function') {
      menu.showModal();
    } else {
      menu.setAttribute('open', '');
    }
    document.body.classList.add('menu-open');
    menuClose?.focus();
  });

  menuClose?.addEventListener('click', closeMenu);

  menu.addEventListener('close', () => {
    document.body.classList.remove('menu-open');
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
  if (typeof spotlight.showModal === 'function') spotlight.showModal();
  else spotlight.setAttribute('open', '');
  spotlightInput?.focus();
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

const clock = document.querySelector<HTMLTimeElement>('[data-live-clock]');
const updateClock = () => {
  if (!clock) return;
  const now = new Date();
  clock.dateTime = now.toISOString();
  clock.textContent = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);
};

if (clock) {
  updateClock();
  window.setInterval(updateClock, 15_000);
}

const dock = document.querySelector<HTMLElement>('.app-dock');
const dockItems = Array.from(document.querySelectorAll<HTMLElement>('[data-dock-item]'));
const canMagnifyDock = window.matchMedia('(hover: hover) and (pointer: fine)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (dock && canMagnifyDock.matches && !reduceMotion.matches) {
  let frame = 0;
  dock.addEventListener('pointermove', (event) => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      const centers = dockItems.map((item) => {
        const bounds = item.getBoundingClientRect();
        return bounds.left + bounds.width / 2;
      });

      dockItems.forEach((item, index) => {
        const distance = Math.abs(event.clientX - centers[index]);
        item.classList.toggle('dock-item--near', distance < 135 && distance >= 80);
        item.classList.toggle('dock-item--nearer', distance < 80 && distance >= 38);
        item.classList.toggle('dock-item--magnified', distance < 38);
      });
    });
  });

  dock.addEventListener('pointerleave', () => {
    dockItems.forEach((item) => {
      item.classList.remove('dock-item--near', 'dock-item--nearer', 'dock-item--magnified');
    });
  });
}

dockItems.forEach((item) => {
  item.addEventListener('click', () => {
    item.animate(
      [
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(-9px) scale(1.08)' },
        { transform: 'translateY(0) scale(1)' },
      ],
      { duration: 360, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
  });
});
