# AI LOGBOOK
# PANGGIL PAK RT
### Digital RT Service Platform

**Nama Proyek:** PANGGIL PAK RT  

**Pengembang:**
1. Aidil Rezqy Hadiansyah
2. EKA KUSUMA DARMOKO

**Kelas:** XI TKJ 1 

**Asal Sekolah:** *SMKN 1 Blitar*

**Jurusan:** Teknik Komputer dan Jaringan 

**AI Assistant:** ChatGPT (OpenAI) , Gemini

**Periode Pengembangan:** 19–24 November 2026  

**Platform Repository:** GitHub  

---

# PENDAHULUAN

Dokumen AI Logbook ini dibuat untuk mendokumentasikan proses pemanfaatan kecerdasan buatan (Artificial Intelligence/AI) selama pengembangan proyek PANGGIL PAK RT.

PANGGIL PAK RT merupakan sebuah platform pelayanan administrasi RT berbasis website yang dirancang untuk membantu mempermudah interaksi antara warga dengan pengurus RT dalam proses pengajuan dan pengelolaan layanan administrasi.

Selama proses pengembangan, AI digunakan sebagai pendamping dalam mengeksplorasi ide, merancang arsitektur sistem, menyusun struktur kode, mengembangkan fitur, menganalisis kesalahan program, serta memahami cara kerja setiap komponen.

Pengembangan dilakukan secara bertahap dengan pendekatan modular agar setiap bagian program memiliki tanggung jawab yang jelas dan mudah dikembangkan.

Dokumentasi ini menjelaskan bagaimana AI dimanfaatkan, hasil yang diperoleh, serta bentuk validasi dan modifikasi mandiri yang dilakukan selama proses pengerjaan proyek.

---

# TAHAP 1 — EKSPLORASI IDE & PERANCANGAN SOLUSI

**Periode:** 19-20 November 2026

## 1. Latar Belakang

Pada tahap awal, pengembangan proyek dimulai dengan mengeksplorasi ide produk digital yang memiliki manfaat nyata bagi lingkungan masyarakat.

Kami ingin mengembangkan sebuah website yang dapat membantu mempermudah pelayanan administrasi di lingkungan RT.

Dari proses tersebut, muncul gagasan untuk membuat PANGGIL PAK RT, yaitu platform digital yang memungkinkan warga mengajukan kebutuhan administrasi melalui website dan memudahkan pengurus RT dalam mengelola pengajuan tersebut.

## 2. Pemanfaatan AI

AI digunakan sebagai partner diskusi untuk membantu:

1. Mengeksplorasi dan mengembangkan gagasan produk digital.
2. Mengidentifikasi permasalahan yang dapat diselesaikan melalui website.
3. Menentukan konsep dan identitas produk PANGGIL PAK RT.
4. Menentukan target pengguna dan kebutuhan masing-masing pengguna.
5. Menyusun daftar fitur utama dan fitur pendukung.
6. Menentukan teknologi yang sesuai untuk pengembangan proyek.
7. Merancang arsitektur sistem frontend, backend, dan database.

## 3. Hasil Perancangan

Dari proses diskusi, diperoleh rancangan produk dengan dua kelompok pengguna utama:

- **Warga:** Mengajukan layanan administrasi, melakukan verifikasi email, dan memantau status pengajuan.
- **Staf/Admin RT:** Mengelola pengajuan, melakukan autentikasi, memperbarui status, dan memantau proses pelayanan.

Fitur yang direncanakan dan dikembangkan meliputi:

- Halaman utama dan informasi layanan.
- Formulir pengajuan administrasi.
- Kategori layanan administrasi.
- Pengiriman dan pengelolaan lampiran.
- Verifikasi dan pengecekan status pengajuan.
- Notifikasi melalui email.
- Dashboard staf untuk pengelolaan pengajuan.
- Autentikasi staf menggunakan OTP.
- Validasi sesi dan logout staf.
- Pengaturan tampilan dan tema.
- Progressive Web App (PWA).

## 4. Keputusan Teknologi

Berdasarkan diskusi dan pertimbangan kebutuhan proyek, digunakan teknologi berikut:

| Komponen | Teknologi |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Google Apps Script |
| Database | Google Sheets |
| Notifikasi | Gmail |
| Penyimpanan lampiran | Google Drive |
| Ikon antarmuka | Lucide Icons |
| Version Control | GitHub |
| Publikasi frontend | GitHub Pages |
| PWA | Service Worker dan Web App Manifest |

