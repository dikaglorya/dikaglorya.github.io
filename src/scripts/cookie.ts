/* First-party consent record. No third-party tag is loaded here; the stored
   choice is the source of truth if analytics or marketing is added later. */

type ConsentChoice = {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

const KEY = 'og-consent-v1';
const banner = document.querySelector<HTMLElement>('[data-cookie-consent]');

const read = (): ConsentChoice | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    if (parsed.necessary !== true) return null;
    return {
      necessary: true,
      preferences: parsed.preferences === true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
    };
  } catch {
    return null;
  }
};

const write = (preferences: boolean) => {
  const choice: ConsentChoice = {
    necessary: true,
    preferences,
    analytics: false,
    marketing: false,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(choice));
  } catch {
    /* The choice still applies for this page; only persistence is unavailable. */
  }
  banner?.setAttribute('hidden', '');
  document.dispatchEvent(new CustomEvent('consent:change', { detail: choice }));
};

const openConsent = () => {
  banner?.removeAttribute('hidden');
};

const closeConsent = () => {
  banner?.setAttribute('hidden', '');
};

if (banner) {
  if (!read()) {
    window.setTimeout(openConsent, 1200);
  }

  banner.querySelector('[data-cookie-accept]')?.addEventListener('click', () => write(true));
  banner.querySelector('[data-cookie-essential]')?.addEventListener('click', () => write(false));
}

document.querySelectorAll('[data-cookie-open]').forEach((button) => {
  button.addEventListener('click', openConsent);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && banner && !banner.hasAttribute('hidden')) closeConsent();
});

export {};
