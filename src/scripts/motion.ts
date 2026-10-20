const initReveals = () => {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const targets = document.querySelectorAll<HTMLElement>(
    'main .section, main .page-hero, main .featured, main .project-row, main .journal-card, main .capability, main .stack-group',
  );
  if (!targets.length) return;

  document.documentElement.dataset.motion = 'on';
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((target) => {
    target.dataset.reveal = '';
    observer.observe(target);
  });

  document.addEventListener('astro:before-swap', () => observer.disconnect(), { once: true });
};

initReveals();
document.addEventListener('astro:page-load', initReveals);