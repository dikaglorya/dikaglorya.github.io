export const technologyGroups = [
  {
    title: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'Kotlin', 'Shell'],
  },
  {
    title: 'Frameworks',
    items: ['Astro', 'React', 'Vite', 'Tailwind CSS', 'Node.js'],
  },
  {
    title: 'Tools',
    items: ['OpenAI-compatible APIs', 'Telegram Bot API', 'Telethon', 'Express'],
  },
  {
    title: 'Infrastructure',
    items: ['Linux', 'Termux', 'Docker', 'Git', 'glibc'],
  },
] as const;

export const currentFocus = [
  'AI gateway and model routing',
  'Bot automation for Telegram and Discord',
  'Tools for Android and Termux',
  'Web performance and accessibility',
] as const;
