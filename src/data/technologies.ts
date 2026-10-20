export const technologyGroups = [
  {
    title: 'Languages',
    titleId: 'Bahasa pemrograman',
    items: ['TypeScript', 'JavaScript', 'Python', 'Kotlin', 'Shell'],
  },
  {
    title: 'Frameworks',
    titleId: 'Framework dan runtime',
    items: ['Astro', 'React', 'Vite', 'Tailwind CSS', 'Node.js'],
  },
  {
    title: 'Tools',
    titleId: 'Tools',
    items: ['OpenAI-compatible APIs', 'Telegram Bot API', 'Telethon', 'Express'],
  },
  {
    title: 'Infrastructure',
    titleId: 'Infrastruktur',
    items: ['Linux', 'Termux', 'Docker', 'Git', 'glibc'],
  },
] as const;

export const currentFocus = [
  { en: 'AI gateway and model routing', id: 'AI gateway dan routing model' },
  { en: 'Bot automation for Telegram and Discord', id: 'Automasi bot Telegram dan Discord' },
  { en: 'Tools for Android and Termux', id: 'Tools untuk Android dan Termux' },
  { en: 'Web performance and accessibility', id: 'Performa dan aksesibilitas web' },
] as const;