Desain antarmuka menggunakan konsep **Forest Green Modern**, dengan pendekatan tampilan yang bersih, responsif, dan mudah digunakan.

## 5. Contoh Prompt AI

> Kamu adalah seorang ahli programmer dalam pengembangan website. Bantu saya membuatkan ide konsep untuk proyek sekolah (jenjang SMK). website ini bernama "PANGGIL PAK RT" (kamu boleh merekomendasikan nama lain) web ini berfungsi sebagai media untuk mengirimkan informasi ke pak RT (macam-macam misal untuk tempat mengajukan proposal acara desa dengan surat online, laporan masyarakat, laporan penduduk, kelahiran atau kematian, keluh kesah masyarakat, dan apapun jenisnya dimana hal itu yang awalnya perlu disampaikan ke pak RT bisa langsung dikirim lewat website ini. nantinya akan ada 4 RT disini, anggaplah saya mengambil RT desa sumberdiren kelurahan sumberdiren kecamatan garum kabupaten blitar dimana ada 4 RT dalam RW 1. web ini dirancang untuk bisa digunakan dan diinstal di handphone (sebagai PWA sederhana) dengan data yang akan dikirim dan diteruskan ke email ketua RT).

> Tolong bantu juga untuk memberikan saran fitur yang menarik tapi sederhana dan cocok digunakan untuk berbagai kalangan, berikan juga informasi terkait penjelasan struktur website dan alur kerja (workflow) kita nantinya dengan penjelasan yang disesuaikan untuk siswa SMK yang baru mengenal dasar-dasar HTML, CSS dan JavaScript.

> Saya memiliki saran tema website hijau forest dengan background foto tempat ikonik desa yang disamarkan (tidak merusak menu utama) penjelasan disesuaikan untuk siswa SMA/SMK yang baru mengenal dasar-dasar HTML, CSS, dan JavaScript, nantinya website ini nantinya akan di-deploy menggunakan GitHub Pages.

> Tambahan Informasi: Jangan memberikan kode pemrograman apapun itu sebelum ide dan desainnya disepekati bersama okay.

## 6. Validasi & Modifikasi Mandiri

Kami tidak langsung menerima seluruh rekomendasi AI. Saya melakukan diskusi lanjutan untuk mempertimbangkan kebutuhan pengguna dan kemampuan implementasi proyek.

Beberapa keputusan yang ditentukan melalui proses pertimbangan bersama tim antara lain:

- Memilih konsep website pelayanan administrasi RT.
- Memisahkan kebutuhan warga dan staf RT.
- Menggunakan Google Apps Script sebagai backend.
- Menggunakan Google Sheets sebagai database.
- Memilih desain Forest Green Modern.
- Mengembangkan fitur secara bertahap dan modular.

Hasil akhir dari tahap ini adalah konsep produk, rancangan fitur, dan teknologi yang menjadi dasar pengembangan proyek.

---

# TAHAP 2 — PENYUSUNAN KERANGKA KODE (SCAFFOLDING)

**Periode:** 21–22 November 2026

## 1. Tujuan Penggunaan AI

Pada tahap ini, AI digunakan sebagai pendamping dalam menyusun struktur proyek, membuat kerangka kode, mengembangkan frontend, serta membangun backend dan integrasi database.

Pengembangan dilakukan secara bertahap agar setiap komponen dapat diperiksa dan disesuaikan tanpa harus membangun seluruh sistem sekaligus.

## 2. Pengembangan Frontend

AI membantu dalam penyusunan dan pengembangan struktur halaman website menggunakan HTML, CSS, dan JavaScript.

Beberapa bagian frontend yang dikembangkan meliputi:

**A. Struktur halaman HTML**

- Halaman utama website.
- Halaman pengajuan layanan (`pengajuan.html`).
- Halaman pengecekan status.
- Halaman dashboard staf (`petugas.html`).

**B. Styling menggunakan CSS**

Pengembangan CSS dilakukan secara modular dengan pembagian file:

- `style.css` — gaya utama dan identitas visual website.
- `components.css` — komponen antarmuka.
- `form.css` — tampilan formulir.
- `responsive.css` — penyesuaian tampilan perangkat.
- `dark-mode.css` — tampilan mode gelap.
- `staff.css` — tampilan bagian staf.

**C. JavaScript**

Pengembangan JavaScript dipisahkan berdasarkan tanggung jawab masing-masing modul, di antaranya:

