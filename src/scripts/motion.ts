let observer: IntersectionObserver | null = null;

const initReveals = () => {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!targets.length) return;

  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    document.documentElement.classList.remove('js');
    document.documentElement.dataset.motion = 'ready';
    targets.forEach((target) => target.classList.add('is-in'));
    return;
  }

  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer?.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
  );

  targets.forEach((target) => {
    const rect = target.getBoundingClientRect();
    if (rect.top < window.innerHeight || rect.bottom < 0) {
      target.classList.add('is-in');
      return;
    }
    observer?.observe(target);
  });

  document.documentElement.dataset.motion = 'ready';
};

initReveals();
document.addEventListener('astro:page-load', initReveals);
