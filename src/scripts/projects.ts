const filterButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>('[data-filter]'),
);
const items = Array.from(document.querySelectorAll<HTMLElement>('[data-project-item]'));
const count = document.querySelector<HTMLElement>('[data-project-count]');
const emptyState = document.querySelector<HTMLElement>('[data-empty-state]');

const validFilters = new Set(filterButtons.map((button) => button.dataset.filter ?? 'all'));

const applyFilter = (filter: string, updateUrl = true) => {
  const active = validFilters.has(filter) ? filter : 'all';
  let visible = 0;

  filterButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.filter === active));
  });

  items.forEach((item) => {
    const matches = active === 'all' || item.dataset.category === active;
    item.hidden = !matches;
    if (matches) visible += 1;
  });

  if (count) {
    count.textContent = `${visible} projects shown`;
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

const initial = new URL(window.location.href).searchParams.get('category') ?? 'all';
applyFilter(initial, false);

window.addEventListener('popstate', () => {
  const filter = new URL(window.location.href).searchParams.get('category') ?? 'all';
  applyFilter(filter, false);
});