- `navigation.js` — navigasi website.
- `theme.js` — pengaturan tema.
- `language.js` — pengaturan bahasa.
- `services.js` — pengelolaan kategori layanan.
- `form.js` — interaksi formulir.
- `validation.js` — validasi input.
- `api.js` — komunikasi dengan backend.
- `pwa.js` — inisialisasi Progressive Web App.
- `staff-auth.js` — autentikasi staf.

Lucide Icons digunakan untuk membantu menghasilkan tampilan antarmuka yang lebih informatif.

## 3. Pengembangan Backend

Setelah struktur frontend disusun, pengembangan dilanjutkan dengan membuat backend menggunakan Google Apps Script.

AI membantu menyusun rancangan backend modular dengan pembagian file berdasarkan fungsinya.

Beberapa file backend yang dikembangkan meliputi:

| File | Tanggung Jawab |
|---|---|
| `Config.gs` | Konfigurasi aplikasi dan sistem. |
| `Database.gs` | Pengelolaan struktur dan akses database. |
| `Utilities.gs` | Fungsi pendukung dan utilitas. |
| `Security.gs` | Pengamanan dan validasi sistem. |
| `Submission.gs` | Pengelolaan pengajuan layanan. |
| `EmailService.gs` | Pengiriman notifikasi email. |
| `StatusService.gs` | Pengecekan dan pengelolaan status. |
| `ReminderService.gs` | Pengelolaan pengingat. |
| `StaffAuthService.gs` | Autentikasi staf. |
| `Code.gs` | Pengendali utama API. |

Pengembangan dilakukan dengan memperhatikan hubungan antara fungsi-fungsi backend dan kebutuhan frontend.

## 4. Pengembangan Database

AI membantu merancang struktur penyimpanan data menggunakan Google Sheets.

Database menggunakan empat sheet utama:

1. `DATA PENGAJUAN`
2. `KONFIGURASI RT`
3. `KATEGORI LAYANAN`
4. `LOG NOTIFIKASI`

Keempat sheet tersebut digunakan untuk memisahkan data pengajuan, konfigurasi RT, kategori layanan, dan pencatatan notifikasi.

Saya juga melakukan pembuatan dan pemeriksaan struktur sheet berdasarkan rancangan yang telah disusun.

## 5. Pengembangan Sistem Autentikasi Staf

Salah satu bagian yang dikembangkan adalah sistem autentikasi staf menggunakan OTP (One-Time Password).

AI membantu merancang mekanisme:

- Permintaan kode OTP.
- Verifikasi kode OTP.
- Pembentukan sesi staf.
- Validasi sesi.
- Pengakhiran atau pencabutan sesi.
- Pembatasan percobaan dan pengamanan autentikasi.

Sistem ini menggunakan OTP enam digit, penyimpanan sementara melalui cache, masa berlaku OTP 10 menit, serta masa berlaku sesi 30 menit.

Pengembangan juga mencakup mekanisme pembatasan permintaan dan penguncian untuk membantu melindungi proses autentikasi.

## 6. Contoh Prompt AI

> Bantu saya menyusun struktur backend Google Apps Script untuk proyek PANGGIL PAK RT yang kita diskusikan sebelumnya dong. Pisahkan fungsi konfigurasi, database, utilitas, keamanan, pengajuan, email, pengecekan status, reminder, dan autentikasi staf. Pastikan setiap file memiliki tanggung jawab yang jelas dan dapat diintegrasikan melalui Code.gs.

Prompt lain yang digunakan dalam proses pengembangan:

> Buatkan agar JavaScript yang kita buat digunakan untuk menghubungkan formulir pengajuan pada frontend dengan backend Google Apps Script. Jelaskan alur pengiriman data, validasi, penanganan respons API, dan hubungan dengan file lain.

## 7. Validasi & Modifikasi Mandiri

Kami melakukan beberapa penyesuaian selama proses scaffolding:

- Memeriksa kesesuaian struktur file dengan kebutuhan proyek.
- Memisahkan kode berdasarkan tanggung jawab masing-masing modul.
- Menyesuaikan nama file dan pemanggilan fungsi agar konsisten.
- Memastikan frontend dan backend memiliki format komunikasi yang sesuai.
- Membuat empat sheet database sesuai rancangan.
- Melakukan pemeriksaan konfigurasi dan integrasi secara bertahap.
- Mempertahankan konsistensi desain Forest Green Modern.

