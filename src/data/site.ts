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
  // Follows astro.config.mjs (SITE_URL, else the GitHub Pages host), so no page
  // hardcodes a domain that is currently serving a different site.
  url: import.meta.env.SITE,
  title: 'DikaGlorya / DikaOfc | Programmer & Developer di Kendal | ObitoGlory',
  description:
    'Portofolio resmi DikaGlorya, dikenal juga sebagai DikaOfc dan DikaCode, programmer dan independent developer dari Kendal. Lihat proyek, website, bot, developer tools, dan catatan teknis / Official portfolio of DikaGlorya, also known as DikaOfc and DikaCode, an independent developer from Kendal, Indonesia.',
  email: 'dikasukasukaa@gmail.com',
  telegram: 'dikaacode',
  telegramUrl: 'https://t.me/dikaacode',
  github: 'https://github.com/dikaglorya',
  githubHandle: 'dikaglorya',
  instagram: 'https://www.instagram.com/xxcdicka',
  tiktok: 'https://www.tiktok.com/@dikasecx',
  location: 'Kendal, Central Java, Indonesia',
  locationShort: 'Kendal, ID',
  locale: 'id_ID',
  alternateLocale: 'en_US',
  lang: 'id',
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
