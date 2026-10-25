let observer: IntersectionObserver | null = null;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const initReveals = () => {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!targets.length) return;

  if (!('IntersectionObserver' in window) || reduceMotion.matches) {
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
    if (rect.top < window.innerHeight) {
      target.classList.add('is-in');
      return;
    }
    observer?.observe(target);
  });
};

const initSplit = () => {
  const words = Array.from(document.querySelectorAll<HTMLElement>('[data-split]'));
  if (!words.length || reduceMotion.matches) return;

  words.forEach((word) => {
    const text = word.textContent ?? '';
    word.setAttribute('aria-label', text);
    word.textContent = '';
    Array.from(text).forEach((char, index) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.setAttribute('aria-hidden', 'true');
      span.style.setProperty('--i', String(index));
      span.textContent = char === ' ' ? '\u00a0' : char;
      word.append(span);
    });
  });
};

const initParallax = () => {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  if (!items.length || reduceMotion.matches) return;

  let frame = 0;
  const update = () => {
    frame = 0;
    const viewport = window.innerHeight;
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;
      const speed = Number(item.dataset.parallax ?? '0.08');
      const offset = (rect.top + rect.height / 2 - viewport / 2) * speed;
      item.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    });
  };
  const schedule = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  update();
};

const init = () => {
  initSplit();
  initReveals();
  initParallax();
  document.documentElement.dataset.motion = 'ready';
};

init();
document.addEventListener('astro:page-load', init);
