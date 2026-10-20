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
    title: 'Formulir kontak tanpa backend: brief HTML lewat clipboard dan fallback mailto',
    description:
      'Cara kerja formulir kontak ObitoGlory di situs statis: validasi lokal, brief HTML yang disalin ke clipboard untuk Gmail, fallback mailto, dan batasan yang perlu diketahui.',
    date: '2026-10-20',
    readingTime: 7,
    tags: ['Astro', 'Formulir', 'Situs statis'],
    sections: [
      {
        heading: 'Masalahnya: situs statis tidak memiliki kotak masuk',
        paragraphs: [
          'Situs ini di-host sebagai file statis, jadi tidak ada server yang dikendalikan origin untuk menerima POST formulir. Formulir kontak memiliki tiga pilihan realistis: layanan formulir pihak ketiga, endpoint yang di-host sendiri, atau tidak menyediakan formulir.',
          'Layanan pihak ketiga membutuhkan skrip eksternal, akun, dan kebijakan privasi yang perlu ditinjau. Backend membuat portofolio statis memiliki log, penyaringan spam, dan kebutuhan pemeliharaan. Pilihan di sini adalah jalan tengah: formulir menyusun brief terstruktur, menyalin versi HTML ke clipboard, lalu menyerahkannya lewat Gmail atau mailto ke aplikasi email yang sudah digunakan pengunjung. Alamat email tetap ditampilkan di halaman, jadi tidak ada informasi baru yang dibuka.',
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
        heading: 'Susun brief HTML lalu salin ke clipboard',
        paragraphs: [
          'Brief disusun dari FormData dan dirapikan dengan cara yang sama, apa pun kolom sumbernya. Tautan mailto dan URL compose Gmail hanya membawa teks biasa, jadi keduanya tidak bisa membuka draft berformat HTML. Jalur yang dipakai adalah Clipboard API: brief dibuat sebagai tabel HTML dengan inline style, lalu ditulis ke clipboard dalam dua representasi sekaligus, text/html dan text/plain.',
          'Representasi HTML mengikuti batasan Gmail: tabel untuk layout, inline style, tanpa flexbox, grid, atau style block. Representasi teks biasa menjadi fallback untuk aplikasi email yang tidak menerima HTML. Subjek tetap melewati encodeURIComponent karena ampersand dan spasi di dalamnya harus aman di URL.',
        ],
        code: `const item = new ClipboardItem({
  'text/html': new Blob([buildBriefFragment(data)], { type: 'text/html' }),
  'text/plain': new Blob([buildBriefText(data)], { type: 'text/plain' }),
});
await navigator.clipboard.write([item]);`,
      },
      {
        heading: 'Fallback yang wajib tersedia',
        paragraphs: [
          'Clipboard API tidak selalu tersedia. Browser sandbox, webview tertanam, konteks non-HTTPS, atau izin yang ditolak bisa membuat penulisan gagal. Karena itu handler mencoba rich HTML lebih dulu, lalu teks biasa, lalu menampilkan instruksi salin manual. Panel hasil tidak pernah mengklaim brief sudah terkirim.',
          'Panel menyediakan tautan Gmail, tombol salin ulang, dan fallback mailto berisi teks biasa. Tautan Gmail hanya membawa penerima dan subjek, bukan badan email, karena URL compose tidak menerima HTML. Pengunjung menempel brief sendiri di badan email, dan tetap bisa memeriksa isinya sebelum menekan Kirim.',
        ],
        code: `try {
  await navigator.clipboard.write([item]);
  setReadyStatus('Brief HTML disalin. Buka Gmail, lalu tempel.');
} catch {
  await navigator.clipboard.writeText(buildBriefText(data));
  setReadyStatus('Brief disalin sebagai teks biasa.');
}`,
      },
      {
        heading: 'Hal yang sudah diverifikasi dan yang belum',
        paragraphs: [
          'Bagian yang dapat diverifikasi ada di repositori ini: pemeriksaan tipe dan build berhasil, pemeriksa tautan internal berhasil, dan catatan pemeriksaan manual di Chromium menunjukkan submit kosong ditolak dengan status kolom wajib, fokus berpindah ke kolom tidak valid pertama, submit terisi menyalin brief HTML, panel hasil muncul, tautan Gmail berisi penerima dan subjek yang benar, pratinjau email tampil, serta tidak ada error console.',
          'Bagian yang tidak dapat diverifikasi dari repositori ini adalah hasil tempel di akun Gmail sungguhan. Gmail dapat menormalkan sebagian CSS saat paste dan saat mengirim. Template karena itu memakai tabel, inline style, dan teks gelap di atas latar terang, sehingga tetap terbaca kalau sebagian dekorasi dibuang. Pengiriman tetap ditentukan aplikasi email; situs tidak menyimpan bukti penerimaan, log, ataupun penghitung.',
        ],
      },
      {
        heading: 'Batasan dan kapan solusi ini perlu diganti',
        paragraphs: [
          'Alur ini menambah satu langkah: setelah menekan tombol, pengunjung membuka Gmail dan menempel brief. URL compose Gmail tidak menerima HTML, jadi tidak ada cara tanpa backend untuk langsung membuka draft berformat. Clipboard juga bisa diblokir, dan fallback teks biasa tetap tersedia untuk situasi itu.',
          'Setiap aplikasi email juga menafsirkan isi clipboard dengan cara berbeda: sebagian mempertahankan tabel dan warna, sebagian menyederhanakan semuanya. Submit tidak disimpan di mana pun, jadi brief yang tidak dikirim pengunjung tidak meninggalkan jejak di kedua sisi. Alamat email yang dipublikasikan juga dapat dipanen seperti alamat publik lainnya.',
          'Untuk volume saat ini, hal-hal tersebut belum menjadi alasan untuk menambahkan backend. Penggantian baru masuk akal ketika ada kebutuhan nyata: endpoint yang berfungsi jika spam atau volume membenarkannya, atau hosting sendiri yang bisa menerima POST. Sampai saat itu, teks formulir menjelaskan dengan tepat apa yang terjadi: situs ini tidak mengirim apa pun ke server.',
        ],
      },
      {
        heading: 'Lokasi implementasi',
        paragraphs: [
          'Formulir tersedia di /contact/. Template email berada di src/lib/brief-email.ts, sedangkan alur clipboard, status, dan pratinjau berada di src/scripts/contact.ts dalam repositori website ini (github.com/dikaglorya/dikaglorya.github.io). Kompromi arsitekturnya dijelaskan di artikel terkait tentang struktur portofolio statis yang menaungi jurnal ini.',
        ],
      },
    ],
  },
];
