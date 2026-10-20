const filterButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>('[data-filter]'),
);
const items = Array.from(document.querySelectorAll<HTMLElement>('[data-project-item]'));
const count = document.querySelector<HTMLElement>('[data-project-count]');
const emptyState = document.querySelector<HTMLElement>('[data-empty-state]');
const search = document.querySelector<HTMLInputElement>('[data-project-search]');
const list = document.querySelector<HTMLElement>('[data-project-list]');
const viewButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>('[data-project-view]'),
);
const quickLook = document.querySelector<HTMLDialogElement>('[data-quick-look]');
const quickLookClose = document.querySelector<HTMLButtonElement>('[data-quick-look-close]');
const quickLookTitle = document.querySelector<HTMLElement>('[data-quick-look-title]');
const quickLookSummary = document.querySelector<HTMLElement>('[data-quick-look-summary]');
const quickLookStack = document.querySelector<HTMLElement>('[data-quick-look-stack]');
const quickLookCategory = document.querySelector<HTMLElement>('[data-quick-look-category]');
const quickLookLink = document.querySelector<HTMLAnchorElement>('[data-quick-look-link]');

const validFilters = new Set(filterButtons.map((button) => button.dataset.filter ?? 'all'));
let activeFilter = 'all';
let searchQuery = '';

const applyFilter = (filter: string, updateUrl = true) => {
  const active = validFilters.has(filter) ? filter : 'all';
  activeFilter = active;
  let visible = 0;

  filterButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.filter === active));
  });

  items.forEach((item) => {
    const searchText = [
      item.dataset.projectName,
      item.dataset.projectSummary,
      item.dataset.projectStack,
      item.dataset.category,
    ].join(' ').toLocaleLowerCase();
    const matchesCategory = active === 'all' || item.dataset.category === active;
    const matchesSearch = searchText.includes(searchQuery);
    const matches = matchesCategory && matchesSearch;
    item.hidden = !matches;
    if (matches) visible += 1;
  });

  if (count) {
    count.textContent = `${visible} proyek ditampilkan`;
  }

  if (emptyState) {
    emptyState.hidden = visible !== 0;
  }

  if (updateUrl) {
    const url = new URL(window.location.href);
    if (active === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', active);
    }
    window.history.replaceState({}, '', url);
  }
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    applyFilter(button.dataset.filter ?? 'all');
  });
});

search?.addEventListener('input', () => {
  searchQuery = search.value.trim().toLocaleLowerCase();
  applyFilter(activeFilter, false);
});

viewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const view = button.dataset.projectView ?? 'list';
    viewButtons.forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    list?.setAttribute('data-view', view);
  });
});

const openQuickLook = (item: HTMLElement) => {
  if (!quickLook) return;
  if (quickLookTitle) quickLookTitle.textContent = item.dataset.projectName ?? '';
  if (quickLookSummary) quickLookSummary.textContent = item.dataset.projectSummary ?? '';
  if (quickLookStack) quickLookStack.textContent = item.dataset.projectStack ?? '';
  if (quickLookCategory) quickLookCategory.textContent = item.dataset.category ?? '';
  if (quickLookLink) quickLookLink.href = item.getAttribute('href') ?? '/projects/';
  if (typeof quickLook.showModal === 'function') quickLook.showModal();
  else quickLook.setAttribute('open', '');
  quickLookClose?.focus();
};

if (quickLook) {
  quickLookClose?.addEventListener('click', () => quickLook.close());
  quickLook.addEventListener('click', (event) => {
    if (event.target === quickLook) quickLook.close();
  });
}

let holdTimer = 0;
let holdOpened = false;

items.forEach((item) => {
  item.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      openQuickLook(item);
    }
  });

  item.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch') return;
    holdOpened = false;
    holdTimer = window.setTimeout(() => {
      holdOpened = true;
      openQuickLook(item);
    }, 500);
  });

  ['pointerup', 'pointercancel', 'pointerleave'].forEach((eventName) => {
    item.addEventListener(eventName, () => window.clearTimeout(holdTimer));
  });

  item.addEventListener('click', (event) => {
    if (!holdOpened) return;
    event.preventDefault();
    holdOpened = false;
  });
});

const initial = new URL(window.location.href).searchParams.get('category') ?? 'all';
applyFilter(initial, false);

window.addEventListener('popstate', () => {
  const filter = new URL(window.location.href).searchParams.get('category') ?? 'all';
  applyFilter(filter, false);
});
