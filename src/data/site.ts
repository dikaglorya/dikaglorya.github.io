export const site = {
  name: 'ObitoGlory',
  shortName: 'obitoglory',
  personName: 'DikaGlorya',
  developerName: 'DikaCode',
  // Structured-data aliases: only names that are genuinely used and explained
  // as aliases of this person on /about. "Dika Kendal" stays a location-related
  // prose name on /about; it is not claimed as an entity alias here (PRD rule:
  // include an alias only when it is genuinely used and its relationship is
  // explained on the site).
  alternateNames: [
    'DikaGlory',
    'DikaCode',
    'DikaOfc',
    'Dika Developer',
    'ObitoGlory',
  ],
  url: 'https://obitoglory.tech',
  title: 'DikaGlorya | ObitoGlory, Independent Developer',
  description:
    'The official portfolio of DikaGlorya, also known as DikaCode. ObitoGlory is the home for practical software, developer tools, web projects, and technical notes.',
  email: 'dikasukasukaa@gmail.com',
  telegram: 'dikaacode',
  telegramUrl: 'https://t.me/dikaacode',
  github: 'https://github.com/dikaglorya',
  githubHandle: 'dikaglorya',
  instagram: 'https://www.instagram.com/xxcdicka',
  tiktok: 'https://www.tiktok.com/@dikasecx',
  location: 'Kendal, Central Java, Indonesia',
  locationShort: 'Kendal, ID',
  locale: 'en_US',
  lang: 'en',
  ogImage: '/og-default.png',
  ogImageAlt:
    'Masked portrait of DikaGlorya on a dark ObitoGlory social card with the wordmark and the line "Useful software, built by DikaGlorya."',
  profileImage: '/profile-portrait.jpg',
  availability: 'Open for selected projects',
  availabilityNote: 'Telegram is the fastest way to reach me.',
} as const;

export const socialLinks = [
  { label: 'GitHub', href: site.github, handle: `@${site.githubHandle}`, rel: 'me' },
  { label: 'Telegram', href: site.telegramUrl, handle: `@${site.telegram}`, rel: 'me' },
  { label: 'Instagram', href: site.instagram, handle: '@xxcdicka', rel: 'me' },
  { label: 'TikTok', href: site.tiktok, handle: '@dikasecx', rel: 'me' },
] as const;
