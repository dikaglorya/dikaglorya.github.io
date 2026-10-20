const initJournalReader = () => {
  const article = document.querySelector<HTMLElement>('[data-journal-article]');
  const progress = document.querySelector<HTMLElement>('[data-reading-progress]');
  const status = document.querySelector<HTMLElement>('[data-reading-status]');
  if (!article || !progress || article.dataset.readerReady === 'true') return;
  article.dataset.readerReady = 'true';

  let frame = 0;
  let lastMilestone = -1;
  const updateProgress = () => {
    frame = 0;
    const bounds = article.getBoundingClientRect();
    const scrollable = article.offsetHeight - window.innerHeight;
    const fraction = scrollable <= 0 ? 1 : Math.min(1, Math.max(0, -bounds.top / scrollable));
    progress.style.transform = `scaleX(${fraction})`;
    const milestone = Math.floor(fraction * 4);
    if (milestone !== lastMilestone && status) {
      lastMilestone = milestone;
      status.textContent = milestone >= 4 ? 'Selesai dibaca' : `${milestone * 25}% dibaca`;
    }
  };
  const scheduleProgress = () => {
    if (!frame) frame = window.requestAnimationFrame(updateProgress);
  };

  const copyButtons = Array.from(article.querySelectorAll<HTMLButtonElement>('[data-copy-code]'));
  copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const code = button.closest('.journal-code-wrap')?.querySelector('code')?.textContent;
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = 'Tersalin';
        window.setTimeout(() => { button.textContent = 'Salin'; }, 1600);
      } catch {
        button.textContent = 'Gagal menyalin';
        window.setTimeout(() => { button.textContent = 'Salin'; }, 2000);
      }
    });
  });

  const sections = Array.from(article.querySelectorAll<HTMLElement>('.journal-section[id]'));
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.journal-toc a'));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const current = link.hash === `#${entry.target.id}`;
        if (current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-18% 0px -70% 0px' });
  sections.forEach((section) => sectionObserver.observe(section));

  const cleanup = () => {
    window.removeEventListener('scroll', scheduleProgress);
    window.removeEventListener('resize', scheduleProgress);
    window.cancelAnimationFrame(frame);
    sectionObserver.disconnect();
  };
  window.addEventListener('scroll', scheduleProgress, { passive: true });
  window.addEventListener('resize', scheduleProgress);
  document.addEventListener('astro:before-swap', cleanup, { once: true });
  updateProgress();
};

initJournalReader();
document.addEventListener('astro:page-load', initJournalReader);