export {};

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
    menuOpen.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    menuClose?.focus();
  });

  menuClose?.addEventListener('click', closeMenu);

  menu.addEventListener('close', () => {
    document.body.classList.remove('menu-open');
    menuOpen.setAttribute('aria-expanded', 'false');
    menuOpen.focus();
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  const desktop = window.matchMedia('(min-width: 901px)');
  desktop.addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
}

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
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && results.length > 0) {
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
