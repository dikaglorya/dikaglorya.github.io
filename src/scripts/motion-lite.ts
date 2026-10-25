const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let observer: IntersectionObserver | null = null;

const init = () => {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!targets.length) {
    document.documentElement.dataset.motion = 'ready';
    return;
  }
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-in'));
  } else {
    observer?.disconnect();
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer?.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    targets.forEach((target) => {
      if (target.getBoundingClientRect().top < window.innerHeight) target.classList.add('is-in');
      else observer?.observe(target);
    });
  }
  document.documentElement.dataset.motion = 'ready';
};

init();
document.addEventListener('astro:page-load', init);
reduceMotion.addEventListener('change', () => {
  if (!reduceMotion.matches) return;
  observer?.disconnect();
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((target) => target.classList.add('is-in'));
});

export {};
