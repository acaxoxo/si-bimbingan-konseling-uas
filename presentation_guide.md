# Panduan Presentasi Project SI Bimbingan Konseling

Dokumen ini dirancang untuk membantu Anda menjelaskan project **Sistem Informasi Bimbingan Konseling** dengan ringkas, padat, dan mengesankan di depan kelas.

## 1. Pembukaan (1-2 Menit)

**"Apa yang saya buat?"**

* **Judul**: Sistem Informasi Bimbingan Konseling (SI-BK).
* **Masalah**: Pencatatan pelanggaran siswa dan komunikasi antara Guru BK, Siswa, dan Orang Tua seringkali manual dan tidak transparan.
* **Solusi**: Aplikasi berbasis web untuk digitalisasi pencatatan pelanggaran, pemanggilan orang tua, dan monitoring siswa secara *real-time*.

## 2. Tech Stack (Teknologi yang Digunakan)

Jelaskan tools yang digunakan (PERN/MERN Stack variation):

* **Frontend**: React.js (Vite) - untuk antarmuka yang cepat dan responsif.
* **Backend**: Node.js & Express.js - untuk API server.
* **Database**: MySQL (dengan Sequelize ORM) - untuk penyimpanan data relasional.
* **Real-time**: Socket.io - untuk notifikasi langsung (misal: saat ada pelanggaran baru).
* **Styling**: Bootstrap/CSS - untuk tampilan yang rapi.

## 3. Arsitektur Aplikasi (Big Picture)

Jelaskan alur data secara sederhana:

1. **Client (Frontend)** mengirim request (Login, Input Data) ke **Server**.
2. **Server (Backend)** memproses logika (Cek password, Validasi input).
3. **Database** menyimpan atau mengambil data.
4. **Response** dikirim kembali ke Client untuk ditampilkan.

## 4. Highlight Codingan (Bagian Penting)

Jangan jelaskan semua baris! Fokus pada 3 bagian "Jantung" aplikasi ini:

### A. Entry Point & Koneksi Database (`backend/server.js`)

Tunjukkan file ini untuk membuktikan server berjalan dan terkoneksi ke DB.

* **Poin Penting**:
  * Import library (`express`, `cors`, `dotenv`).
  * Koneksi Database (`db.authenticate()`).
  * Routing (`app.use('/api/...')`).

### B. Multi-Role Authentication (`backend/controllers/AuthController.js`)

Ini fitur keren! Satu halaman login untuk 4 role berbeda (Admin, Guru, Siswa, Orang Tua).

* **Tunjukkan function `login`**:
  * Switch case berdasarkan `role`.
  * Pengecekan password dengan `bcrypt` (keamanan).
  * Pembuatan token dengan `jwt` (JSON Web Token).

### C. Routing & Proteksi Halaman (`frontend/src/App.jsx`)

Bagaimana cara membatasi akses? (Siswa tidak boleh masuk halaman Admin).

* **Tunjukkan komponen `ProtectedRoute`**:
  * Mengecek apakah user punya token?
  * Mengecek apakah role user sesuai dengan halaman yang dituju?

## 5. Skenario Demo (Live Action)

Lakukan demo dengan alur cerita agar audiens paham:

1. **Login sebagai Admin**:
    * Tunjukkan Dashboard Admin.
    * Tambah data Master (misal: Tambah Siswa atau Jenis Pelanggaran).
2. **Login sebagai Guru BK**:
    * Input **Pelanggaran Siswa**.
    * Tunjukkan notifikasi berhasil.
3. **Login sebagai Siswa/Orang Tua**:
    * Lihat data pelanggaran yang baru saja diinput oleh Guru.
    * Ini membuktikan sistem terintegrasi dan *real-time*.

## 6. Penutup

* **Kesimpulan**: Aplikasi ini membantu efisiensi kerja Guru BK dan transparansi ke Orang Tua.
* **Future Work**: Bisa dikembangkan ke aplikasi mobile (Android/iOS).

---
**Tips Tambahan:**

* **Percaya Diri**: Anda yang membuat, Anda yang paling paham.
* **Jangan Baca Codingan**: Jelaskan *logika*-nya, bukan *syntax*-nya. (Contoh: "Di sini kita cek password", BUKAN "Di baris 50 ada if password bla bla").
* **Siapkan Tab**: Buka VS Code dan Browser (localhost) sebelum maju agar tidak buang waktu loading.
