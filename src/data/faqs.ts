export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: 'Bagaimana cara memesan project?',
    answer:
      'Hubungi saya melalui Telegram @dikaacode. Jelaskan kebutuhanmu, lalu kita bahas fitur, platform, estimasi waktu, dan harga sebelum pekerjaan dimulai.',
  },
  {
    question: 'Bagaimana sistem pembayarannya?',
    answer:
      'Biasanya pembayaran awal sekitar 50% untuk memulai, lalu sisanya setelah project selesai dan disetujui. Pengaturan lain bisa dibicarakan sesuai kebutuhan.',
  },
  {
    question: 'Berapa lama pengerjaannya?',
    answer:
      'Waktunya bergantung pada lingkup pekerjaan. Landing page atau profil perusahaan sekitar 3 sampai 7 hari, bot atau tools custom sekitar 1 sampai 2 minggu, dan maintenance mengikuti kontrak. Estimasi pasti diberikan sebelum mulai.',
  },
  {
    question: 'Bisa minta revisi?',
    answer:
      'Bisa. Revisi yang disepakati sejak awal termasuk dalam pekerjaan. Jumlah dan cakupannya dijelaskan sebelum project dimulai.',
  },
  {
    question: 'Teknologi apa yang biasanya digunakan?',
    answer:
      'TypeScript, Node.js, React, Python, Kotlin, atau teknologi lain yang sesuai kebutuhan. Stack final disepakati saat perencanaan.',
  },
  {
    question: 'Apakah ada garansi atau maintenance?',
    answer:
      'Ada. Perbaikan bug selama masa garansi singkat setelah serah terima termasuk. Dukungan lanjutan tersedia melalui paket maintenance bulanan.',
  },
  {
    question: 'Bisa mengerjakan kebutuhan di luar layanan yang tercantum?',
    answer:
      'Bisa. Kebutuhan khusus seperti sistem kompleks, fitur unik, atau integrasi tertentu dapat dibahas langsung.',
  },
  {
    question: 'Bagaimana jika saya butuh fitur tambahan setelah project selesai?',
    answer:
      'Fitur di luar lingkup awal akan dihitung dan disepakati lebih dulu supaya biaya dan waktu tetap jelas.',
  },
];
