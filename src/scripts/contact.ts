import {
  buildBriefFragment,
  buildBriefSubject,
  buildBriefText,
  type BriefData,
} from '../lib/brief-email';
import { resolveStatus, type StatusState } from '../lib/status-registry';

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
const formStatus = document.querySelector<HTMLElement>('[data-form-status]');
const serviceSelect = form?.querySelector<HTMLSelectElement>('#service');
const copyButton = document.querySelector<HTMLButtonElement>('[data-copy-email]');
const copyStatus = document.querySelector<HTMLElement>('[data-copy-status]');
const readyPanel = document.querySelector<HTMLElement>('[data-brief-ready]');
const readyTitle = document.querySelector<HTMLElement>('[data-brief-ready-title]');
const readyStatus = document.querySelector<HTMLElement>('[data-brief-copy-status]');
const gmailLink = document.querySelector<HTMLAnchorElement>('[data-brief-gmail]');
const mailtoLink = document.querySelector<HTMLAnchorElement>('[data-brief-mailto]');
const copyAgain = document.querySelector<HTMLButtonElement>('[data-brief-copy]');

const setFeedback = (element: HTMLElement, message: string, state: StatusState) => {
  const resolved = resolveStatus(state);
  element.dataset.status = resolved.state;
  element.dataset.statusVariant = resolved.variant;
  element.textContent = message;
  return resolved;
};

const setStatus = (message: string, state: StatusState = 'neutral', fallbackLink?: HTMLAnchorElement) => {
  if (!formStatus) return;
  const resolved = setFeedback(formStatus, message, state);
  formStatus.classList.toggle('form-status--error', resolved.variant === 'danger');
  if (message && fallbackLink) {
    formStatus.appendChild(document.createTextNode(' '));
    formStatus.appendChild(fallbackLink);
  }
};

const setReadyStatus = (message: string, state: StatusState = 'success') => {
  if (!readyStatus) return;
  const resolved = setFeedback(readyStatus, message, state);
  readyStatus.classList.toggle('form-status--error', resolved.variant === 'danger');
};

if (form) {
  const params = new URLSearchParams(window.location.search);
  const serviceAliases: Record<string, string> = {
    perbaikan: 'repairs',
    lainnya: 'other',
  };
  const requestedService = params.get('service');
  const normalizedService = requestedService
    ? (serviceAliases[requestedService] ?? requestedService)
    : null;

  if (serviceSelect && normalizedService) {
    const option = Array.from(serviceSelect.options).find(
      (item) => item.value === normalizedService,
    );
    if (option) serviceSelect.value = normalizedService;
  }

  const readBrief = (): BriefData => {
    const data = new FormData(form);
    const serviceOption = serviceSelect?.selectedOptions[0];

    return {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      service: serviceOption?.textContent?.trim() ?? '',
      budget: String(data.get('budget') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
      sourceUrl: `${window.location.origin}${window.location.pathname}`,
      siteName: form.dataset.siteName,
      location: form.dataset.siteLocation,
    };
  };

  const copyRichBrief = async (html: string, text: string) => {
    if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) {
      throw new Error('Rich clipboard is not available.');
    }

    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([text], { type: 'text/plain' }),
      }),
    ]);
  };

  const copyPlainBrief = async (text: string) => {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard is not available.');
    await navigator.clipboard.writeText(text);
  };

  const prepareBrief = async () => {
    const data = readBrief();
    const html = buildBriefFragment(data);
    const text = buildBriefText(data);
    const subject = buildBriefSubject(data);
    const target = form.dataset.contactEmail ?? 'dikasukasukaa@gmail.com';

    const gmailUrl = new URL('https://mail.google.com/mail/');
    gmailUrl.searchParams.set('view', 'cm');
    gmailUrl.searchParams.set('fs', '1');
    gmailUrl.searchParams.set('tf', '1');
    gmailUrl.searchParams.set('to', target);
    gmailUrl.searchParams.set('su', subject);

    if (gmailLink) gmailLink.href = gmailUrl.toString();
    if (mailtoLink) {
      mailtoLink.href = `mailto:${target}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    }

    if (readyPanel) {
      readyPanel.hidden = false;
      readyTitle?.focus({ preventScroll: true });
      readyPanel.scrollIntoView({ block: 'nearest' });
    }

    let richCopied = false;
    try {
      await copyRichBrief(html, text);
      richCopied = true;
    } catch {
      richCopied = false;
    }

    if (richCopied) {
      if (readyTitle) readyTitle.textContent = 'Brief siap';
      setReadyStatus(
        'Brief HTML disalin. Buka Gmail, lalu tempel dengan Ctrl+V atau Cmd+V.',
      );
      return;
    }

    try {
      await copyPlainBrief(text);
      if (readyTitle) readyTitle.textContent = 'Brief siap, teks biasa';
      setReadyStatus(
        'Browser ini belum mendukung salin HTML. Brief disalin sebagai teks biasa, jadi tampilannya polos di Gmail.',
        'info',
      );
    } catch {
      if (readyTitle) readyTitle.textContent = 'Brief siap, clipboard diblokir';
      setReadyStatus(
        'Clipboard diblokir. Buka Gmail lalu salin manual dari pratinjau, atau pakai aplikasi email lain.',
        'warning',
      );
    }
  };

  form.addEventListener('submit', async (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
      setStatus('Lengkapi kolom wajib terlebih dahulu.', 'error');
      return;
    }

    event.preventDefault();
    setStatus('');
    await prepareBrief();
  });

  form.addEventListener('input', () => {
    if (readyPanel) readyPanel.hidden = true;
  });

  copyAgain?.addEventListener('click', async () => {
    const data = readBrief();
    const html = buildBriefFragment(data);
    const text = buildBriefText(data);

    try {
      await copyRichBrief(html, text);
      setReadyStatus('Brief HTML disalin ulang. Tempel di Gmail dengan Ctrl+V atau Cmd+V.');
    } catch {
      try {
        await copyPlainBrief(text);
      setReadyStatus('Brief disalin ulang sebagai teks biasa.', 'info');
    } catch {
      setReadyStatus('Clipboard masih diblokir. Pakai tautan aplikasi email lain.', 'warning');
      }
    }
  });
}

if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const email = copyButton.dataset.copyEmail ?? '';
    try {
      await navigator.clipboard.writeText(email);
      if (copyStatus) setFeedback(copyStatus, 'Email disalin.', 'saved');
    } catch {
      if (copyStatus) setFeedback(copyStatus, `Salin manual: ${email}`, 'warning');
    }
  });
}
