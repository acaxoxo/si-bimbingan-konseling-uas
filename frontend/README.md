# Sistem Bimbingan Konseling - Frontend

> � **Navigation:** [Home](../README.md) > Frontend Documentation
> 
> 📖 **Quick Links:**
> - [← Dokumentasi Utama](../README.md) - Setup backend, database, troubleshooting
> - [🚀 Quick Start](../README.md#-quick-start) - Install & run dalam 5 menit
> - [🔐 Akun Testing](../README.md#-akun-login-testing) - Login credentials
> - 🔧 Backend Documentation (dalam development)

---

Aplikasi frontend untuk Sistem Bimbingan Konseling SMK Negeri 1 Kupang.

## 📑 Quick Navigation

- [Deskripsi Sistem](#deskripsi-sistem)
- [Akun Login Testing](#akun-login-untuk-testing)
- [Peran dan Hak Akses](#peran-dan-hak-akses)
- [Entitas dan Atribut](#entitas-dan-atribut)
- [Skenario Sistem](#skenario-sistem)
- [Desain Struktural (ERD/DFD)](#desain-struktural-sistem)
- [Teknologi](#teknologi)
- [Instalasi](#instalasi)
- [Struktur Folder](#struktur-folder)

> 💡 **Untuk setup lengkap backend dan database**, lihat [Dokumentasi Utama](../README.md)

---

## Deskripsi Sistem

Sistem Informasi Bimbingan Konseling adalah aplikasi berbasis web untuk mengelola data pelanggaran siswa, laporan, dan tindakan sekolah. Sistem ini memfasilitasi komunikasi antara guru BK, siswa, dan orang tua dalam penanganan pelanggaran siswa di sekolah.

## Cara Kerja Sistem

1. **Admin** mengelola data master (guru, siswa, orang tua, kelas, jenis pelanggaran)
2. **Guru BK** mencatat pelanggaran siswa dan memberikan tindakan sekolah
3. **Orang Tua** dapat melihat laporan pelanggaran anak dan memberikan tanggapan
4. **Siswa** dapat melihat riwayat pelanggaran mereka sendiri
5. Sistem menghasilkan laporan dan statistik pelanggaran

## Akun Login untuk Testing

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smk1kupang.sch.id | admin123 |
| Guru BK | guru@smk1kupang.sch.id | guru123 |
| Siswa | siswa@smk1kupang.sch.id | siswa123 |
| Orang Tua | ortu@smk1kupang.sch.id | ortu123 |

## Peran dan Hak Akses

### 1. Admin
- ✅ Mengelola data admin
- ✅ Mengelola data guru BK
- ✅ Mengelola data siswa
- ✅ Mengelola data orang tua
- ✅ Mengelola data kelas
- ✅ Mengelola jenis pelanggaran
- ✅ Melihat laporan pelanggaran (read-only)
- ✅ Export laporan ke Excel

### 2. Guru BK
- ✅ Mencatat pelanggaran siswa
- ✅ Memberikan tindakan sekolah
- ✅ Melihat laporan pelanggaran
- ✅ Melihat tanggapan orang tua
- ✅ Export laporan ke Excel
- ✅ Melihat data siswa, kelas, jenis pelanggaran (read-only)

### 3. Orang Tua
- ✅ Melihat laporan pelanggaran anak
- ✅ Memberikan tanggapan atas pelanggaran
- ✅ Melihat tindakan sekolah
- ✅ Melihat data guru BK, kelas, jenis pelanggaran (read-only)

### 4. Siswa
- ✅ Melihat riwayat pelanggaran diri sendiri
- ✅ Melihat tindakan sekolah
- ✅ Melihat data guru BK, kelas, jenis pelanggaran (read-only)

## Entitas dan Atribut

### 1. Admin
- `id_admin` (PK)
- `nama_admin`
- `email` (unique)
- `password` (hashed)
- `created_at`
- `updated_at`

### 2. Guru
- `id_guru` (PK)
- `nama_guru`
- `nik` (unique)
- `jenis_kelamin`
- `tempat_lahir`
- `tanggal_lahir`
- `alamat`
- `telepon`
- `email` (unique)
- `password` (hashed)
- `created_at`
- `updated_at`

### 3. Siswa
- `id_siswa` (PK)
- `nama_siswa`
- `nis` (unique)
- `nisn` (unique)
- `jenis_kelamin`
- `tempat_lahir`
- `tanggal_lahir`
- `alamat`
- `telepon`
- `email` (unique)
- `password` (hashed)
- `id_kelas` (FK)
- `id_orang_tua` (FK)
- `created_at`
- `updated_at`

### 4. Orang Tua
- `id_orang_tua` (PK)
- `nama_orang_tua`
- `nik` (unique)
- `jenis_kelamin`
- `alamat`
- `telepon`
- `email` (unique)
- `password` (hashed)
- `pekerjaan`
- `created_at`
- `updated_at`

### 5. Kelas
- `id_kelas` (PK)
- `nama_kelas` (contoh: X, XI, XII)
- `kelas_kejuruan` (contoh: RPL, TKJ, MM)
- `created_at`
- `updated_at`

### 6. Jenis Pelanggaran
- `id_jenis_pelanggaran` (PK)
- `nama_jenis_pelanggaran`
- `kategori_pelanggaran` (Ringan/Sedang/Berat)
- `poin_pelanggaran`
- `deskripsi`
- `created_at`
- `updated_at`

### 7. Pelanggaran Siswa
- `id_pelanggaran_siswa` (PK)
- `id_siswa` (FK)
- `id_jenis_pelanggaran` (FK)
- `id_guru` (FK) - guru yang mencatat
- `tanggal_pelanggaran`
- `tempat_kejadian`
- `kronologi`
- `tindak_lanjut`
- `created_at`
- `updated_at`

### 8. Tanggapan Orang Tua
- `id_tanggapan` (PK)
- `id_pelanggaran_siswa` (FK)
- `id_orang_tua` (FK)
- `tanggapan`
- `tanggal_tanggapan`
- `created_at`
- `updated_at`

### 9. Tindakan Sekolah
- `id_tindakan` (PK)
- `id_pelanggaran_siswa` (FK)
- `jenis_tindakan`
- `deskripsi_tindakan`
- `tanggal_tindakan`
- `id_guru` (FK) - guru yang memberikan tindakan
- `created_at`
- `updated_at`

### 10. Laporan
- `id_laporan` (PK)
- `id_pelanggaran_siswa` (FK)
- `tanggal_laporan`
- `status_laporan`
- `catatan`
- `created_at`
- `updated_at`

## Relasi Antar Entitas

```
Admin (1) ─── manages ─── (*) [All Entities]

Guru (1) ─── records ─── (*) PelanggaranSiswa
Guru (1) ─── gives ─── (*) TindakanSekolah

Siswa (*) ─── belongs to ─── (1) Kelas
Siswa (*) ─── has ─── (1) OrangTua
Siswa (1) ─── commits ─── (*) PelanggaranSiswa

OrangTua (1) ─── has ─── (*) Siswa
OrangTua (1) ─── gives ─── (*) TanggapanOrangTua

JenisPelanggaran (1) ─── categorizes ─── (*) PelanggaranSiswa

PelanggaranSiswa (1) ─── generates ─── (1) Laporan
PelanggaranSiswa (1) ─── receives ─── (*) TanggapanOrangTua
PelanggaranSiswa (1) ─── receives ─── (*) TindakanSekolah
```

## Skenario Sistem

### Skenario 1: Guru BK Mencatat Pelanggaran Siswa
1. Guru login ke sistem
2. Guru membuka menu "Pelanggaran Siswa"
3. Guru klik tombol "Tambah Pelanggaran"
4. Guru memilih siswa dari dropdown
5. Guru memilih jenis pelanggaran dari dropdown
6. Guru mengisi tanggal, tempat kejadian, dan kronologi
7. Guru menyimpan data pelanggaran
8. Sistem mencatat pelanggaran dan menambahkan poin ke siswa
9. Sistem mengirim notifikasi ke orang tua siswa

### Skenario 2: Orang Tua Memberikan Tanggapan
1. Orang tua login ke sistem
2. Orang tua membuka menu "Laporan Anak Saya"
3. Orang tua melihat daftar pelanggaran anak
4. Orang tua klik tombol "Tanggapi" pada pelanggaran tertentu
5. Orang tua mengisi tanggapan
6. Orang tua menyimpan tanggapan
7. Sistem mencatat tanggapan dan memberi notifikasi ke guru BK

### Skenario 3: Admin Mengelola Data Master
1. Admin login ke sistem
2. Admin membuka menu "Data Guru/Siswa/Kelas/dll"
3. Admin klik tombol "Tambah Data"
4. Admin mengisi form dengan data lengkap
5. Admin menyimpan data
6. Sistem memvalidasi dan menyimpan ke database
7. Data baru muncul di tabel

### Skenario 4: Guru BK Memberikan Tindakan Sekolah
1. Guru login ke sistem
2. Guru membuka menu "Pelanggaran Siswa"
3. Guru klik tombol "Detail" pada pelanggaran tertentu
4. Guru klik tombol "Tambah Tindakan"
5. Guru memilih jenis tindakan (teguran/skorsing/dll)
6. Guru mengisi deskripsi dan tanggal tindakan
7. Guru menyimpan tindakan
8. Sistem mencatat tindakan dan update status pelanggaran

### Skenario 5: Export Laporan ke Excel
1. User login ke sistem
2. User membuka menu "Laporan Pelanggaran"
3. User memilih filter bulan dan tahun (opsional)
4. User klik tombol "Export Excel"
5. Sistem generate file Excel dengan data terfilter
6. File Excel otomatis terdownload

## Desain Struktural Sistem

### ERD (Entity Relationship Diagram) - Konsep
```
┌─────────────┐       ┌─────────────────┐       ┌──────────────┐
│   ADMIN     │       │      GURU       │       │    SISWA     │
├─────────────┤       ├─────────────────┤       ├──────────────┤
│ id_admin PK │       │ id_guru PK      │       │ id_siswa PK  │
│ nama_admin  │       │ nama_guru       │       │ nama_siswa   │
│ email       │       │ nik             │       │ nis          │
│ password    │       │ email           │       │ nisn         │
└─────────────┘       │ password        │       │ id_kelas FK  │
                      └────────┬────────┘       │ id_ortu FK   │
                               │                 └──────┬───────┘
                               │                        │
                               ▼                        ▼
                      ┌─────────────────────────────────────┐
                      │      PELANGGARAN SISWA              │
                      ├─────────────────────────────────────┤
                      │ id_pelanggaran_siswa PK             │
                      │ id_siswa FK                         │
                      │ id_jenis_pelanggaran FK             │
                      │ id_guru FK                          │
                      │ tanggal_pelanggaran                 │
                      │ kronologi                           │
                      └──────────┬──────────────────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 ▼               ▼               ▼
        ┌────────────┐  ┌────────────────┐  ┌──────────┐
        │ TANGGAPAN  │  │    TINDAKAN    │  │ LAPORAN  │
        │ ORANG TUA  │  │    SEKOLAH     │  │          │
        └────────────┘  └────────────────┘  └──────────┘
```

### DFD Level 0 (Context Diagram)
```
┌─────────┐
│  ADMIN  │─────┐
└─────────┘     │
                ▼
┌─────────┐  ┌──────────────────────────┐
│ GURU BK │──│   SISTEM BIMBINGAN       │
└─────────┘  │      KONSELING           │
             └──────────────────────────┘
┌─────────┐     │             │
│  SISWA  │─────┘             │
└─────────┘                   │
                              │
┌──────────┐                  │
│ ORANG TUA│──────────────────┘
└──────────┘
```

### DFD Level 1
```
                    ┌──────────────────┐
         ┌──────────│  1.0 Manajemen   │◄─── Admin
         │          │      User        │
         │          └──────────────────┘
         ▼
   [D1: Users]
         │
         │          ┌──────────────────┐
         └──────────│  2.0 Pencatatan  │◄─── Guru BK
                    │   Pelanggaran    │
                    └──────────────────┘
                              │
                              ▼
                    [D2: Pelanggaran]
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
         ┌──────────────────┐  ┌──────────────────┐
         │  3.0 Tanggapan   │  │  4.0 Tindakan    │
         │   Orang Tua      │  │    Sekolah       │
         └──────────────────┘  └──────────────────┘
                  ▲                      ▲
                  │                      │
            Orang Tua              Guru BK
                  
         ┌──────────────────┐
         │  5.0 Laporan &   │◄─── Semua User
         │    Dashboard     │
         └──────────────────┘
```

## Teknologi
- **Frontend**: React 18 + Vite
- **UI Framework**: Bootstrap 5
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Excel Export**: XLSX + FileSaver
- **Icons**: Font Awesome 6

## Instalasi
```bash
npm install
```

## Jalankan Development
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5173`

## Build Production
```bash
npm run build
```

## Fitur Utama
- ✅ Multi-role Authentication (Admin, Guru, Siswa, Orang Tua)
- ✅ Manajemen Data Master (Guru, Siswa, Orang Tua, Kelas, Jenis Pelanggaran)
- ✅ Pencatatan Pelanggaran Siswa dengan Poin
- ✅ Laporan Pelanggaran dengan Filter Bulan & Tahun
- ✅ Tanggapan Orang Tua
- ✅ Tindakan Sekolah
- ✅ Dashboard Statistik Real-time
- ✅ Dark/Light Mode dengan LocalStorage Persistence
- ✅ Export Laporan ke Excel
- ✅ Responsive Design (Mobile & Desktop)
- ✅ Form Validation
- ✅ Protected Routes per Role

## Struktur Folder
```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts
│   ├── components/      # Reusable components
│   │   ├── Layout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── partials/
│   ├── contexts/        # React Context (Auth, Theme)
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Axios configuration
│   ├── pages/           # Page components
│   │   ├── admin/
│   │   ├── guru/
│   │   ├── siswa/
│   │   └── orangTua/
│   ├── utils/           # Utility functions
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## Backend Repository
Backend API tersedia di folder `backend/` dengan teknologi:
- Node.js + Express
- MySQL + Sequelize ORM
- JWT Authentication
- Pagination & Filtering

> 📖 **Untuk setup backend lengkap**, lihat [Dokumentasi Utama](../README.md#-quick-start)

---

## 🔗 Navigation Links

- **[← Kembali ke Dokumentasi Utama](../README.md)** - Setup lengkap backend, database, dan API
- **[Quick Start Guide](../README.md#-quick-start)** - Install dan jalankan aplikasi
- **[Akun Testing](../README.md#-akun-login-testing)** - Login credentials untuk semua role
- **[Troubleshooting](../README.md#-troubleshooting)** - Solusi masalah umum

---

**Developed for SMK Negeri 1 Kupang**
© 2025 All Rights Reserved


