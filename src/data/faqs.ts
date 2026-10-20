export type Faq = {
  question: string;
  questionId: string;
  answer: string;
  answerId: string;
};

export const faqs: Faq[] = [
  {
    question: 'How do I order a project?',
    questionId: 'Bagaimana cara memesan project?',
    answer:
      'Message me directly on Telegram @dikaacode. Describe what you need, we discuss the details (features, platform, time estimate), and you get a quote. If it fits, work starts.',
    answerId:
      'Hubungi saya melalui Telegram @dikaacode. Jelaskan kebutuhanmu, lalu kita bahas fitur, platform, estimasi waktu, dan harga sebelum pekerjaan dimulai.',
  },
  {
    question: 'How does payment work?',
    questionId: 'Bagaimana sistem pembayarannya?',
    answer:
      'Usually a deposit of about 50% to start the work, then the balance when the project is finished and approved. Other arrangements can be discussed case by case.',
    answerId:
      'Biasanya pembayaran awal sekitar 50% untuk memulai, lalu sisanya setelah project selesai dan disetujui. Pengaturan lain bisa dibicarakan sesuai kebutuhan.',
  },
  {
    question: 'How long does the work take?',
    questionId: 'Berapa lama pengerjaannya?',
    answer:
      'It depends on the scope. A landing page or company profile takes about 3 to 7 days, custom bots or tools about 1 to 2 weeks, and maintenance runs per contract. An exact estimate is given before starting.',
    answerId:
      'Waktunya bergantung pada lingkup pekerjaan. Landing page atau profil perusahaan sekitar 3–7 hari, bot atau tools custom sekitar 1–2 minggu, dan maintenance mengikuti kontrak. Estimasi pasti diberikan sebelum mulai.',
  },
  {
    question: 'Can I request revisions?',
    questionId: 'Bisa minta revisi?',
    answer:
      'Yes. Reasonable revisions agreed at the start are included in the work. The number and coverage are explained before the project starts so there are no surprises.',
    answerId:
      'Bisa. Revisi yang disepakati sejak awal termasuk dalam pekerjaan. Jumlah dan cakupannya dijelaskan sebelum project dimulai.',
  },
  {
    question: 'What technologies do you usually use?',
    questionId: 'Teknologi apa yang biasanya digunakan?',
    answer:
      'TypeScript, Node.js, React, Python, Kotlin, and whatever else fits the project. The final stack is agreed during planning.',
    answerId:
      'TypeScript, Node.js, React, Python, Kotlin, atau teknologi lain yang sesuai kebutuhan. Stack final disepakati saat perencanaan.',
  },
  {
    question: 'Is there a warranty or maintenance?',
    questionId: 'Apakah ada garansi atau maintenance?',
    answer:
      'Yes. Bug fixes during a short warranty period after delivery are included. For ongoing support there is a monthly maintenance package.',
    answerId:
      'Ada. Perbaikan bug selama masa garansi singkat setelah serah terima termasuk. Dukungan lanjutan tersedia melalui paket maintenance bulanan.',
  },
  {
    question: 'Can you build something outside the listed services?',
    questionId: 'Bisa mengerjakan kebutuhan di luar layanan yang tercantum?',
    answer:
      'Yes. Special needs like complex systems, unique features, or specific integrations can be discussed directly. As long as it makes sense, a solution gets found.',
    answerId:
      'Bisa. Kebutuhan khusus seperti sistem kompleks, fitur unik, atau integrasi tertentu dapat dibahas langsung.',
  },
  {
    question: 'What if I need extra features after the project is done?',
    questionId: 'Bagaimana jika saya butuh fitur tambahan setelah project selesai?',
    answer:
      'Features outside the original scope are quoted and agreed before they are built, so cost and time stay transparent on both sides.',
    answerId:
      'Fitur di luar lingkup awal akan dihitung dan disepakati lebih dulu supaya biaya dan waktu tetap jelas.',
  },
];
