export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  code?: string;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number;
  tags: string[];
  sections: ArticleSection[];
};

export const articles: Article[] = [
  {
    slug: 'small-static-portfolio-architecture',
    title: 'Arsitektur portofolio statis yang sederhana dan mudah dirawat',
    description:
      'Mengenal metadata halaman bersama, route project berbasis data, sitemap otomatis, dan trade-off portofolio statis dengan Astro.',
    date: '2026-10-20',
    readingTime: 5,
    tags: ['Astro', 'Situs statis', 'SEO'],
    sections: [
      {
        heading: 'Masalahnya: portofolio bisa berubah menjadi tumpukan halaman terpisah',
        paragraphs: [
          'Portofolio membutuhkan halaman proyek, informasi identitas yang jelas, dan metadata untuk pencarian. Menyalin detail tersebut ke setiap halaman membuat judul, nama penulis, URL kanonis, dan tautan sosial mudah berbeda satu sama lain.',
          'Situs ini dibuat dengan Astro sebagai HTML statis. Tujuannya bukan mengklaim skor performa, tetapi menjaga konten dan aturan halaman tetap mudah dipahami, lalu memastikan route yang diterbitkan dapat diperiksa saat proses build.',
        ],
      },
      {
        heading: 'Simpan identitas situs dan metadata bersama di satu tempat',
        paragraphs: [
          'Identitas situs disimpan di `src/data/site.ts`. Layout bersama membaca data tersebut untuk menghasilkan metadata canonical, Open Graph, Twitter, dan structured data. Halaman tetap dapat memberikan judul, deskripsi, dan schema khusus tanpa menggandakan entitas Person dan WebSite global.',
          'Pemisahan ini membantu membedakan nama utama seseorang, brand website ObitoGlory, dan origin kanonis. Nama alternatif menjelaskan satu orang; website tetap menjadi entitas tersendiri.',
        ],
        code: `// origin comes from astro.config.mjs (Astro.site), so no page hardcodes a host
const canonicalURL = new URL(canonicalPath, Astro.site);

const personSchema = {
  '@type': 'Person',
  '@id': \`\${origin}/#person\`,
  name: 'DikaGlorya',
  alternateName: ['DikaGlory', 'DikaCode', 'DikaOfc'],
  url: origin,
};`,
      },
      {
        heading: 'Buat halaman proyek berulang dari data terstruktur',
        paragraphs: [
          'Ringkasan proyek disimpan di `src/data/projects.ts`. Astro membuat setiap route detail proyek dari daftar tersebut, sehingga judul, deskripsi, detail teknologi, dan URL proyek mengacu ke entri yang sama.',
          'Route berbasis data hanya berguna jika sumber datanya akurat. Portofolio tidak menampilkan tautan repositori atau demo kecuali tujuan nyatanya tersedia; deskripsi proyek bukan bukti bahwa source code-nya publik.',
        ],
        code: `export function getStaticPaths() {
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}`,
      },
      {
        heading: 'Buat sitemap mengikuti sumber konten yang sama',
        paragraphs: [
          'Sitemap dihasilkan dari route statis serta data proyek dan artikel. Karena itu, menambahkan konten nyata juga menambahkan URL kanonisnya ke hasil build yang sama, tanpa mengandalkan daftar manual yang bisa kedaluwarsa.',
          'Repositori ini juga memiliki skrip pemeriksa tautan yang mencocokkan tautan internal dan URL sitemap dengan file hasil `dist/`. Ini menangkap tujuan lokal yang hilang, tetapi tidak membuktikan bahwa situs pihak ketiga akan selalu aktif.',
        ],
        code: `const paths = [
  ...staticPaths,
  ...projects.map((project) => \`/projects/\${project.slug}/\`),
  ...articles.map((article) => \`/journal/\${article.slug}/\`),
];`,
      },
      {
        heading: 'Ketahui kapan publikasi statis bukan pilihan yang tepat',
        paragraphs: [
          'Output statis menghindari server konten saat runtime untuk halaman ini dan menyederhanakan deployment. Konsekuensinya, perubahan konten memerlukan build dan deploy; repositori ini tidak memiliki editor atau alur publikasi langsung.',
          'Pilihan ini cocok untuk portofolio kecil dan jurnal sederhana. Jika volume publikasi atau kebutuhan kolaborasi meningkat, alur konten sebaiknya ditinjau berdasarkan kebutuhan tersebut, bukan menambahkan CMS terlalu dini.',
        ],
      },
      {
        heading: 'Hal yang dibuktikan dan tidak dibuktikan',
        paragraphs: [
          'Implementasi ini menunjukkan cara repositori berbagi metadata identitas, membuat route konten, dan memeriksa tautan statisnya sendiri. Ini tidak membuktikan peringkat pencarian, peningkatan kecepatan yang terukur, ataupun adopsi oleh developer lain.',
          'Langkah berikutnya yang bermanfaat adalah merilis proyek nyata beserta dokumentasinya, lalu memakai data pencarian dan masukan yang menjaga privasi untuk menentukan perbaikan.',
        ],
      },
    ],
  },
  {
    slug: 'static-contact-form-mailto-handoff',
    title: 'Formulir kontak tanpa backend: validasi lokal dan pengiriman lewat mailto',
    description:
      'Cara kerja formulir kontak ObitoGlory di situs statis: validasi lokal, draft mailto, fallback untuk browser sandbox, dan batasan yang perlu diketahui.',
    date: '2026-10-20',
    readingTime: 6,
    tags: ['Astro', 'Formulir', 'Situs statis'],
    sections: [
      {
        heading: 'Masalahnya: situs statis tidak memiliki kotak masuk',
        paragraphs: [
          'Situs ini di-host sebagai file statis, jadi tidak ada server yang dikendalikan origin untuk menerima POST formulir. Formulir kontak memiliki tiga pilihan realistis: layanan formulir pihak ketiga, endpoint yang di-host sendiri, atau tidak menyediakan formulir.',
          'Layanan pihak ketiga membutuhkan skrip eksternal, akun, dan kebijakan privasi yang perlu ditinjau. Backend membuat portofolio statis memiliki log, penyaringan spam, dan kebutuhan pemeliharaan. Pilihan di sini adalah jalan tengah: formulir menyusun brief terstruktur lalu menyerahkannya lewat mailto ke aplikasi email yang sudah digunakan pengunjung. Alamat email tetap ditampilkan di halaman, jadi tidak ada informasi baru yang dibuka.',
        ],
      },
      {
        heading: 'Pertahankan formulir yang tetap berfungsi tanpa JavaScript',
        paragraphs: [
          'Elemen formulir mendeklarasikan fallback sebelum skrip apa pun berjalan: aksi mailto dengan encoding text/plain. Jika skrip tidak pernah dimuat, browser tetap mencoba pengiriman mailto bawaan. Hasilnya berbeda-beda antarbrowser dan tidak selalu mulus, tetapi tetap menyediakan jalur dasar.',
        ],
        code: `<form
  action="mailto:dikasukasukaa@gmail.com"
  method="post"
  enctype="text/plain"
  novalidate
  data-contact-form
  data-contact-email={site.email}
>`,
      },
      {
        heading: 'Tangani submit dan validasi secara lokal',
        paragraphs: [
          'Atribut novalidate menonaktifkan pesan bawaan agar handler kustom selalu berjalan. checkValidity dan reportValidity mempertahankan perilaku bawaan yang penting: fokus berpindah ke kolom tidak valid pertama dan browser menjelaskan kesalahannya. Baris status menyampaikan pesan dengan gaya bahasa yang konsisten di seluruh halaman.',
          'Satu detail migrasi: pilihan layanan dinormalisasi lebih dulu dari query string. URL Indonesia lama seperti ?service=perbaikan dipetakan ke repairs, sehingga tautan lama tetap memilih opsi yang tepat dan tidak gagal tanpa penjelasan.',
        ],
        code: `form.addEventListener('submit', (event) => {
  if (!form.checkValidity()) {
    event.preventDefault();
    form.reportValidity();
    setStatus('Lengkapi kolom wajib terlebih dahulu.', true);
    return;
  }
  event.preventDefault();
  // ...susun draft mailto dari FormData
});`,
      },
      {
        heading: 'Susun draft lalu serahkan ke aplikasi email',
        paragraphs: [
          'Nilai diambil dari FormData dan dirapikan dengan cara yang sama, apa pun kolom sumbernya. Subjek dan isi disusun menjadi teks biasa yang mudah dibaca; kedua nilai query melewati encodeURIComponent agar baris baru dan ampersand di dalam pesan tidak merusak URL mailto.',
        ],
        code: `const subject = \`Brief proyek: \${service} - \${name}\`;
const body = [
  \`Nama: \${name}\`,
  \`Email: \${email}\`,
  \`Layanan: \${service}\`,
  \`Anggaran: \${budget || 'Belum ditentukan'}\`,
  '',
  'Pesan:',
  message,
].join('\\n');
const mailto = \`mailto:\${formEmail}?subject=\${encodeURIComponent(subject)}&body=\${encodeURIComponent(body)}\`;`,
      },
      {
        heading: 'Fallback yang wajib tersedia',
        paragraphs: [
          'Navigasi mailto yang dimulai skrip diblokir oleh sebagian browser sandbox dan webview tertanam. Baris status yang hanya mengatakan "membuka email" akan mengklaim tindakan yang sebenarnya mungkin tidak terjadi.',
          'Karena itu, baris status menambahkan elemen tautan nyata dengan href draft yang sudah disiapkan. Apa pun keputusan lingkungan terhadap window.location, pengunjung tetap memiliki tautan yang dapat diklik menuju draft yang sama. Elemen status memakai role="status" dengan aria-live="polite", sementara tombol salin email memiliki jalur gagal sendiri: jika Clipboard API menolak permintaan, status meminta pengguna menyalin alamat secara manual.',
        ],
        code: `const draftLink = document.createElement('a');
draftLink.href = mailto;
draftLink.textContent = formEmail;
setStatus('Membuka aplikasi email. Jika tidak terbuka, gunakan draft berikut:', false, draftLink);
window.location.href = mailto;`,
      },
      {
        heading: 'Hal yang sudah diverifikasi dan yang belum',
        paragraphs: [
          'Bagian yang dapat diverifikasi ada di repositori ini: pemeriksaan tipe dan build berhasil, pemeriksa tautan internal berhasil, dan catatan pemeriksaan manual menunjukkan submit kosong ditolak dengan status kolom wajib, fokus berpindah ke kolom tidak valid pertama, submit yang terisi menyiapkan draft yang tepat, serta tidak ada error console.',
          'Bagian yang tidak dapat diverifikasi adalah pengiriman. Aplikasi email menentukan apakah pesan benar-benar dikirim; situs tidak menyimpan bukti penerimaan, log, ataupun penghitung. Itulah komprominya agar pesan pribadi tidak melibatkan pihak ketiga.',
        ],
      },
      {
        heading: 'Batasan dan kapan solusi ini perlu diganti',
        paragraphs: [
          'Setiap aplikasi email menafsirkan subjek dan isi mailto secara berbeda: sebagian menghapus baris baru, sebagian mengabaikan isian awal, dan tidak ada yang menerima lampiran. Submit tidak disimpan di mana pun, jadi brief yang tidak dikirim pengunjung tidak meninggalkan jejak di kedua sisi. Alamat email yang dipublikasikan juga dapat dipanen seperti alamat publik lainnya.',
          'Untuk volume saat ini, hal-hal tersebut belum menjadi alasan untuk menambahkan backend. Penggantian baru masuk akal ketika ada kebutuhan nyata: endpoint yang berfungsi jika spam atau volume membenarkannya, atau hosting sendiri yang bisa menerima POST. Sampai saat itu, teks formulir menjelaskan dengan tepat apa yang terjadi: situs ini tidak mengirim apa pun ke server.',
        ],
      },
      {
        heading: 'Lokasi implementasi',
        paragraphs: [
          'Formulir tersedia di /contact/. Implementasinya berada di src/scripts/contact.ts dalam repositori website ini (github.com/dikaglorya/dikaglorya.github.io), sedangkan kompromi arsitekturnya dijelaskan di artikel terkait tentang struktur portofolio statis yang menaungi jurnal ini.',
        ],
      },
    ],
  },
];
