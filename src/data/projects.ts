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
    tagline: 'One endpoint for many AI providers.',
    summary:
      'An OpenAI-compatible gateway that routes requests to whichever provider is available, with automatic fallback, compression, and caching.',
    problem:
      'When one provider goes down or hits a rate limit, the application stops with it. Switching providers usually means switching configuration and clients too.',
    approach:
      'DikaRoute puts several providers behind a single OpenAI-compatible endpoint. Requests are routed automatically, and when a provider fails, the request falls through to another one.',
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
  },
  {
    slug: 'pentesterbot',
    name: 'PentesterBot',
    tagline: 'Recon and scanning workflows from inside Telegram.',
    summary:
      'A Telegram bot for pentesting automation: recon and vulnerability scanning workflows.',
    problem:
      'Security work is often spread across terminals, tools, and notes. Moving between contexts makes the process slow.',
    approach:
      'PentesterBot wraps recon and tool execution into one structured chat flow, so a single command can lead into the next step.',
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
    problem:
      'Many coding agents depend on hosted backends and specific models. That limits model choice and adds cost.',
    approach:
      'ObitoBuff is a TypeScript monorepo that runs in the terminal and connects to any OpenAI-compatible model you choose, including Ollama, OpenRouter, or vLLM.',
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
    problem:
      'Answering chats one by one takes time, and generic bots have no context about the conversation.',
    approach:
      'The bot learns your writing style, stores memory, and uses agent tools so replies come back with the right context.',
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
    problem:
      'Physical remotes get lost easily and are often incompatible with other devices in the house.',
    approach:
      'A native Android app with universal control for devices that support it, so no extra physical remote is needed.',
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
    problem:
      'Freebuff ships as an ELF GNU/glibc binary that will not run in Termux without proot.',
    approach:
      'One command fixes the glibc dependencies, sets up the context, and reduces limits in the Termux environment.',
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
    problem:
      'Agent CLIs are usually too heavy to run directly on Android.',
    approach:
      'AgentBuff is optimized for Termux with compact commands and low resource use.',
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
    problem:
      'A gateway with many features needs documentation that a new developer can read quickly.',
    approach:
      'A React website with Tailwind CSS v4 and Framer Motion, plus documentation with a sidebar and table of contents.',
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
    problem:
      'A bot project needs an official page that explains its capabilities and status.',
    approach:
      'React, Vite, TypeScript, and Express serve data straight from the bot project source.',
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
    problem:
      'A portfolio was needed to show projects and services in one place.',
    approach:
      'Each page is built as a single HTML file with clean URLs and no file extensions.',
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
