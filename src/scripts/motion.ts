import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let lenis: Lenis | null = null;
let tickerBound = false;
const onLenisFrame = (time: number) => lenis?.raf(time * 1000);

const splitHeadlines = () => {
  if (reduceMotion.matches) return;
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((word) => {
    if (word.dataset.splitReady === 'true') return;
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
    word.dataset.splitReady = 'true';
  });
};

const initLenis = () => {
  if (lenis || reduceMotion.matches) return;
  lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false, touchMultiplier: 1, wheelMultiplier: 0.92, overscroll: true });
  lenis.on('scroll', ScrollTrigger.update);
  if (!tickerBound) {
    gsap.ticker.add(onLenisFrame);
    gsap.ticker.lagSmoothing(0);
    tickerBound = true;
  }
};

const init = () => {
  if (!document.body) return;
  initLenis();
  splitHeadlines();
  document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-ready])').forEach((target) => {
    target.dataset.revealReady = 'true';
    if (reduceMotion.matches || target.getBoundingClientRect().top < window.innerHeight * 0.92) {
      target.classList.add('is-in');
      return;
    }
    gsap.fromTo(target, { y: 26, autoAlpha: 0 }, {
      y: 0, autoAlpha: 1, duration: 0.82, ease: 'power3.out',
      clearProps: 'transform,opacity,visibility',
      scrollTrigger: { trigger: target, start: 'top 90%', once: true },
      onStart: () => target.classList.add('is-in'),
    });
  });
  if (!reduceMotion.matches) {
    document.querySelectorAll<HTMLElement>('[data-split-ready="true"]:not([data-split-motion-ready])').forEach((word) => {
      word.dataset.splitMotionReady = 'true';
      gsap.fromTo(word.querySelectorAll('.char'), { yPercent: 115, rotateX: -50, autoAlpha: 0 }, {
        yPercent: 0, rotateX: 0, autoAlpha: 1, duration: 0.84, stagger: 0.035, ease: 'power4.out', delay: 0.12,
      });
    });
    document.querySelectorAll<HTMLElement>('[data-parallax]:not([data-parallax-ready])').forEach((item) => {
      item.dataset.parallaxReady = 'true';
      const speed = Number(item.dataset.parallax ?? '0.08');
      gsap.to(item, { yPercent: speed * -100, ease: 'none', scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
    });
    if (window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll<HTMLElement>('.btn--magnetic:not([data-magnetic-ready])').forEach((button) => {
        button.dataset.magneticReady = 'true';
        button.addEventListener('pointermove', (event) => {
          const rect = button.getBoundingClientRect();
          gsap.to(button, { x: (event.clientX - rect.left - rect.width / 2) * 0.16, y: (event.clientY - rect.top - rect.height / 2) * 0.18, duration: 0.32, ease: 'power3.out', overwrite: true });
        });
        const reset = () => gsap.to(button, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.45)', overwrite: true });
        button.addEventListener('pointerleave', reset);
        button.addEventListener('blur', reset);
      });
    }
  }
  document.documentElement.dataset.motion = 'ready';
  requestAnimationFrame(() => ScrollTrigger.refresh());
};

init();
document.addEventListener('astro:page-load', init);
reduceMotion.addEventListener('change', () => {
  if (reduceMotion.matches) {
    if (tickerBound) {
      gsap.ticker.remove(onLenisFrame);
      tickerBound = false;
    }
    lenis?.destroy();
    lenis = null;
    gsap.killTweensOf('[data-reveal], .char, [data-parallax], .btn--magnetic');
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.set('[data-reveal], [data-parallax], .btn--magnetic', { clearProps: 'transform,opacity,visibility' });
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => element.classList.add('is-in'));
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((word) => {
      if (word.dataset.splitReady !== 'true') return;
      word.textContent = Array.from(word.querySelectorAll<HTMLElement>('.char'), (char) => char.textContent ?? '').join('');
      word.removeAttribute('aria-label');
      delete word.dataset.splitReady;
      delete word.dataset.splitMotionReady;
    });
    return;
  }
  document.querySelectorAll<HTMLElement>('[data-reveal-ready], [data-parallax-ready]').forEach((element) => {
    delete element.dataset.revealReady;
    delete element.dataset.parallaxReady;
    element.classList.remove('is-in');
  });
  init();
});
