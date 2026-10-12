# PC Store — Panduan Desain

**Versi:** 1.2  
**Referensi visual:** [Agres Komputer](https://www.agreskomputer.com/)  
**Stack target:** Laravel, Vite, Blade, dan JavaScript/TypeScript; Tailwind CSS bila digunakan proyek  
**Cakupan fitur:** autentikasi pengguna, pengelolaan produk, PC Builder, keranjang dan wishlist, pesanan, serta sistem vendor

> Agres Komputer digunakan sebagai referensi nuansa dan pola e-commerce. PC Store harus memiliki identitas sendiri: jangan menyalin logo, aset, atau teks secara persis.

## Daftar isi

1. [Tujuan dan sasaran](#1-tujuan-dan-sasaran)
2. [Prinsip desain](#2-prinsip-desain)
3. [Arah visual](#3-arah-visual)
4. [Sistem warna](#4-sistem-warna)
5. [Tipografi](#5-tipografi)
6. [Layout dan grid](#6-layout-dan-grid)
7. [Ikon dan gambar](#7-ikon-dan-gambar)
8. [Light mode dan dark mode](#8-light-mode-dan-dark-mode)
9. [Navigasi dan kerangka halaman](#9-navigasi-dan-kerangka-halaman)
10. [Sistem komponen](#10-sistem-komponen)
11. [Pedoman fitur](#11-pedoman-fitur)
12. [Homepage dan halaman penting](#12-homepage-dan-halaman-penting)
13. [Perilaku responsif](#13-perilaku-responsif)
14. [Aksesibilitas](#14-aksesibilitas)
15. [Motion dan UX writing](#15-motion-dan-ux-writing)
16. [Arsitektur front-end Laravel + Vite](#16-arsitektur-front-end-laravel--vite)
17. [Inventaris komponen](#17-inventaris-komponen)
18. [Daftar periksa kualitas](#18-daftar-periksa-kualitas)
19. [Hal yang perlu dikonfirmasi](#19-hal-yang-perlu-dikonfirmasi)
20. [Tujuan desain](#20-tujuan-desain)

## 1. Tujuan dan sasaran

Dokumen ini menjadi acuan visual dan perilaku UI untuk seluruh front-end PC Store. Tujuannya adalah:

- Membantu pengguna menemukan dan membandingkan komponen PC.
- Menampilkan harga, stok, spesifikasi, dan aksi utama dengan jelas.
- Menyediakan alur PC Builder yang mudah dipahami.
- Menjaga proses keranjang dan pesanan tetap sederhana.
- Mendukung kebutuhan pengelolaan vendor secara efisien.
- Menjaga konsistensi pada light mode dan dark mode.
- Memberikan pengalaman yang nyaman di desktop, tablet, dan ponsel.

## 2. Prinsip desain

1. **Utamakan produk:** gambar, nama, harga, stok, dan spesifikasi adalah informasi utama.
2. **Hierarki yang jelas:** aksi utama mudah ditemukan dan dibedakan dari aksi sekunder.
3. **Konsisten:** komponen dan pola interaksi digunakan dengan cara yang sama di seluruh halaman.
4. **Responsif sejak awal:** pengalaman mobile dirancang khusus, bukan sekadar versi desktop yang diperkecil.
5. **Aksesibel:** jangan menyampaikan status hanya melalui warna.
6. **Transaksi tepercaya:** biaya, stok, ringkasan, dan status ditampilkan secara transparan.
7. **Animasi seperlunya:** motion singkat dan fungsional, bukan dekorasi yang mengganggu.
8. **Siap terhubung ke data:** pisahkan UI dari data agar sumber mock dapat diganti tanpa mengubah komponen secara menyeluruh.

## 3. Arah visual

PC Store harus terasa modern, profesional, rapi, berorientasi pada produk, dan mudah digunakan. Gunakan aksen biru, latar putih atau abu-abu sangat muda pada light mode, serta latar navy atau abu-abu gelap pada dark mode. Kartu produk sebaiknya sederhana, gambar memiliki rasio yang konsisten, ikon bergaya seragam, dan whitespace cukup.

Hindari:

- Warna neon atau gradient yang berlebihan.
- Terlalu banyak warna dalam satu tampilan.
- Glassmorphism yang mengurangi keterbacaan.
- Animasi terus-menerus.
- Klaim promosi yang belum dikonfirmasi.
- Emoji sebagai ikon antarmuka.
- Penggunaan aset atau penyalinan tata letak referensi tanpa izin.

**Catatan warna:** palet berikut adalah usulan awal untuk nuansa biru-putih, bukan klaim bahwa seluruh kode warna internal situs referensi telah diverifikasi. Nilai warna perlu ditinjau kembali melalui pengujian visual dan aksesibilitas.

## 4. Sistem warna

### 4.1 Biru brand

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--brand-950` | `#102B50` | Biru sangat gelap |
| `--brand-900` | `#123A68` | Hover atau state aktif gelap |
| `--brand-800` | `#174F8A` | Hover tombol |
| `--brand-700` | `#1D64A8` | Aksen kuat |
| `--brand-600` | `#2478C5` | Aksi utama |
| `--brand-500` | `#3189D6` | Aksen dan focus ring |
| `--brand-100` | `#DCEEFF` | Latar informasi ringan |
| `--brand-50` | `#F0F7FF` | Surface biru muda |

### 4.2 Warna semantik

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--success` | `#16804A` | Berhasil, tersedia, selesai |
| `--success-bg` | `#E5F6EC` | Latar sukses |
| `--warning` | `#A76600` | Menunggu atau perlu perhatian |
| `--warning-bg` | `#FFF3D6` | Latar peringatan |
| `--danger` | `#C73535` | Error, hapus, atau ditolak |
| `--danger-bg` | `#FDE8E8` | Latar error |
| `--info` | `#2166A5` | Informasi atau proses |
| `--info-bg` | `#E7F2FF` | Latar informasi |

### 4.3 Warna netral — light mode

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--background` | `#F7F9FC` | Latar halaman |
| `--surface` | `#FFFFFF` | Kartu, menu, dan dialog |
| `--surface-muted` | `#F0F3F7` | Area sekunder |
| `--text-primary` | `#17212F` | Teks utama |
| `--text-secondary` | `#596579` | Teks sekunder |
| `--text-muted` | `#748094` | Caption |
| `--border` | `#DCE2EA` | Border standar |
| `--border-strong` | `#B9C4D2` | Border tegas |

### 4.4 Warna netral — dark mode

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--background` | `#0D1117` | Latar halaman |
| `--surface` | `#151B23` | Kartu dan panel |
| `--surface-muted` | `#1D2632` | Area sekunder |
| `--text-primary` | `#F2F5F9` | Teks utama |
| `--text-secondary` | `#B7C1CF` | Teks sekunder |
| `--text-muted` | `#8E9BAD` | Caption |
| `--border` | `#2B3543` | Border standar |
| `--border-strong` | `#465367` | Border tegas |

Aturan penggunaan:

- Gunakan biru brand untuk CTA utama, tautan, state terpilih, dan focus ring.
- Gunakan tombol destructive hanya untuk tindakan yang benar-benar destruktif.
- Status harus memakai warna **dan teks**.
- Periksa kontras pada kedua tema. Nilai warna di atas belum dianggap lolos audit kontras sebelum diuji.

## 5. Tipografi

Gunakan Inter sebagai pilihan awal. Jika proyek telah menetapkan font lain, pertahankan font yang ada sampai ada keputusan tim.

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

| Gaya | Ukuran / line-height | Weight | Penggunaan |
| --- | --- | --- | --- |
| Display | 40 / 48 px | 700 | Hero |
| H1 | 32 / 40 px | 700 | Judul halaman |
| H2 | 24 / 32 px | 700 | Judul section |
| H3 | 20 / 28 px | 600 | Panel |
| H4 | 18 / 26 px | 600 | Kartu |
| Body | 16 / 24 px | 400 | Teks utama |
| Body small | 14 / 20 px | 400 | Deskripsi |
| Caption | 12 / 18 px | 500 | Metadata |

Harga harus mudah dipindai dan menggunakan format Rupiah, misalnya `Rp1.299.000`. Hindari penggunaan terlalu banyak ukuran dan ketebalan font.

## 6. Layout dan grid

- Lebar maksimum kontainer desktop: `1280px`.
- Padding kontainer: desktop `32px`, tablet `24px`, dan mobile `16px`.
- Skala spacing: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px`.
- Radius: kecil `6px`, sedang `10px`, besar `14px`, XL `20px`, dan pill `999px`.
- Bayangan kartu pada light mode: `0 1px 3px rgba(15, 23, 42, 0.06)`.
- Bayangan elemen elevated: `0 8px 28px rgba(15, 23, 42, 0.12)`.
- Pada dark mode, utamakan border yang jelas dan bayangan yang lebih halus.

### Grid katalog

| Lebar viewport | Jumlah kolom yang disarankan |
| --- | --- |
| `≥1280px` | 4–5 produk, sesuai lebar konten |
| `1024–1279px` | 3–4 produk |
| `768–1023px` | 2–3 produk |
| `<768px` | Umumnya 2 produk bila teks tetap terbaca; gunakan 1 kolom bila konteks memerlukan ruang lebih luas |

Pastikan gambar, nama, harga, dan tombol tidak saling bertabrakan atau terpotong.

## 7. Ikon dan gambar

- Gunakan Lucide Icons atau satu pustaka ikon yang sudah tersedia dan digunakan konsisten.
- Ukuran ikon umum `20px`, kecil `16px`, dan besar `24px`.
- Gambar produk disarankan memakai rasio `1:1` dan `object-fit: contain`.
- Jangan meregangkan atau memotong gambar hingga bentuk produk berubah.
- Sediakan placeholder jika gambar gagal dimuat.
- Gunakan aset yang memang boleh digunakan. Jangan mengambil gambar dari situs referensi tanpa hak yang sesuai.

## 8. Light mode dan dark mode

- Sediakan theme toggle dengan accessible label seperti “Ganti ke mode gelap” atau “Ganti ke mode terang”.
- Tema boleh mengikuti preferensi sistem pada kunjungan awal.
- Simpan pilihan pengguna secara persisten dengan pendekatan yang sesuai dengan arsitektur aplikasi.
- Hindari flash tema yang salah saat halaman pertama dimuat.
- Dropdown, modal, tooltip, tabel, form, skeleton, toast, dan drawer harus mendukung kedua tema.
- Tentukan token tersendiri untuk latar, surface, border, teks, dan status; jangan hanya membalik warna halaman.
- Periksa keterbacaan gambar produk pada kedua tema.

Contoh token CSS berikut dapat ditempatkan di `resources/css/app.css`. Sesuaikan dengan konfigurasi styling yang sudah digunakan proyek.

```css
:root {
  color-scheme: light;
  --brand-950: #102B50;
  --brand-900: #123A68;
  --brand-800: #174F8A;
  --brand-700: #1D64A8;
  --brand-600: #2478C5;
  --brand-500: #3189D6;
  --brand-100: #DCEEFF;
  --brand-50: #F0F7FF;
  --background: #F7F9FC;
  --surface: #FFFFFF;
  --surface-muted: #F0F3F7;
  --text-primary: #17212F;
  --text-secondary: #596579;
  --text-muted: #748094;
  --border: #DCE2EA;
  --border-strong: #B9C4D2;
  --success: #16804A;
  --warning: #A76600;
  --danger: #C73535;
  --info: #2166A5;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --radius-pill: 999px;
  --container-width: 1280px;
}

[data-theme="dark"] {
  color-scheme: dark;
  --background: #0D1117;
  --surface: #151B23;
  --surface-muted: #1D2632;
  --text-primary: #F2F5F9;
  --text-secondary: #B7C1CF;
  --text-muted: #8E9BAD;
  --border: #2B3543;
  --border-strong: #465367;
  --brand-950: #DCEEFF;
  --brand-900: #B8DCFF;
  --brand-800: #8FC6FA;
  --brand-700: #67AEF0;
  --brand-600: #4A9BE6;
  --brand-500: #3C8DDA;
  --brand-100: #173653;
  --brand-50: #12283D;
  --success: #5BD18B;
  --warning: #F4C15D;
  --danger: #FF7777;
  --info: #7CBFFF;
}
```

Uji token pada komponen nyata, termasuk kontras serta state hover dan focus.

## 9. Navigasi dan kerangka halaman

### Header storefront

- **Desktop:** wordmark, search yang menonjol, kategori, wishlist, cart, akun, dan theme toggle. Hindari header yang terlalu padat.
- **Mobile:** tampilkan wordmark dan aksi utama pada baris atas. Search dapat memenuhi baris berikutnya; kategori dapat memakai horizontal scroll atau menu.
- Semua tautan kategori pada dropdown, menu mobile, dan navigasi cepat menuju `/katalog?category=<id>`; tautan Rakit PC tetap menuju `/pc-builder`.
- Ikon wishlist membuka daftar produk favorit dengan jumlah yang sama seperti counter header. Aksi simpan/hapus pada kartu produk, detail, dan Quick View harus mencerminkan state yang sama.

### Footer

Tampilkan navigasi penting, kategori, dan kontak hanya jika informasinya tersedia. Jangan membuat klaim garansi, pengiriman, atau pembayaran tanpa persetujuan tim.

### Dashboard vendor

Gunakan sidebar pada desktop dan drawer atau menu ringkas pada mobile. Topbar memuat judul halaman, profil, dan theme toggle. Prioritaskan tugas yang perlu diselesaikan.

## 10. Sistem komponen

### Button

- **Variasi:** `primary`, `secondary`, `ghost`, `danger`.
- **Ukuran:** `sm` sekitar `32px`, `md` sekitar `40px`, `lg` sekitar `48px`.
- Area sentuh mobile disarankan minimal `44 × 44px`.
- Dukung state default, hover, focus-visible, active, disabled, dan loading.
- Gunakan label berupa kata kerja yang jelas. State loading harus mencegah submit ganda.

### Kontrol form

- Letakkan label eksplisit di atas input; placeholder bukan pengganti label.
- Tampilkan error di dekat field terkait.
- Gunakan helper text untuk menjelaskan format bila diperlukan.
- Input, select, checkbox, radio, dan quantity selector harus dapat dioperasikan dengan keyboard.
- Jangan menghapus isi form ketika request gagal.

### Kartu produk

Urutan informasi yang disarankan:

1. Gambar produk.
2. Badge stok atau promo, hanya jika datanya tersedia.
3. Nama produk.
4. Spesifikasi ringkas yang relevan.
5. Harga.
6. Aksi untuk melihat detail atau menambahkan produk ke keranjang.
7. Tombol wishlist dengan accessible label.

Jaga posisi harga dan CTA tetap konsisten meskipun nama produk panjang. Produk habis harus terlihat jelas dan tidak menawarkan aksi pembelian aktif. Jangan mengarang rating, diskon, jumlah terjual, atau stok.

### Search dan filter

- Berikan label atau placeholder yang jelas pada search.
- Filter desktop dapat memakai sidebar; pada mobile gunakan drawer atau sheet.
- Tampilkan filter aktif dan tombol “Reset filter”.
- Buat rentang harga mudah dipahami.
- Saat hasil kosong, berikan opsi untuk menghapus filter.

### Badge status

Status selalu menyertakan teks, misalnya `Tersedia`, `Habis`, `Menunggu`, `Diproses`, `Dikirim`, `Selesai`, `Dibatalkan`, atau `Gagal`. Istilah final harus mengikuti kontrak backend.

### Modal, drawer, toast, dan dialog

- Gunakan modal untuk konfirmasi penting atau tugas singkat.
- Gunakan drawer untuk filter atau ringkasan pada mobile.
- Gunakan toast untuk feedback singkat; error form tetap ditampilkan di dekat field.
- Dialog konfirmasi harus menjelaskan dampak tindakan.
- Dukung tombol Escape dan pengembalian fokus bila sesuai.

### Tabel

Gunakan tabel untuk data vendor yang perlu dibandingkan antarbaris. Pada mobile, gunakan scroll terkontrol atau ubah tampilan menjadi list/card. Jangan mengecilkan teks secara berlebihan.

### State feedback

Halaman yang memuat data perlu mempertimbangkan loading skeleton, empty state, error dengan retry bila relevan, success state, dan disabled state.

## 11. Pedoman fitur

### 11.1 Autentikasi pengguna

Halaman login, register, dan profil dibuat bila termasuk cakupan fitur. Form harus ringkas, memiliki password visibility toggle yang aksesibel, pesan error berbahasa Indonesia, state loading saat submit, dan pencegahan submit berulang.

Validasi client tidak menggantikan validasi backend. Ikuti metode autentikasi yang disepakati; jangan membuat penyimpanan token atau password sendiri.

### 11.2 Pengelolaan produk

Dukung katalog, detail, search/filter/sort, serta form tambah/edit produk bagi role yang berhak. Halaman detail memprioritaskan gambar, nama, harga, stok, spesifikasi, dan CTA.

Kelompokkan form menjadi informasi dasar, kategori, harga/stok, gambar, dan spesifikasi. Minta konfirmasi sebelum menghapus produk. Authorization tetap menjadi tanggung jawab backend.

### 11.3 PC Builder

Kelompok komponen dapat mencakup CPU, motherboard, RAM, GPU, storage, PSU, casing, dan cooler jika didukung.

- Setiap slot menampilkan komponen terpilih atau CTA “Pilih komponen”.
- Total harga harus mudah ditemukan.
- Status kompatibilitas disertai alasan yang dapat dipahami; jangan mengandalkan warna saja.
- Aturan kompatibilitas harus berasal dari data atau logika yang telah disepakati. Jangan mengklaim validasi akurat bila belum tersedia.
- Simpan rakitan atau tambahkan ke cart hanya jika alur dan API mendukungnya.

### 11.4 Keranjang dan wishlist

Keranjang menampilkan gambar, nama, spesifikasi relevan, harga satuan, kuantitas, subtotal, dan aksi hapus. Total dan CTA checkout harus jelas.

Validasi kuantitas dan stok berdasarkan data yang tersedia. Wishlist menampilkan produk favorit, aksi ke keranjang bila didukung, serta empty state yang mengarahkan pengguna ke katalog. Ringkasan yang sticky di mobile tidak boleh menutupi konten.

Wishlist harus mendukung tambah/hapus dari kartu produk, halaman detail, dan Quick View. Counter header menunjukkan jumlah produk unik; daftar wishlist menyediakan aksi hapus dan tautan kembali ke detail produk.

### 11.5 Pesanan

Dukung checkout, ringkasan biaya, riwayat, detail, dan status pesanan sesuai fitur yang tersedia. Semua biaya harus berasal dari data yang benar. Tampilkan timeline hanya bila status backend mendukungnya.

Sediakan empty state untuk pengguna yang belum memiliki pesanan dan pesan error yang menjelaskan langkah berikutnya. Jangan mengklaim pembayaran berhasil tanpa integrasi nyata.

### 11.6 Sistem vendor

Dashboard vendor dapat mencakup daftar produk, form tambah/edit, pesanan, dan metrik penjualan hanya jika datanya tersedia. Prioritaskan tugas yang perlu ditindaklanjuti, dan sediakan search/filter pada tabel bila diperlukan.

Aksi hapus memerlukan konfirmasi. Jangan mengarang angka dashboard. Pastikan tugas utama tetap dapat dilakukan melalui perangkat mobile.

## 12. Homepage dan halaman penting

### Homepage

Urutan yang disarankan:

1. Header dan search.
2. Hero atau promosi yang telah dikonfirmasi.
3. Kategori komponen.
4. Produk unggulan atau terbaru jika endpoint tersedia.
5. CTA menuju katalog atau PC Builder.
6. Footer.

Jangan menampilkan promo, testimonial, angka penjualan, atau klaim yang tidak memiliki sumber.

### Katalog

Tampilkan judul/kategori, search, filter, sorting, jumlah hasil bila data tersedia, product grid, pagination atau load more sesuai implementasi, serta empty/loading/error state.

### Detail produk

Tampilkan galeri, nama, harga, stok, spesifikasi, deskripsi, kuantitas, wishlist, dan aksi tambah ke keranjang. Pada mobile, aksi utama dapat dibuat sticky jika tidak menutupi konten.

### Cart dan checkout

Sediakan halaman keranjang dan checkout yang dapat dibuka langsung melalui URL. Keranjang menampilkan gambar, nama, harga satuan, kuantitas yang dapat diubah, subtotal per produk, total, aksi hapus, empty state, dan CTA menuju checkout.

Checkout menampilkan ringkasan pesanan dan estimasi biaya, serta form data penerima dan alamat pengiriman dengan validasi. Sediakan pilihan metode pengiriman dan pembayaran yang tersedia. Minta konfirmasi pengiriman pesanan dan tampilkan nomor pesanan serta total pada konfirmasi berhasil.

Jika biaya pengiriman atau pembayaran belum terhubung ke backend, tandai dengan jelas sebagai simulasi/estimasi. Jangan mengklaim transaksi, pembayaran, atau pengiriman nyata telah diproses.

### Dashboard vendor

Sediakan sidebar/topbar, judul halaman, ringkasan hanya dari data yang tersedia, tabel atau list produk dan pesanan, form terstruktur, serta feedback state.

## 13. Perilaku responsif

Breakpoint awal:

| Perangkat | Lebar viewport |
| --- | --- |
| Mobile | `<640px` |
| Tablet | `640–1023px` |
| Desktop | `≥1024px` |
| Wide desktop | `≥1280px` |

Aturan responsif:

- Terapkan pendekatan mobile-first.
- Hindari horizontal overflow, kecuali tabel atau tab yang memang dirancang untuk scroll.
- Uji header, modal, filter, PC Builder, dan checkout pada layar kecil.
- Buat form full-width pada mobile bila sesuai.
- Ubah sidebar vendor menjadi drawer atau menu ringkas.
- Sesuaikan grid produk dengan lebar layar tanpa memotong teks.
- Pastikan sticky header atau bottom bar tidak menutupi konten.
- Gunakan gambar responsif dan hindari aset yang terlalu besar.

## 14. Aksesibilitas

- Pastikan kontras teks dan kontrol memadai pada kedua tema.
- Pastikan fungsi penting dapat digunakan dengan keyboard.
- Tampilkan focus-visible dengan jelas; jangan menghilangkan outline tanpa pengganti.
- Berikan label pada semua input.
- Berikan accessible name pada tombol ikon.
- Gambar informatif membutuhkan alt text; gambar dekoratif menggunakan alt kosong.
- Jangan menyampaikan status hanya melalui warna.
- Hormati `prefers-reduced-motion`.
- Jangan menyembunyikan informasi penting hanya saat hover.
- Uji zoom browser dan ukuran teks.

## 15. Motion dan UX writing

Gunakan transisi umum selama `120–200ms`. Animasi panel atau dialog dapat berlangsung hingga sekitar `300ms` bila membantu. Hindari parallax berat, infinite animation, dan gerakan yang mengganggu. Hormati preferensi reduced motion.

Gunakan bahasa Indonesia yang jelas dan konsisten, misalnya:

- “Tambah ke keranjang”
- “Simpan ke wishlist”
- “Pilih komponen”
- “Stok habis”
- “Coba lagi”
- “Belum ada pesanan”
- “Perubahan berhasil disimpan”
- “Terjadi kendala saat memuat data.”

Hindari stack trace atau kode error mentah, serta klaim yang belum diverifikasi seperti “100% aman” atau “kompatibilitas dijamin”.

## 16. Arsitektur front-end Laravel + Vite

### Struktur yang disarankan

Sesuaikan struktur dengan pola dan teknologi yang sudah digunakan proyek; struktur berikut adalah panduan, bukan keharusan.

```text
resources/
├── css/
│   └── app.css              # Entry CSS dan token desain
├── js/
│   ├── app.js               # Entry point JavaScript
│   ├── components/          # Komponen interaktif yang dapat digunakan ulang
│   ├── services/            # Integrasi data/API bila diperlukan
│   └── mocks/               # Data contoh selama API belum tersedia
└── views/
    ├── layouts/             # Layout Blade
    ├── components/          # Komponen Blade
    └── ...                  # Halaman sesuai struktur aplikasi
```

### Pedoman implementasi

- Audit struktur proyek, versi dependency, dan package manager sebelum implementasi. Jangan mengganti konfigurasi tanpa alasan.
- Gunakan Blade untuk layout dan komponen server-rendered bila sesuai arsitektur aplikasi.
- Letakkan interaksi client-side di JavaScript/TypeScript dan gunakan pola komponen yang memang sudah diterapkan proyek.
- Gunakan Tailwind CSS hanya jika sudah menjadi bagian dari stack proyek atau telah disepakati tim.
- Pisahkan UI, data, dan service/API layer sejauh kebutuhan proyek memungkinkan.
- Jika API belum tersedia, gunakan mock data yang diberi label jelas dan mudah diganti.
- Tipe TypeScript atau bentuk data JavaScript harus mengikuti kontrak API yang disepakati.
- Jangan membuat endpoint, payload, permission, atau status palsu seolah sudah disetujui.
- Jangan mengubah backend, database, autentikasi server, atau kontrak API milik anggota tim lain tanpa koordinasi.

### Alur kerja lokal dan Git

- Buat branch per fitur mengikuti konvensi repository, misalnya `feat/nama-fitur`.
- Jalankan development server yang diperlukan proyek, umumnya `npm run dev` untuk Vite dan `php artisan serve` untuk Laravel.
- Sebelum membuka pull request ke branch tujuan tim, periksa perubahan, jalankan pemeriksaan yang tersedia, dan pastikan tidak ada konfigurasi atau rahasia yang ikut ter-commit.

## 17. Inventaris komponen

Nama dan bentuk komponen di bawah adalah usulan. Ikuti pola proyek yang sudah ada bila berbeda.

- **Shared:** `SiteHeader`, `MobileNavigation`, `CategoryNavigation`, `SiteFooter`, `ThemeToggle`, `Container`, `PageHeading`, `Breadcrumbs`.
- **Commerce:** `ProductCard`, `ProductGrid`, `ProductGallery`, `PriceDisplay`, `StockBadge`, `SearchBar`, `CategoryFilter`, `BrandFilter`, `PriceRangeFilter`, `SortSelect`, `Pagination`, `QuantitySelector`, `WishlistButton`, `CartSummary`.
- **Form dan feedback:** `Button`, `TextInput`, `Select`, `Checkbox`, `RadioGroup`, `FormField`, `Alert`, `Toast`, `Modal`, `Drawer`, `Skeleton`, `EmptyState`, `ErrorState`, `ConfirmDialog`.
- **PC Builder:** `ComponentSlot`, `ComponentPicker`, `BuildSummary`, `CompatibilityNotice`, `BuildTotal`.
- **Vendor:** `VendorSidebar`, `VendorTopbar`, `MetricCard` (hanya bila data tersedia), `ProductTable`, `OrderTable`, `ProductForm`, `StatusBadge`.

## 18. Daftar periksa kualitas

- [ ] Token warna digunakan secara konsisten.
- [ ] Light mode dan dark mode telah diuji.
- [ ] Tampilan mobile, tablet, dan desktop telah diuji.
- [ ] Tidak ada overflow atau konten yang tertutup.
- [ ] Loading, empty, error, dan success state tersedia sesuai kebutuhan.
- [ ] Setiap tombol memiliki aksi dan label yang jelas.
- [ ] Form memiliki label, validasi, dan pesan error.
- [ ] Focus keyboard terlihat.
- [ ] Kontras memadai dan status tidak bergantung pada warna saja.
- [ ] Harga dan stok sesuai data yang tersedia.
- [ ] Tidak ada rating, promo, statistik, atau stok palsu yang ditampilkan sebagai nyata.
- [ ] Tidak ada kontrak API yang diubah tanpa persetujuan.
- [ ] Komponen reusable digunakan secara konsisten.
- [ ] Build dan console diperiksa setelah implementasi.

## 19. Hal yang perlu dikonfirmasi

- Nama/logo final dan warna brand setelah review visual.
- Font final.
- Kategori serta spesifikasi produk wajib.
- Role dan permission (customer/vendor/admin).
- Aturan kompatibilitas PC Builder.
- Alur checkout, pembayaran, dan pengiriman.
- Status pesanan dan pembatalan.
- Endpoint, payload, dan bentuk data backend.
- Batas akses vendor terhadap produk dan pesanan.
- Cara menyimpan wishlist dan rakitan.

## 20. Tujuan desain

PC Store harus terasa seperti toko komponen komputer yang modern, tepercaya, mudah digunakan, dan konsisten. Pengguna harus dapat menemukan produk, memahami harga dan stok, menyusun PC, serta memantau pesanan tanpa kebingungan. Vendor harus dapat mengelola produk dan pesanan secara efisien.

**Prinsip akhir:** desain mendukung tugas pengguna. Keterbacaan, kejelasan informasi, konsistensi, dan responsivitas lebih penting daripada dekorasi.