Kode yang diberikan AI tidak langsung digabungkan seluruhnya. Setiap bagian diperiksa dan disesuaikan dengan struktur proyek yang sedang dikembangkan.

Hasil dari tahap ini adalah terbentuknya struktur frontend, backend, database, dan komponen pendukung yang menjadi dasar sistem PANGGIL PAK RT.

---

# TAHAP 3 — PEMECAHAN MASALAH & PENANGANAN GALAT (DEBUGGING)

**Periode:** 23–24 November 2026

## 1. Tujuan Penggunaan AI

Pada tahap debugging, AI digunakan untuk membantu menganalisis permasalahan yang ditemukan selama proses pengembangan, memeriksa hubungan antarfile, serta memberikan alternatif perbaikan.

Proses ini dilakukan dengan memberikan kode sumber, struktur file, dan gejala permasalahan kepada AI agar analisis dapat dilakukan berdasarkan kondisi proyek yang sebenarnya.

## 2. Permasalahan dan Proses Perbaikan

### A. Pemeriksaan Integrasi Backend dan API

Pada proses pengembangan backend, diperlukan pemeriksaan agar frontend dapat berkomunikasi dengan Google Apps Script.

AI membantu memeriksa rancangan komunikasi API, struktur respons JSON, serta hubungan antara fungsi pengajuan, pengecekan status, dan autentikasi staf.

**Penanganan:**

- Memeriksa fungsi pengendali API pada `Code.gs`.
- Memeriksa pemisahan fungsi berdasarkan modul backend.
- Melakukan pemeriksaan layanan melalui fungsi diagnostik.
- Menyesuaikan integrasi frontend dengan tindakan API yang tersedia.

### B. Pemeriksaan Autentikasi Staf

Sistem autentikasi staf membutuhkan beberapa proses yang saling berhubungan, yaitu permintaan OTP, verifikasi OTP, pembentukan sesi, validasi sesi, dan logout.

AI membantu menyusun dan memeriksa alur autentikasi tersebut.

**Penanganan:**

- Mengembangkan `StaffAuthService.gs`.
- Memeriksa fungsi permintaan dan verifikasi OTP.
- Memeriksa validasi serta pencabutan sesi.
- Mengintegrasikan autentikasi staf dengan pengendali API.
- Melakukan pengujian diagnostik layanan autentikasi.

### C. Perbaikan Tampilan Formulir

Pada tahap pengembangan halaman pengajuan, ditemukan kebutuhan untuk memperbaiki posisi ikon pada input agar tidak bertabrakan dengan teks placeholder.

AI membantu menganalisis kemungkinan konflik antara posisi ikon SVG dan padding elemen formulir.

**Solusi yang diusulkan:**

- Mengatur posisi ikon menggunakan `position: absolute`.
- Mengatur jarak ikon dari sisi kiri input.
- Menyesuaikan `padding-left` pada input.
- Memastikan textarea dan elemen formulir lainnya tetap nyaman digunakan.

Perbaikan diarahkan pada `css/form.css`.

### D. Pemeriksaan Tampilan Header Responsif

Pada halaman pengajuan, ditemukan permasalahan pada penyesuaian header.

Setelah kode HTML dan CSS diperiksa, AI mengidentifikasi kemungkinan ketidaksesuaian selector antara `.brand` pada aturan responsif dan `.site-logo` pada HTML.

**Analisis dan penanganan:**

- Memeriksa struktur HTML header.
- Membandingkan nama class HTML dengan selector CSS.
- Mengidentifikasi kemungkinan konflik aturan responsif.
- Menentukan bagian CSS yang perlu diperiksa lebih lanjut.

### E. Penyesuaian Layout Responsif

AI membantu mengevaluasi tampilan halaman pengajuan pada perangkat desktop, tablet, dan smartphone.

Beberapa penyesuaian yang dibahas meliputi:

- Mengubah susunan sidebar dan konten utama menjadi satu kolom pada ukuran tertentu.
- Menyesuaikan tampilan langkah pengajuan.
- Mengatur ulang layout agar lebih mudah digunakan pada layar kecil.

### F. Pengembangan Progressive Web App (PWA)

Salah satu bagian yang dikembangkan adalah kemampuan website untuk mendukung penggunaan melalui mekanisme Progressive Web App.

AI membantu memeriksa proses pendaftaran Service Worker dan pengelolaan cache.

Pada proses pengujian, website dijalankan melalui lingkungan lokal:

`http://localhost/panggil-pak-rt/`

