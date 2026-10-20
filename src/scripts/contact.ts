const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
const formStatus = document.querySelector<HTMLElement>('[data-form-status]');
const serviceSelect = form?.querySelector<HTMLSelectElement>('#service');
const copyButton = document.querySelector<HTMLButtonElement>('[data-copy-email]');
const copyStatus = document.querySelector<HTMLElement>('[data-copy-status]');

const setStatus = (message: string, isError = false, fallbackLink?: HTMLAnchorElement) => {
  if (!formStatus) return;
  formStatus.classList.toggle('form-status--error', isError);
  formStatus.textContent = message;
  if (fallbackLink) {
    formStatus.appendChild(document.createTextNode(' '));
    formStatus.appendChild(fallbackLink);
  }
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

  form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
      setStatus('Lengkapi kolom wajib terlebih dahulu.', true);
      return;
    }

    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const service = String(data.get('service') ?? '').trim();
    const budget = String(data.get('budget') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    const formEmail = form.dataset.contactEmail ?? 'dikasukasukaa@gmail.com';
    const subject = `Brief proyek: ${service} - ${name}`;
    const body = [
      `Nama: ${name}`,
      `Email: ${email}`,
      `Layanan: ${service}`,
      `Anggaran: ${budget || 'Belum ditentukan'}`,
      '',
      'Pesan:',
      message,
    ].join('\n');

    const mailto = `mailto:${formEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const draftLink = document.createElement('a');
    draftLink.href = mailto;
    draftLink.textContent = formEmail;

    setStatus('Membuka aplikasi email. Jika tidak terbuka, pakai draft berikut:', false, draftLink);
    window.location.href = mailto;
  });
}

if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const email = copyButton.dataset.copyEmail ?? '';
    try {
      await navigator.clipboard.writeText(email);
      if (copyStatus) copyStatus.textContent = 'Email disalin.';
    } catch {
      if (copyStatus) copyStatus.textContent = `Salin manual: ${email}`;
    }
  });
}
