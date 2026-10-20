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
