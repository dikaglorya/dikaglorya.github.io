export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: 'How do I order a project?',
    answer:
      'Message me directly on Telegram @dikaacode. Describe what you need, we discuss the details (features, platform, time estimate), and you get a quote. If it fits, work starts.',
  },
  {
    question: 'How does payment work?',
    answer:
      'Usually a deposit of about 50% to start the work, then the balance when the project is finished and approved. Other arrangements can be discussed case by case.',
  },
  {
    question: 'How long does the work take?',
    answer:
      'It depends on the scope. A landing page or company profile takes about 3 to 7 days, custom bots or tools about 1 to 2 weeks, and maintenance runs per contract. An exact estimate is given before starting.',
  },
  {
    question: 'Can I request revisions?',
    answer:
      'Yes. Reasonable revisions agreed at the start are included in the work. The number and coverage are explained before the project starts so there are no surprises.',
  },
  {
    question: 'What technologies do you usually use?',
    answer:
      'TypeScript, Node.js, React, Python, Kotlin, and whatever else fits the project. The final stack is agreed during planning.',
  },
  {
    question: 'Is there a warranty or maintenance?',
    answer:
      'Yes. Bug fixes during a short warranty period after delivery are included. For ongoing support there is a monthly maintenance package.',
  },
  {
    question: 'Can you build something outside the listed services?',
    answer:
      'Yes. Special needs like complex systems, unique features, or specific integrations can be discussed directly. As long as it makes sense, a solution gets found.',
  },
  {
    question: 'What if I need extra features after the project is done?',
    answer:
      'Features outside the original scope are quoted and agreed before they are built, so cost and time stay transparent on both sides.',
  },
];
