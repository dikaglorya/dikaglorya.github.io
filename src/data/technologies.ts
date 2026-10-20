export const technologyGroups = [
  {
    title: 'Bahasa pemrograman',
    items: ['TypeScript', 'JavaScript', 'Python', 'Kotlin', 'Shell'],
  },
  {
    title: 'Framework dan runtime',
    items: ['Astro', 'React', 'Vite', 'Tailwind CSS', 'Node.js'],
  },
  {
    title: 'Tools',
    items: ['OpenAI-compatible APIs', 'Telegram Bot API', 'Telethon', 'Express'],
  },
  {
    title: 'Infrastruktur',
    items: ['Linux', 'Termux', 'Docker', 'Git', 'glibc'],
  },
] as const;

export const currentFocus = [
  'AI gateway dan routing model',
  'Automasi bot Telegram dan Discord',
  'Tools untuk Android dan Termux',
  'Performa dan aksesibilitas web',
] as const;
