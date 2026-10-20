export const facts = [
  { label: 'Base', labelId: 'Lokasi', value: 'Kendal, Central Java, Indonesia', valueId: 'Kendal, Jawa Tengah, Indonesia' },
  { label: 'Identity', labelId: 'Identitas', value: 'DikaGlorya / DikaOfc / DikaCode', valueId: 'DikaGlorya / DikaOfc / DikaCode' },
  { label: 'Focus', labelId: 'Fokus', value: 'AI, security automation, web development', valueId: 'AI, automasi keamanan, pengembangan web' },
  { label: 'Currently', labelId: 'Saat ini', value: 'AI gateway, bot automation, and Termux tools', valueId: 'AI gateway, automasi bot, dan tools Termux' },
] as const;

export const principles = [
  {
    title: 'Understand first, then change.',
    titleId: 'Pahami dulu sebelum mengubah.',
    body: 'Before touching a system, I read how it flows. A fix that ignores the root cause usually just moves the bug somewhere else.',
    bodyId: 'Sebelum menyentuh sistem, saya memahami alurnya. Perbaikan yang mengabaikan akar masalah biasanya hanya memindahkan bug.',
  },
  {
    title: 'Built by hand, tested until it works.',
    titleId: 'Dibuat dan diuji sampai berfungsi.',
    body: 'Every project is built from scratch, tested, and polished. Not a template stuck on and abandoned.',
    bodyId: 'Setiap proyek dibuat dari awal, diuji, dan dirapikan—bukan sekadar memasang template lalu ditinggalkan.',
  },
  {
    title: 'Scope and price are agreed up front.',
    titleId: 'Lingkup dan harga disepakati sejak awal.',
    body: 'Features, revisions, and limits are explained before work starts. No surprises in the middle of the project or at the end.',
    bodyId: 'Fitur, revisi, dan batasan dijelaskan sebelum pekerjaan dimulai. Tidak ada kejutan di tengah atau akhir proyek.',
  },
] as const;

export const processSteps = [
  {
    title: 'Chat',
    titleId: 'Diskusi',
    body: 'Tell me the idea, the problem, or the system you want built. Telegram is fastest.',
    bodyId: 'Ceritakan ide, masalah, atau sistem yang ingin dibuat. Telegram adalah cara tercepat.',
  },
  {
    title: 'Scope',
    titleId: 'Tentukan lingkup',
    body: 'We agree on features, platform, revisions, price, and an estimate.',
    bodyId: 'Kita sepakati fitur, platform, revisi, harga, dan estimasi.',
  },
  {
    title: 'Build',
    titleId: 'Pengerjaan',
    body: 'Work proceeds, with updates at the important points.',
    bodyId: 'Proyek dikerjakan dengan pembaruan pada tahap-tahap penting.',
  },
  {
    title: 'Ship',
    titleId: 'Serah terima',
    body: 'The project is tested, handed over, and enters a short bug-fix warranty period.',
    bodyId: 'Proyek diuji, diserahterimakan, lalu masuk masa garansi singkat untuk perbaikan bug.',
  },
] as const;
