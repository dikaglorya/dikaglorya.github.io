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
  title: 'DikaGlorya (DikaOfc) | Developer & Jasa Website Kendal',
  description:
    'Portofolio DikaGlorya (DikaOfc, DikaCode): developer independen di Kendal. Jasa website, bot Telegram, tools, dan automasi yang dibuat untuk dipakai.',
  email: 'dikasukasukaa@gmail.com',
  telegram: 'dikaacode',
  telegramUrl: 'https://t.me/dikaacode',
  github: 'https://github.com/dikaglorya',
  githubHandle: 'dikaglorya',
  instagram: 'https://www.instagram.com/xxcdicka',
  tiktok: 'https://www.tiktok.com/@dikasecx',
  location: 'Kendal, Jawa Tengah, Indonesia',
  locationShort: 'Kendal, ID',
  geo: {
    latitude: -6.921,
    longitude: 110.202,
  },
  locale: 'id_ID',
  lang: 'id',
  ogImage: '/og-kendal-signal.png',
  ogImageAlt:
    'Kartu sosial gelap dengan objek 3D chrome dan tulisan DIKA GLORYA berwarna oranye, developer independen di Kendal.',
  profileImage: '/profile-portrait.jpg',
  availability: 'Terbuka untuk proyek pilihan',
  availabilityNote: 'Telegram adalah cara tercepat menghubungi saya.',
} as const;

export const socialLinks = [
  { label: 'GitHub', href: site.github, handle: `@${site.githubHandle}`, rel: 'me' },
  { label: 'Telegram', href: site.telegramUrl, handle: `@${site.telegram}`, rel: 'me' },
  { label: 'Instagram', href: site.instagram, handle: '@xxcdicka', rel: 'me' },
  { label: 'TikTok', href: site.tiktok, handle: '@dikasecx', rel: 'me' },
] as const;
