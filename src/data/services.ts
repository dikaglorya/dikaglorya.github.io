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
    name: 'Website development',
    short: 'Websites that are tidy, fast, and responsive.',
    description:
      'Landing pages, company profiles, portfolios, and custom websites that are responsive and fast. Built on a clear structure, not a template slapped on.',
    includes: [
      'Landing pages',
      'Company profiles',
      'Portfolios',
      'Custom websites',
      'Responsive design',
      'Performance optimization',
    ],
    limits: [
      'Scope, revisions, and timeline are agreed before work starts',
      'Features beyond the initial scope are quoted separately',
    ],
    priceFrom: 'Rp150k',
    priceNote: 'Starting price, discussable with scope.',
    order: 1,
  },
  {
    slug: 'bot',
    name: 'Bot development',
    short: 'Bots that work the way your workflow does.',
    description:
      'Custom Telegram, WhatsApp, and Discord bots for automation, communities, and business. Not the template bot that everyone already has.',
    includes: [
      'Custom commands',
      'Automation',
      'API integration',
      'Databases',
      'Admin systems',
    ],
    platforms: ['Telegram', 'WhatsApp', 'Discord'],
    limits: [
      'Price depends on platform and features',
      'The final feature set is agreed before work starts',
    ],
    priceFrom: 'Rp100k',
    priceNote: 'Starting price, depends on platform and features.',
    order: 2,
  },
  {
    slug: 'tools',
    name: 'Custom tools',
    short: 'Custom tools for repetitive work.',
    description:
      'Custom tools, CLIs, utility software, and workflow automation. Built to follow your workflow, not the other way around.',
    includes: [
      'Custom tools',
      'Automation',
      'API integration',
      'CLI tools',
      'Utility software',
      'Workflow automation',
    ],
    limits: ['Price follows the complexity of the tool', 'The workflow is agreed first'],
    priceFrom: 'Rp150k',
    priceNote: 'Starting price, set by the complexity of the tool.',
    order: 3,
  },
  {
    slug: 'repairs',
    name: 'Repairs & maintenance',
    short: 'Stepping into an existing system and fixing the root.',
    description:
      'Bug fixes, error hunting, maintenance, optimization, refactoring, and feature work for systems that already exist, including projects that stopped halfway.',
    includes: [
      'Bug fixes',
      'Error fixes',
      'Maintenance',
      'Feature development',
      'Optimization',
      'Refactoring',
    ],
    limits: [
      'The monthly rate covers ongoing maintenance',
      'One-off fixes are priced from the scope',
    ],
    priceFrom: 'Rp50k/mo',
    priceNote: 'For monthly maintenance. One-off fixes are priced from scope.',
    order: 4,
  },
];

export const getService = (slug: string) => services.find((service) => service.slug === slug);
