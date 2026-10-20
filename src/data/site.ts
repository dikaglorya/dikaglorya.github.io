export const site = {
  name: 'ObitoGlory',
  shortName: 'obitoglory',
  legalName: 'DikaCode',
  alternateNames: ['DikaCode', 'DikaOfc', 'ObitoGlory'],
  url: 'https://obitoglory.tech',
  title: 'ObitoGlory | Independent developer in Kendal, Indonesia',
  description:
    'Portfolio and services of ObitoGlory (DikaCode / DikaOfc), an independent developer in Kendal, Indonesia building websites, bots, AI tools, and security automation.',
  email: 'dikasukasukaa@gmail.com',
  telegram: 'dikaacode',
  telegramUrl: 'https://t.me/dikaacode',
  github: 'https://github.com/dikaglorya',
  githubHandle: 'dikaglorya',
  instagram: 'https://www.instagram.com/xxcdicka',
  tiktok: 'https://www.tiktok.com/@dikasecx',
  location: 'Kendal, Central Java, Indonesia',
  locationShort: 'Kendal, ID',
  coordinates: '6.9°S 110.2°E',
  locale: 'en_US',
  lang: 'en',
  ogImage: '/og-default.png',
  ogImageAlt:
    'ObitoGlory, independent developer in Kendal, Indonesia. Websites, bots, AI tools, and security automation.',
  availability: 'Open for selected projects',
  availabilityNote: 'Telegram is the fastest way to reach me.',
} as const;

export const socialLinks = [
  { label: 'GitHub', href: site.github, handle: `@${site.githubHandle}`, rel: 'me' },
  { label: 'Telegram', href: site.telegramUrl, handle: `@${site.telegram}`, rel: 'me' },
  { label: 'Instagram', href: site.instagram, handle: '@xxcdicka', rel: 'me' },
  { label: 'TikTok', href: site.tiktok, handle: '@dikasecx', rel: 'me' },
] as const;
