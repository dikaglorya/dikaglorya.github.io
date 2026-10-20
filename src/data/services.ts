export type Service = {
  slug: string;
  name: string;
  nameId: string;
  short: string;
  description: string;
  descriptionId: string;
  includes: string[];
  includesId: string[];
  platforms?: string[];
  limits: string[];
  limitsId: string[];
  priceFrom: string;
  priceNote: string;
  priceNoteId: string;
  order: number;
};

export const services: Service[] = [
  {
    slug: 'website',
    name: 'Website development',
    nameId: 'Pembuatan website',
    short: 'Websites that are tidy, fast, and responsive.',
    description:
      'Landing pages, company profiles, portfolios, and custom websites that are responsive and fast. Built on a clear structure, not a template slapped on.',
    descriptionId:
      'Pembuatan landing page, company profile, portofolio, dan website custom yang responsif dan cepat, dengan struktur yang jelas dan bukan sekadar template.',
    includes: [
      'Landing pages',
      'Company profiles',
      'Portfolios',
      'Custom websites',
      'Responsive design',
      'Performance optimization',
    ],
    includesId: [
      'Landing page',
      'Profil perusahaan',
      'Portofolio',
      'Website custom',
      'Desain responsif',
      'Optimasi performa',
    ],
    limits: [
      'Scope, revisions, and timeline are agreed before work starts',
      'Features beyond the initial scope are quoted separately',
    ],
    limitsId: [
      'Lingkup, revisi, dan timeline disepakati sebelum mulai',
      'Fitur di luar lingkup awal dihitung terpisah',
    ],
    priceFrom: 'Rp150k',
    priceNote: 'Starting price, discussable with scope.',
    priceNoteId: 'Harga awal, dapat dibicarakan sesuai lingkup.',
    order: 1,
  },
  {
    slug: 'bot',
    name: 'Bot development',
    nameId: 'Pembuatan bot',
    short: 'Bots that work the way your workflow does.',
    description:
      'Custom Telegram, WhatsApp, and Discord bots for automation, communities, and business. Not the template bot that everyone already has.',
    descriptionId:
      'Bot Telegram, WhatsApp, dan Discord custom untuk automasi, komunitas, dan bisnis, dibuat sesuai kebutuhan, bukan bot template yang itu-itu saja.',
    includes: [
      'Custom commands',
      'Automation',
      'API integration',
      'Databases',
      'Admin systems',
    ],
    includesId: [
      'Perintah custom',
      'Otomasi',
      'Integrasi API',
      'Database',
      'Sistem admin',
    ],
    platforms: ['Telegram', 'WhatsApp', 'Discord'],
    limits: [
      'Price depends on platform and features',
      'The final feature set is agreed before work starts',
    ],
    limitsId: [
      'Harga bergantung pada platform dan fitur',
      'Daftar fitur akhir disepakati sebelum mulai',
    ],
    priceFrom: 'Rp100k',
    priceNote: 'Starting price, depends on platform and features.',
    priceNoteId: 'Harga awal, bergantung pada platform dan fitur.',
    order: 2,
  },
  {
    slug: 'tools',
    name: 'Custom tools',
    nameId: 'Tools custom',
    short: 'Custom tools for repetitive work.',
    description:
      'Custom tools, CLIs, utility software, and workflow automation. Built to follow your workflow, not the other way around.',
    descriptionId:
      'Pembuatan tools custom, CLI, software utilitas, dan automasi workflow yang mengikuti cara kerjamu.',
    includes: [
      'Custom tools',
      'Automation',
      'API integration',
      'CLI tools',
      'Utility software',
      'Workflow automation',
    ],
    includesId: [
      'Tools custom',
      'Otomasi',
      'Integrasi API',
      'Tools CLI',
      'Software utilitas',
      'Otomasi alur kerja',
    ],
    limits: ['Price follows the complexity of the tool', 'The workflow is agreed first'],
    limitsId: ['Harga mengikuti kompleksitas tools', 'Alur kerja disepakati terlebih dahulu'],
    priceFrom: 'Rp150k',
    priceNote: 'Starting price, set by the complexity of the tool.',
    priceNoteId: 'Harga awal ditentukan oleh kompleksitas tools.',
    order: 3,
  },
  {
    slug: 'repairs',
    name: 'Repairs & maintenance',
    nameId: 'Perbaikan dan pemeliharaan',
    short: 'Stepping into an existing system and fixing the root.',
    description:
      'Bug fixes, error hunting, maintenance, optimization, refactoring, and feature work for systems that already exist, including projects that stopped halfway.',
    descriptionId:
      'Perbaikan bug dan error, pemeliharaan, optimasi, refactoring, serta pengembangan fitur untuk sistem yang sudah ada, termasuk proyek yang sempat terhenti.',
    includes: [
      'Bug fixes',
      'Error fixes',
      'Maintenance',
      'Feature development',
      'Optimization',
      'Refactoring',
    ],
    includesId: [
      'Perbaikan bug',
      'Perbaikan error',
      'Maintenance',
      'Pengembangan fitur',
      'Optimasi',
      'Refactoring',
    ],
    limits: [
      'The monthly rate covers ongoing maintenance',
      'One-off fixes are priced from the scope',
    ],
    limitsId: [
      'Biaya bulanan mencakup maintenance berkelanjutan',
      'Perbaikan satu kali dihitung berdasarkan lingkup',
    ],
    priceFrom: 'Rp50k/mo',
    priceNote: 'For monthly maintenance. One-off fixes are priced from scope.',
    priceNoteId: 'Untuk maintenance bulanan. Perbaikan satu kali dihitung berdasarkan lingkup.',
    order: 4,
  },
];

export const getService = (slug: string) => services.find((service) => service.slug === slug);