Hasil pemeriksaan menunjukkan pesan:

`[PWA] Service Worker berhasil didaftarkan.`

Cache Storage juga menampilkan cache bernama:

`panggil-pak-rt-static-v1`

Pengujian mode offline berhasil menampilkan halaman `Koneksi Terputus`.

## 3. Contoh Prompt AI

> Saya mengalami permasalahan pada tampilan atau fungsi tertentu dalam proyek PANGGIL PAK RT. Saya akan memberikan kode HTML, CSS, atau JavaScript yang berkaitan. Bantu analisis penyebabnya, jelaskan bagian yang perlu diperbaiki, dan berikan solusi tanpa mengubah struktur atau merusak fitur lain yang sudah berjalan.

Prompt untuk pemeriksaan integrasi:

> Periksa hubungan antara frontend, backend Google Apps Script, dan Google Sheets. Jelaskan kemungkinan kesalahan integrasi dan bagaimana cara menguji setiap bagian secara bertahap.

## 4. Validasi dan Pengujian Mandiri

Beberapa hasil pengujian yang benar-benar dilakukan selama pengembangan:

**A. Pengujian Diagnostik Layanan**

Kami menjalankan fungsi `testAPIServiceStatus`.

Hasil pengujian menunjukkan:

- Nilai `success` bernilai `true`.
- Seluruh delapan layanan yang diperiksa menunjukkan status aktif.

**B. Pengujian Permintaan OTP**

Pengujian permintaan OTP menghasilkan respons `success: true`.

Hal ini menunjukkan bahwa proses permintaan OTP berhasil mencapai tahap respons sukses. Pengujian lengkap seluruh alur OTP hingga logout belum dicatat sebagai hasil final pada log pengembangan.

**C. Pengujian Perubahan Status Pengajuan**

Kami melakukan pengujian integrasi perubahan status melalui dashboard staf.

Hasil yang diperoleh:

- Status pengajuan berhasil diubah.
- Data pada Google Sheets berhasil diperbarui.
- Halaman pengecekan status menampilkan perubahan yang sesuai.

**D. Pengujian PWA**

Kami menjalankan website secara lokal dan memeriksa pendaftaran Service Worker.

Hasil yang diperoleh:

- Service Worker berhasil didaftarkan.
- Cache Storage berhasil dibuat.
- Mode offline berhasil menampilkan halaman `Koneksi Terputus`.

## 5. Validasi & Modifikasi Mandiri

Dalam tahap debugging, Kami tidak hanya mengandalkan analisis AI.

Kami melakukan pemeriksaan secara langsung melalui browser, Console Developer Tools, Cache Storage, serta Google Sheets untuk memastikan hasil perubahan.

Kami juga memberikan kode sumber terbaru kepada AI ketika ditemukan permasalahan agar rekomendasi perbaikan sesuai dengan versi proyek yang sedang digunakan.

Setiap perubahan dipertimbangkan agar tidak mengganggu fungsi lain yang sudah berjalan.

---

# TAHAP 4 — REFLEKSI & PENJELASAN KODE

**Periode:** 24 November 2026 dan tahap penyelesaian proyek.

## 1. Tujuan Penggunaan AI

Pada tahap ini, AI digunakan sebagai pendamping belajar untuk memahami kode yang telah dikembangkan, menjelaskan hubungan antarbagian sistem, dan mengevaluasi hasil implementasi.

## 2. Pemahaman Struktur Sistem

Berdasarkan proses pengembangan, Kami mempelajari bahwa PANGGIL PAK RT terdiri dari beberapa komponen utama.

**A. Frontend**

Frontend merupakan bagian yang berinteraksi langsung dengan pengguna.

HTML digunakan untuk membangun struktur halaman, CSS untuk mengatur tampilan, dan JavaScript untuk memberikan fungsi interaktif.

**B. Backend**

Google Apps Script digunakan untuk memproses permintaan dari frontend, menjalankan logika aplikasi, mengelola data, dan memberikan respons melalui API.

**C. Database**

Google Sheets digunakan sebagai media penyimpanan data pengajuan, konfigurasi RT, kategori layanan, dan log notifikasi.

**D. Integrasi Layanan**

Gmail digunakan sebagai bagian dari sistem notifikasi email, sedangkan Google Drive dirancang sebagai media penyimpanan lampiran.

## 3. Pemahaman Alur Kerja

Secara umum, alur kerja PANGGIL PAK RT dapat dijelaskan sebagai berikut:

