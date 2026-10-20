export type Service = {
  slug: string;
  name: string;
  short: string;
  description: string;
  includes: string[];
  platforms?: string[];
  limits: string[];
  priceFrom: string;
  priceNote: string;
  order: number;
};

export const services: Service[] = [
  {
    slug: 'website',
    name: 'Pembuatan website',
    short: 'Website yang rapi, cepat, dan responsif.',
    description:
      'Pembuatan landing page, company profile, portofolio, dan website custom yang responsif dan cepat, dengan struktur yang jelas dan bukan sekadar template.',
    includes: [
      'Landing page',
      'Profil perusahaan',
      'Portofolio',
      'Website custom',
      'Desain responsif',
      'Optimasi performa',
    ],
    limits: [
      'Lingkup, revisi, dan timeline disepakati sebelum mulai',
      'Fitur di luar lingkup awal dihitung terpisah',
    ],
    priceFrom: 'Rp150k',
    priceNote: 'Harga awal, dapat dibicarakan sesuai lingkup.',
    order: 1,
  },
  {
    slug: 'bot',
    name: 'Pembuatan bot',
    short: 'Bot yang mengikuti cara kerja kamu.',
    description:
      'Bot Telegram, WhatsApp, dan Discord custom untuk automasi, komunitas, dan bisnis, dibuat sesuai kebutuhan, bukan bot template yang itu-itu saja.',
    includes: [
      'Perintah custom',
      'Otomasi',
      'Integrasi API',
      'Database',
      'Sistem admin',
    ],
    platforms: ['Telegram', 'WhatsApp', 'Discord'],
    limits: [
      'Harga bergantung pada platform dan fitur',
      'Daftar fitur akhir disepakati sebelum mulai',
    ],
    priceFrom: 'Rp100k',
    priceNote: 'Harga awal, bergantung pada platform dan fitur.',
    order: 2,
  },
  {
    slug: 'tools',
    name: 'Tools custom',
    short: 'Tools custom untuk pekerjaan yang berulang.',
    description:
      'Pembuatan tools custom, CLI, software utilitas, dan automasi workflow yang mengikuti cara kerjamu.',
    includes: [
      'Tools custom',
      'Otomasi',
      'Integrasi API',
      'Tools CLI',
      'Software utilitas',
      'Otomasi alur kerja',
    ],
    limits: ['Harga mengikuti kompleksitas tools', 'Alur kerja disepakati terlebih dahulu'],
    priceFrom: 'Rp150k',
    priceNote: 'Harga awal ditentukan oleh kompleksitas tools.',
    order: 3,
  },
  {
    slug: 'repairs',
    name: 'Perbaikan dan pemeliharaan',
    short: 'Masuk ke sistem yang sudah ada dan memperbaiki akarnya.',
    description:
      'Perbaikan bug dan error, pemeliharaan, optimasi, refactoring, serta pengembangan fitur untuk sistem yang sudah ada, termasuk proyek yang sempat terhenti.',
    includes: [
      'Perbaikan bug',
      'Perbaikan error',
      'Maintenance',
      'Pengembangan fitur',
      'Optimasi',
      'Refactoring',
    ],
    limits: [
      'Biaya bulanan mencakup maintenance berkelanjutan',
      'Perbaikan satu kali dihitung berdasarkan lingkup',
    ],
    priceFrom: 'Rp50k/bln',
    priceNote: 'Untuk maintenance bulanan. Perbaikan satu kali dihitung berdasarkan lingkup.',
    order: 4,
  },
];

export const getService = (slug: string) => services.find((service) => service.slug === slug);
