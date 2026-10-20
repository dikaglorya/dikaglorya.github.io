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
  const requestedService = params.get('service');
  if (serviceSelect && requestedService) {
    const option = Array.from(serviceSelect.options).find(
      (item) => item.value === requestedService,
    );
    if (option) serviceSelect.value = requestedService;
  }

  form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
      setStatus('Complete the required fields first.', true);
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
    const subject = `Project brief: ${service} - ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Service: ${service}`,
      `Budget: ${budget || 'Not decided yet'}`,
      '',
      'Message:',
      message,
    ].join('\n');

    const mailto = `mailto:${formEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const draftLink = document.createElement('a');
    draftLink.href = mailto;
    draftLink.textContent = formEmail;

    setStatus('Opening your email application. If nothing opens, use the prepared draft:', false, draftLink);
    window.location.href = mailto;
  });
}

if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const email = copyButton.dataset.copyEmail ?? '';
    try {
      await navigator.clipboard.writeText(email);
      if (copyStatus) copyStatus.textContent = 'Email copied.';
    } catch {
      if (copyStatus) copyStatus.textContent = `Copy manually: ${email}`;
    }
  });
}