1. Warga membuka website.
2. Warga memilih layanan administrasi yang dibutuhkan.
3. Warga mengisi formulir pengajuan.
4. Sistem melakukan validasi data.
5. Data dikirim ke backend untuk diproses.
6. Backend mengelola data dan penyimpanannya.
7. Staf RT mengakses dashboard untuk mengelola pengajuan.
8. Staf dapat memperbarui status pengajuan.
9. Perubahan data dapat diperiksa kembali melalui halaman pengecekan status.

Alur tersebut menggambarkan hubungan antara antarmuka pengguna, pemrosesan backend, penyimpanan data, dan pengelolaan layanan.

## 4. Hasil Pembelajaran

Melalui proses pengembangan dan diskusi dengan AI, kami memperoleh pemahaman mengenai beberapa materi:

- Struktur dan pengelolaan file HTML.
- Penggunaan CSS modular dan responsive design.
- Penggunaan JavaScript untuk interaksi dan validasi.
- Konsep komunikasi frontend dan backend.
- Penggunaan API dengan format JSON.
- Penggunaan Google Apps Script sebagai backend.
- Pengelolaan data menggunakan Google Sheets.
- Konsep autentikasi menggunakan OTP.
- Penggunaan Service Worker dan cache pada PWA.
- Proses debugging melalui browser dan pemeriksaan data.

Kami juga memahami pentingnya struktur kode yang terorganisasi, validasi data, pengujian fitur, dan keamanan dalam pengembangan sebuah aplikasi.

## 5. Validasi & Modifikasi Mandiri

Kami melakukan evaluasi terhadap fitur yang telah dikembangkan dengan memeriksa hasil pengujian dan memahami fungsi setiap komponen.

Kami juga membandingkan hasil implementasi dengan rancangan awal untuk memastikan bahwa sistem yang dibuat tetap sesuai dengan tujuan proyek.

Dalam proses ini, kami menyadari bahwa penggunaan AI harus disertai kemampuan untuk membaca, memeriksa, menguji, dan memahami kode yang dihasilkan.

---

# REFLEKSI AKHIR PEMANFAATAN AI

Pengembangan PANGGIL PAK RT memberikan pengalaman dalam membangun sebuah produk digital yang terdiri dari frontend, backend, database, dan integrasi layanan eksternal. Selama proses pengerjaan, AI memberikan bantuan dalam berbagai tahap, mulai dari eksplorasi ide, penyusunan struktur proyek, pengembangan fitur, hingga analisis permasalahan. Namun, penggunaan AI tidak berarti seluruh proses pengembangan diserahkan kepada kecerdasan buatan. Kami tetap terlibat dalam menentukan kebutuhan proyek, memilih solusi, menyesuaikan struktur kode, memberikan kode terbaru untuk diperiksa, serta melakukan pengujian secara langsung. Salah satu pengalaman penting adalah ketika melakukan pengujian perubahan status pengajuan. Kami memeriksa hasilnya pada Google Sheets dan halaman pengecekan status untuk memastikan bahwa perubahan benar-benar tersimpan dan ditampilkan dengan sesuai. Kami juga memperoleh pengalaman dalam memeriksa Service Worker, Cache Storage, dan tampilan website melalui browser. Dari pengalaman tersebut, kami memahami bahwa AI merupakan alat bantu yang dapat meningkatkan efisiensi pengembangan, tetapi hasil akhirnya tetap membutuhkan pemahaman dan tanggung jawab dari pengembang yaitu kami.

## KESIMPULAN

Pemanfaatan AI dalam proyek PANGGIL PAK RT membantu proses pengembangan menjadi lebih terstruktur dan memberikan kesempatan untuk mempelajari berbagai teknologi yang digunakan. Melalui empat tahapan yang telah dilakukan, kami memperoleh pengalaman dalam merancang produk digital, menyusun program, mengintegrasikan sistem, menangani permasalahan, serta melakukan pengujian. Kami menyimpulkan bahwa pemanfaatan AI yang baik bukan hanya tentang mendapatkan kode program, melainkan tentang bagaimana menggunakan AI untuk membantu memahami masalah, menemukan solusi, dan meningkatkan kemampuan dalam mengembangkan teknologi secara mandiri.

---

**Dokumen:** AI_LOGBOOK.md  
**Proyek:** PANGGIL PAK RT  
**Penyusun:** Aidil Rezqy Hadiansyah dan Eka Kusuma Darmoko
**Tahun:** 2026

