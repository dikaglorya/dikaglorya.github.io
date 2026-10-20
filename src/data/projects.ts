export type ProjectCategory =
  | 'AI & automation'
  | 'Security & automation'
  | 'Web'
  | 'Android'
  | 'Developer tools';

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
  summaryId: string;
  problem: string;
  problemId: string;
  approach: string;
  approachId: string;
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
    tagline: 'One endpoint for many AI providers.',
    summary:
      'An OpenAI-compatible gateway that routes requests to whichever provider is available, with automatic fallback, compression, and caching.',
    summaryId:
      'Gateway kompatibel OpenAI untuk meneruskan permintaan ke provider yang tersedia, dengan fallback otomatis, kompresi, dan cache.',
    problem:
      'When one provider goes down or hits a rate limit, the application stops with it. Switching providers usually means switching configuration and clients too.',
    problemId:
      'Saat satu provider bermasalah atau mencapai batas request, aplikasi ikut berhenti. Pindah provider biasanya juga berarti mengubah konfigurasi dan client.',
    approach:
      'DikaRoute puts several providers behind a single OpenAI-compatible endpoint. Requests are routed automatically, and when a provider fails, the request falls through to another one.',
    approachId:
      'DikaRoute menyatukan beberapa provider di balik satu endpoint kompatibel OpenAI. Request diarahkan otomatis ke provider lain saat provider aktif gagal.',
    features: [
      'Single OpenAI-compatible endpoint',
      'Multi-provider routing',
      'Automatic fallback when providers fail or rate-limit',
      'Request compression',
      'Response caching',
    ],
    category: 'AI & automation',
    type: 'AI gateway',
    stack: ['TypeScript', 'Node.js', 'OpenAI API'],
    featured: true,
    order: 1,
    link: {
      href: 'https://www.npmjs.com/package/dikaroute',
      label: 'dikaroute on npm',
      external: true,
      kind: 'package',
    },
    note: 'The published package is installable, but the GitHub repository it points at is no longer public, so this page is the only place the design is written down.',
  },
  {
    slug: 'pentesterbot',
    name: 'PentesterBot',
    tagline: 'Recon and scanning workflows from inside Telegram.',
    summary:
      'A Telegram bot for pentesting automation: recon and vulnerability scanning workflows.',
    summaryId:
      'Bot Telegram untuk mengotomatiskan alur pentest, termasuk recon dan pemindaian kerentanan.',
    problem:
      'Security work is often spread across terminals, tools, and notes. Moving between contexts makes the process slow.',
    problemId:
      'Pekerjaan keamanan sering tersebar di terminal, berbagai tool, dan catatan, sehingga berpindah konteks memperlambat proses.',
    approach:
      'PentesterBot wraps recon and tool execution into one structured chat flow, so a single command can lead into the next step.',
    approachId:
      'PentesterBot menyusun recon dan eksekusi tool dalam alur chat terstruktur, sehingga satu perintah bisa melanjutkan ke langkah berikutnya.',
    features: [
      'Automated recon',
      'Run tools from chat',
      'Vulnerability scanning workflows',
      'Quick access without switching terminals',
    ],
    category: 'Security & automation',
    type: 'Telegram bot',
    stack: ['JavaScript', 'Node.js', 'Telegram Bot API'],
    featured: true,
    order: 2,
  },
  {
    slug: 'obitobuff',
    name: 'ObitoBuff CLI',
    tagline: 'An AI coding agent that runs on your own models.',
    summary:
      'A terminal AI coding agent with sub-agents for file finding, editing, bash, research, and code review. Runs 100% locally with no backend.',
    summaryId:
      'AI coding agent di terminal dengan sub-agent untuk mencari dan mengedit file, menjalankan shell, riset, dan code review. Berjalan lokal tanpa backend.',
    problem:
      'Many coding agents depend on hosted backends and specific models. That limits model choice and adds cost.',
    problemId:
      'Banyak coding agent bergantung pada backend ter-host dan model tertentu, sehingga pilihan model terbatas dan biaya bertambah.',
    approach:
      'ObitoBuff is a TypeScript monorepo that runs in the terminal and connects to any OpenAI-compatible model you choose, including Ollama, OpenRouter, or vLLM.',
    approachId:
      'ObitoBuff adalah monorepo TypeScript yang berjalan di terminal dan terhubung ke model kompatibel OpenAI pilihanmu, termasuk Ollama, OpenRouter, atau vLLM.',
    features: [
      'Sub-agents for file finding, editing, bash, research, and code review',
      'Runs 100% locally',
      'No backend',
      'Supports OpenAI-compatible models',
    ],
    category: 'Developer tools',
    type: 'CLI / AI agent',
    stack: ['TypeScript', 'Bun', 'OpenAI-compatible API'],
    featured: true,
    order: 3,
  },
  {
    slug: 'telegrambot-ai',
    name: 'TelegramBot AI',
    tagline: 'A Telegram userbot that replies in your own style.',
    summary:
      'A Telethon-based Telegram userbot that answers chats with AI, learns your writing style, keeps long-term memory, and can transcribe voice notes.',
    summaryId:
      'Userbot Telegram berbasis Telethon yang membalas chat dengan AI, mempelajari gaya tulisan, menyimpan memori jangka panjang, dan mentranskripsikan pesan suara.',
    problem:
      'Answering chats one by one takes time, and generic bots have no context about the conversation.',
    problemId:
      'Membalas chat satu per satu membutuhkan waktu, sementara bot generik tidak memahami konteks percakapan.',
    approach:
      'The bot learns your writing style, stores memory, and uses agent tools so replies come back with the right context.',
    approachId:
      'Bot mempelajari gaya tulisan, menyimpan konteks, dan memakai agent tools agar balasan lebih sesuai dengan percakapan.',
    features: [
      'Automatic AI replies',
      'Learns writing style',
      'Long-term memory',
      'Agent tools',
      'Voice note transcription',
      'Voice replies',
    ],
    category: 'AI & automation',
    type: 'Telegram userbot',
    stack: ['Python', 'Telethon', 'OpenAI-compatible API'],
    featured: true,
    order: 4,
  },
  {
    slug: 'remoteuniversal',
    name: 'RemoteUniversalDevice',
    tagline: 'Your phone as a universal remote for smart TVs.',
    summary:
      'A native Android app that turns a phone into a remote for smart TVs and compatible devices.',
    summaryId:
      'Aplikasi Android native yang mengubah ponsel menjadi remote untuk smart TV dan perangkat yang kompatibel.',
    problem:
      'Physical remotes get lost easily and are often incompatible with other devices in the house.',
    problemId:
      'Remote fisik mudah hilang dan sering kali tidak kompatibel dengan perangkat lain di rumah.',
    approach:
      'A native Android app with universal control for devices that support it, so no extra physical remote is needed.',
    approachId:
      'Aplikasi Android native untuk mengendalikan perangkat yang mendukungnya, tanpa perlu remote fisik tambahan.',
    features: [
      'Universal remote',
      'Smart TV control',
      'Native Android',
      'No extra physical remote',
    ],
    category: 'Android',
    type: 'Android app',
    stack: ['Kotlin', 'Android'],
    featured: true,
    order: 5,
  },
  {
    slug: 'freebuff-patch',
    name: 'Freebuff Patch',
    tagline: 'Freebuff running on Termux without proot.',
    summary:
      'Patches and a toolkit for running Freebuff, a free AI coding agent, on Android/Termux without proot. Includes a no-proot glibc fix, context saving, and anti-limit settings.',
    summaryId:
      'Patch dan toolkit untuk menjalankan AI coding agent Freebuff di Android/Termux tanpa proot, termasuk perbaikan glibc, penyimpanan konteks, dan pengaturan limit.',
    problem:
      'Freebuff ships as an ELF GNU/glibc binary that will not run in Termux without proot.',
    problemId:
      'Freebuff dikirim sebagai binary ELF GNU/glibc yang tidak dapat berjalan di Termux tanpa proot.',
    approach:
      'One command fixes the glibc dependencies, sets up the context, and reduces limits in the Termux environment.',
    approachId:
      'Satu perintah memperbaiki dependensi glibc, menyiapkan konteks, dan menyesuaikan batasan di lingkungan Termux.',
    features: ['No-proot glibc', 'One-command setup', 'Context saving', 'Anti-limit'],
    category: 'Developer tools',
    type: 'Android toolkit',
    stack: ['Shell', 'Termux', 'glibc', 'Node.js'],
    featured: false,
    order: 6,
  },
  {
    slug: 'agentbuff',
    name: 'AgentBuff',
    tagline: 'An AI coding agent for Android and Termux.',
    summary:
      'The Android version of the agent CLI, optimized for Termux: light on resources and quick to type.',
    summaryId:
      'Versi Android dari agent CLI yang dioptimalkan untuk Termux: ringan dan cepat digunakan.',
    problem:
      'Agent CLIs are usually too heavy to run directly on Android.',
    problemId:
      'Agent CLI biasanya terlalu berat untuk dijalankan langsung di Android.',
    approach:
      'AgentBuff is optimized for Termux with compact commands and low resource use.',
    approachId:
      'AgentBuff dioptimalkan untuk Termux dengan perintah ringkas dan penggunaan resource yang rendah.',
    features: [
      'Runs in Termux',
      'Light on resources',
      'Compact commands',
      'AI coding agent on Android',
    ],
    category: 'Developer tools',
    type: 'Android CLI',
    stack: ['TypeScript', 'Termux', 'Node.js'],
    featured: false,
    order: 7,
  },
  {
    slug: 'dikaroute-website',
    name: 'DikaRoute Website',
    tagline: 'Website and documentation for DikaRoute.',
    summary:
      'The official DikaRoute website and documentation, with an animated hero, a provider marquee, the routing pipeline, and 8 documentation pages.',
    summaryId:
      'Situs dan dokumentasi resmi DikaRoute dengan hero animasi, daftar provider, alur routing, dan delapan halaman dokumentasi.',
    problem:
      'A gateway with many features needs documentation that a new developer can read quickly.',
    problemId:
      'Gateway dengan banyak fitur membutuhkan dokumentasi yang mudah dipahami developer baru.',
    approach:
      'A React website with Tailwind CSS v4 and Framer Motion, plus documentation with a sidebar and table of contents.',
    approachId:
      'Situs React dengan Tailwind CSS v4 dan Framer Motion, serta dokumentasi dengan sidebar dan daftar isi.',
    features: [
      'Animated hero',
      'Provider marquee',
      'Routing pipeline',
      '8 documentation pages',
      'Sidebar and table of contents',
    ],
    category: 'Web',
    type: 'Product site / docs',
    stack: ['React', 'TypeScript', 'Tailwind CSS v4', 'Framer Motion'],
    featured: false,
    order: 8,
  },
  {
    slug: 'pentesterbot-website',
    name: 'PentesterBot Website',
    tagline: 'The official PentesterBot v2 website.',
    summary:
      'The official PentesterBot v2 website with an iOS-style fluid glass UI and real data from the bot project source.',
    summaryId:
      'Situs resmi PentesterBot v2 dengan UI bergaya fluid glass dan data dari source project bot.',
    problem:
      'A bot project needs an official page that explains its capabilities and status.',
    problemId:
      'Sebuah project bot membutuhkan halaman resmi yang menjelaskan kemampuan dan statusnya.',
    approach:
      'React, Vite, TypeScript, and Express serve data straight from the bot project source.',
    approachId:
      'React, Vite, TypeScript, dan Express menyajikan data langsung dari source project bot.',
    features: [
      'iOS-style fluid glass UI',
      'Data from the project source',
      'React + Vite + TypeScript',
      'Express server',
    ],
    category: 'Web',
    type: 'Product site',
    stack: ['React', 'Vite', 'TypeScript', 'Express'],
    featured: false,
    order: 9,
  },
  {
    slug: 'website',
    name: 'dikaofc.github.io',
    tagline: 'The previous portfolio, built as a single-file React app.',
    summary:
      'The previous DikaCode portfolio website: Vite + React + Tailwind, single-file build, and multi-page.',
    summaryId:
      'Website portofolio DikaCode sebelumnya, dibuat dengan Vite, React, dan Tailwind sebagai situs multi-halaman.',
    problem:
      'A portfolio was needed to show projects and services in one place.',
    problemId:
      'Portofolio ini dibuat untuk menampilkan project dan layanan di satu tempat.',
    approach:
      'Each page is built as a single HTML file with clean URLs and no file extensions.',
    approachId:
      'Setiap halaman dibuat sebagai satu file HTML dengan URL yang rapi tanpa ekstensi file.',
    features: ['Single-file build', 'Multi-page', 'Clean URLs', 'React + Vite + Tailwind'],
    category: 'Web',
    type: 'Personal site',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    featured: false,
    order: 10,
    link: {
      href: 'https://dikacode-orcin.vercel.app/',
      label: 'See the previous version',
      external: true,
    },
    note: 'This version is being replaced by the website you are reading.',
  },
];

export const projectCategories: ProjectCategory[] = [
  'AI & automation',
  'Security & automation',
  'Web',
  'Android',
  'Developer tools',
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
