# ⭐ BintangBaca - Dashboard & Aplikasi Latihan Membaca Anak TK

Aplikasi web interaktif untuk mendampingi anak usia Taman Kanak-Kanak (TK / 4-6 tahun) belajar membaca bahasa Indonesia dengan metode fonik dan suku kata bergambar, dilengkapi **fitur klik suara pelafalan** serta **dashboard evaluasi untuk orang tua/guru**.

---

## 🌟 Fitur Utama

### 1. Fitur Klik Suara Pelafalan Benar (Audio On-Demand)
- **Klik Bunyi Huruf**: Mendengarkan pelafalan fonik huruf vokal dan konsonan.
- **Klik Suku Kata**: Mendengarkan lafal suku kata terbuka (`ba, bi, bu, be, bo`, dll).
- **Ejaan Suku Kata Interaktif (Karaoke Highlight)**: Klik balok kata (misal `ba` lalu `ju`) untuk mendengarkan suku kata satu per satu lalu kata utuhnya.
- **Pengaturan Tempo Suara**: Pilihan kecepatan suara (0.7x sangat lambat untuk pemula, 0.8x sedang, 1.0x normal).
- Menggunakan **Web Speech API** bahasa Indonesia (`id-ID`) dan **Web Audio API synthesizer** (berjalan cepat, tanpa delay, dan tanpa file mp3 berat).

### 2. Modul Belajar Anak
- **Modul 1: Mengenal Alfabet (A-Z)**: Kartu huruf besar & kecil, ilustrasi benda, dan suara panduan.
- **Modul 2: Suku Kata Terbuka**: Penggabungan konsonan (b, c, d, g, k, l, m, n, p, r, s, t) dengan vokal (a, i, u, e, o) dan fitur auto-play berurutan.
- **Modul 3: Membaca Kata Bergambar**: Pembagian Level 1 (2 suku kata) dan Level 2 (3 suku kata), kategori benda, hewan, makanan, tubuh.
- **Modul 4: Kalimat Pendek Sederhana**: Kalimat santai ("ini buku budi", "ibu beli roti", dll) dengan klik kata mandiri.
- **Arena Bermain & Kuis**: 3 jenis permainan (Tebak Gambar, Susun Balok Suku Kata, dan Dengar & Cari Kartu).
- **Album Stiker & Gamifikasi**: Penghargaan bintang dan stiker virtual untuk motivasi anak.

### 3. Dashboard Orang Tua & Guru
- Persentase penguasaan materi (Huruf, Suku Kata, Kata).
- Total bintang terkumpul & durasi belajar harian.
- Riwayat kuis latihan anak & grafik akurasi jawaban.
- Manajemen profil anak (nama panggilan & maskot kesukaan).
- Pengaturan suara pelafalan dan tombol reset data.

---

## 🚀 Cara Menjalankan

Masuk ke direktori proyek:
```bash
cd /Users/regaprasetyo/.gemini/antigravity/scratch/baca-anak-tk
```

Jalankan server pengembangan:
```bash
npm run dev
```

Buka browser di [http://localhost:3000](http://localhost:3000).
