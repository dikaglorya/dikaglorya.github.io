export type ProjectCategory =
  | 'AI & automasi'
  | 'Keamanan & automasi'
  | 'Web'
  | 'Android'
  | 'Tools developer';

export type ProjectLink = {
  href: string;
  label: string;
  external: boolean;
  // "live" means a running instance you can open. "package" means a published
  // artifact you can install. They are not interchangeable, so the page labels
  // them differently instead of calling every link "Live".
  kind?: 'live' | 'package';
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  problem: string;
  approach: string;
  features: string[];
  category: ProjectCategory;
  type: string;
  stack: string[];
  featured: boolean;
  order: number;
  link?: ProjectLink;
  note?: string;
};

export const projects: Project[] = [
  {
    slug: 'dikaroute',
    name: 'DikaRoute',
    tagline: 'Satu endpoint untuk banyak provider AI.',
    summary:
      'Gateway kompatibel OpenAI yang meneruskan permintaan ke provider yang tersedia, dengan fallback otomatis, kompresi, dan cache.',
    problem:
      'Saat satu provider bermasalah atau mencapai batas request, aplikasi ikut berhenti. Pindah provider biasanya juga berarti mengubah konfigurasi dan client.',
    approach:
      'DikaRoute menyatukan beberapa provider di balik satu endpoint kompatibel OpenAI. Request diarahkan otomatis ke provider lain saat provider aktif gagal.',
    features: [
      'Satu endpoint kompatibel OpenAI',
      'Routing multi-provider',
      'Fallback otomatis saat provider gagal atau kena rate limit',
      'Kompresi request',
      'Cache respons',
    ],
    category: 'AI & automasi',
    type: 'Gateway AI',
    stack: ['TypeScript', 'Node.js', 'OpenAI API'],
    featured: true,
    order: 1,
    link: {
      href: 'https://www.npmjs.com/package/dikaroute',
      label: 'dikaroute di npm',
      external: true,
      kind: 'package',
    },
    note: 'Paket yang diterbitkan bisa dipasang, tetapi repositori GitHub yang dirujuk metadata-nya sudah tidak publik, jadi halaman ini satu-satunya tempat desainnya dituliskan.',
  },
  {
    slug: 'pentesterbot',
    name: 'PentesterBot',
    tagline: 'Alur recon dan pemindaian langsung dari Telegram.',
    summary:
      'Bot Telegram untuk mengotomatiskan alur pentest, termasuk recon dan pemindaian kerentanan.',
    problem:
      'Pekerjaan keamanan sering tersebar di terminal, berbagai tool, dan catatan, sehingga berpindah konteks memperlambat proses.',
    approach:
      'PentesterBot membungkus recon dan eksekusi tool ke dalam satu alur chat terstruktur, sehingga satu perintah bisa berlanjut ke langkah berikutnya.',
    features: [
      'Alur recon terstruktur di dalam chat',
      'Eksekusi tool dari satu perintah',
      'Langkah pemindaian berurutan',
      'Riwayat pekerjaan tersimpan di alur chat',
    ],
    category: 'Keamanan & automasi',
    type: 'Bot Telegram',
    stack: ['JavaScript', 'Node.js', 'Telegram Bot API'],
    featured: true,
    order: 2,
  },
  {
    slug: 'obitobuff',
    name: 'ObitoBuff CLI',
    tagline: 'AI coding agent yang berjalan di model kamu sendiri.',
    summary:
      'AI coding agent di terminal dengan sub-agent untuk mencari dan mengedit file, menjalankan shell, riset, dan code review. Berjalan lokal tanpa backend.',
    problem:
      'Banyak coding agent bergantung pada backend ter-host dan model tertentu, sehingga pilihan model terbatas dan biaya bertambah.',
    approach:
      'ObitoBuff adalah monorepo TypeScript yang berjalan di terminal dan terhubung ke model kompatibel OpenAI pilihanmu, termasuk Ollama, OpenRouter, atau vLLM.',
    features: [
      'Sub-agent untuk mencari dan mengedit file, bash, riset, dan code review',
      'Berjalan sepenuhnya lokal',
      'Tanpa backend',
      'Mendukung model kompatibel OpenAI',
    ],
    category: 'Tools developer',
    type: 'CLI, AI agent',
    stack: ['TypeScript', 'Bun', 'OpenAI-compatible API'],
    featured: true,
    order: 3,
  },
  {
    slug: 'telegrambot-ai',
    name: 'TelegramBot AI',
    tagline: 'Userbot Telegram yang membalas dengan gaya tulisanmu.',
    summary:
      'Userbot Telegram berbasis Telethon yang membalas chat dengan AI, mempelajari gaya tulisan, menyimpan memori jangka panjang, dan mentranskripsikan pesan suara.',
    problem:
      'Membalas chat satu per satu membutuhkan waktu, sementara bot generik tidak memahami konteks percakapan.',
    approach:
      'Bot mempelajari gaya tulisan, menyimpan konteks, dan memakai agent tools agar balasan lebih sesuai dengan percakapan.',
    features: [
      'Balasan AI otomatis',
      'Mempelajari gaya tulisan',
      'Memori jangka panjang',
      'Agent tools',
      'Transkripsi pesan suara',
      'Balasan suara',
    ],
    category: 'AI & automasi',
    type: 'Userbot Telegram',
    stack: ['Python', 'Telethon', 'OpenAI-compatible API'],
    featured: true,
    order: 4,
  },
  {
    slug: 'remoteuniversal',
    name: 'RemoteUniversalDevice',
    tagline: 'Ponsel sebagai remote universal untuk smart TV.',
    summary:
      'Aplikasi Android native yang mengubah ponsel menjadi remote untuk smart TV dan perangkat yang kompatibel.',
    problem:
      'Remote fisik mudah hilang dan sering kali tidak kompatibel dengan perangkat lain di rumah.',
    approach:
      'Aplikasi Android native untuk mengendalikan perangkat yang mendukungnya, tanpa perlu remote fisik tambahan.',
    features: [
      'Remote universal',
      'Kontrol smart TV',
      'Android native',
      'Tanpa remote fisik tambahan',
    ],
    category: 'Android',
    type: 'Aplikasi Android',
    stack: ['Kotlin', 'Android'],
    featured: true,
    order: 5,
  },
  {
    slug: 'freebuff-patch',
    name: 'Freebuff Patch',
    tagline: 'Freebuff berjalan di Termux tanpa proot.',
    summary:
      'Patch dan toolkit untuk menjalankan AI coding agent Freebuff di Android/Termux tanpa proot, termasuk perbaikan glibc, penyimpanan konteks, dan pengaturan limit.',
    problem:
      'Freebuff dikirim sebagai binary ELF GNU/glibc yang tidak dapat berjalan di Termux tanpa proot.',
    approach:
      'Satu perintah memperbaiki dependensi glibc, menyiapkan konteks, dan menyesuaikan batasan di lingkungan Termux.',
    features: ['glibc tanpa proot', 'Setup satu perintah', 'Penyimpanan konteks', 'Penyesuaian limit'],
    category: 'Tools developer',
    type: 'Toolkit Android',
    stack: ['Shell', 'Termux', 'glibc', 'Node.js'],
    featured: false,
    order: 6,
  },
  {
    slug: 'agentbuff',
    name: 'AgentBuff',
    tagline: 'AI coding agent untuk Android dan Termux.',
    summary:
      'Versi Android dari agent CLI yang dioptimalkan untuk Termux: ringan dan cepat digunakan.',
    problem:
      'Agent CLI biasanya terlalu berat untuk dijalankan langsung di Android.',
    approach:
      'AgentBuff dioptimalkan untuk Termux dengan perintah ringkas dan penggunaan resource yang rendah.',
    features: [
      'Berjalan di Termux',
      'Ringan',
      'Perintah ringkas',
      'AI coding agent di Android',
    ],
    category: 'Tools developer',
    type: 'CLI Android',
    stack: ['TypeScript', 'Termux', 'Node.js'],
    featured: false,
    order: 7,
  },
  {
    slug: 'dikaroute-website',
    name: 'DikaRoute Website',
    tagline: 'Situs dan dokumentasi untuk DikaRoute.',
    summary:
      'Situs dan dokumentasi resmi DikaRoute dengan hero animasi, daftar provider, alur routing, dan delapan halaman dokumentasi.',
    problem:
      'Gateway dengan banyak fitur membutuhkan dokumentasi yang mudah dipahami developer baru.',
    approach:
      'Situs React dengan Tailwind CSS v4 dan Framer Motion, serta dokumentasi dengan sidebar dan daftar isi.',
    features: [
      'Hero animasi',
      'Daftar provider',
      'Alur routing',
      'Delapan halaman dokumentasi',
      'Sidebar dan daftar isi',
    ],
    category: 'Web',
    type: 'Situs produk dan dokumentasi',
    stack: ['React', 'TypeScript', 'Tailwind CSS v4', 'Framer Motion'],
    featured: false,
    order: 8,
  },
  {
    slug: 'pentesterbot-website',
    name: 'PentesterBot Website',
    tagline: 'Situs resmi PentesterBot v2.',
    summary:
      'Situs resmi PentesterBot v2 dengan UI bergaya fluid glass dan data dari source project bot.',
    problem:
      'Sebuah project bot membutuhkan halaman resmi yang menjelaskan kemampuan dan statusnya.',
    approach:
      'React, Vite, TypeScript, dan Express menyajikan data langsung dari source project bot.',
    features: [
      'UI fluid glass bergaya iOS',
      'Data dari source project',
      'React + Vite + TypeScript',
      'Server Express',
    ],
    category: 'Web',
    type: 'Situs produk',
    stack: ['React', 'Vite', 'TypeScript', 'Express'],
    featured: false,
    order: 9,
  },
  {
    slug: 'website',
    name: 'dikaofc.github.io',
    tagline: 'Portofolio sebelumnya, dibangun sebagai aplikasi React satu file.',
    summary:
      'Website portofolio DikaCode sebelumnya, dibuat dengan Vite, React, dan Tailwind sebagai situs multi-halaman.',
    problem:
      'Portofolio ini dibuat untuk menampilkan project dan layanan di satu tempat.',
    approach:
      'Setiap halaman dibuat sebagai satu file HTML dengan URL yang rapi tanpa ekstensi file.',
    features: ['Build satu file', 'Multi-halaman', 'URL rapi', 'React + Vite + Tailwind'],
    category: 'Web',
    type: 'Situs pribadi',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    featured: false,
    order: 10,
    link: {
      href: 'https://dikacode-orcin.vercel.app/',
      label: 'Lihat versi sebelumnya',
      external: true,
    },
    note: 'Versi ini sedang digantikan oleh website yang sedang kamu baca.',
  },
];

export const projectCategories: ProjectCategory[] = [
  'AI & automasi',
  'Keamanan & automasi',
  'Web',
  'Android',
  'Tools developer',
];

export const featuredProjects = projects
  .filter((project) => project.featured)
  .sort((a, b) => a.order - b.order);

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);

export const getNextProject = (slug: string) => {
  const currentIndex = projects.findIndex((project) => project.slug === slug);
  if (currentIndex === -1) return projects[0];
  return projects[(currentIndex + 1) % projects.length];
};
