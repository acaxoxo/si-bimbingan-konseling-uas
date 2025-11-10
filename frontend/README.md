# Sistem Bimbingan Konseling - Frontend

>  **Navigation:** [Home](../README.md) > Frontend Documentation
> 
>  **Quick Links:**
> - [← Dokumentasi Utama](../README.md) - Setup backend, database, troubleshooting
> - [ Quick Start](../README.md#-quick-start) - Install & run dalam 5 menit
> - [ Akun Testing](../README.md#-akun-login-testing) - Login credentials
> -  Backend Documentation (dalam development)

---

Aplikasi frontend untuk Sistem Bimbingan Konseling SMK Negeri 1 Kupang.

##  Quick Navigation

- [Deskripsi Sistem](#deskripsi-sistem)
- [Akun Login Testing](#akun-login-untuk-testing)
- [Peran dan Hak Akses](#peran-dan-hak-akses)
- [Entitas dan Atribut](#entitas-dan-atribut)
- [Skenario Sistem](#skenario-sistem)
- [Desain Struktural (ERD/DFD)](#desain-struktural-sistem)
- [Teknologi](#teknologi)
- [Instalasi](#instalasi)
- [Struktur Folder](#struktur-folder)

>  **Untuk setup lengkap backend dan database**, lihat [Dokumentasi Utama](../README.md)

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
-  Mengelola data admin
-  Mengelola data guru BK
-  Mengelola data siswa
-  Mengelola data orang tua
-  Mengelola data kelas
-  Mengelola jenis pelanggaran
-  Melihat laporan pelanggaran (read-only)
-  Export laporan ke Excel

### 2. Guru BK
-  Mencatat pelanggaran siswa
-  Memberikan tindakan sekolah
-  Melihat laporan pelanggaran
-  Melihat tanggapan orang tua
-  Export laporan ke Excel
-  Melihat data siswa, kelas, jenis pelanggaran (read-only)

### 3. Orang Tua
-  Melihat laporan pelanggaran anak
-  Memberikan tanggapan atas pelanggaran
-  Melihat tindakan sekolah
-  Melihat data guru BK, kelas, jenis pelanggaran (read-only)

### 4. Siswa
-  Melihat riwayat pelanggaran diri sendiri
-  Melihat tindakan sekolah
-  Melihat data guru BK, kelas, jenis pelanggaran (read-only)

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
- `kelas_kejuruan` (contoh: UPW, TKJ, BDP, AKL)
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
Admin (1)  manages  (*) [All Entities]

Guru (1)  records  (*) PelanggaranSiswa
Guru (1)  gives  (*) TindakanSekolah

Siswa (*)  belongs to  (1) Kelas
Siswa (*)  has  (1) OrangTua
Siswa (1)  commits  (*) PelanggaranSiswa

OrangTua (1)  has  (*) Siswa
OrangTua (1)  gives  (*) TanggapanOrangTua

JenisPelanggaran (1)  categorizes  (*) PelanggaranSiswa

PelanggaranSiswa (1)  generates  (1) Laporan
PelanggaranSiswa (1)  receives  (*) TanggapanOrangTua
PelanggaranSiswa (1)  receives  (*) TindakanSekolah
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

### 📊 Entity Relationship Diagram (ERD)

**File Lengkap:** [`backend/ERD.puml`](../backend/ERD.puml) - Buka untuk diagram detail dengan PlantUML

#### Entitas Utama (14 Tabel)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CORE ENTITIES                                    │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    ADMIN     │       │     GURU     │       │    KELAS     │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id_admin PK  │       │ id_guru PK   │───┐   │ id_kelas PK  │
│ nama_admin   │       │ nama_guru    │   │   │ nama_kelas   │
│ email_admin  │       │ nik          │   │   │ kejuruan     │
│ password     │       │ email_guru   │   └──▶│ guruId FK    │
│ createdAt    │       │ password     │       │ createdAt    │
│ updatedAt    │       │ tempat_lahir │       │ updatedAt    │
│ deletedAt    │       │ tanggal_lahir│       │ deletedAt    │
└──────┬───────┘       │ jenis_kelamin│       └──────┬───────┘
       │               │ no_telepon   │              │
       │               │ createdAt    │              │
       │               │ updatedAt    │              │
       │               │ deletedAt    │              │
       │               └──────┬───────┘              │
       │                      │                      │
       │                      │                      │
       ▼                      ▼                      ▼
┌──────────────────┐   ┌─────────────────────────────────┐
│ JENIS_PELANGGARAN│   │          SISWA                  │
├──────────────────┤   ├─────────────────────────────────┤
│ id_jenis_pel. PK │   │ id_siswa PK                     │
│ nama_jenis       │   │ nama_siswa                      │
│ kategori ●       │   │ nis (unique)                    │
│ poin_pelanggaran │   │ nisn (unique)                   │
│ deskripsi        │   │ email_siswa                     │
│ tindakan_sekolah │   │ password                        │
│ admin_id FK ─────┼───┤ kelas_id FK ────────────────────┤
│ createdAt        │   │ orangTuaId FK                   │
│ updatedAt        │   │ jenis_kelamin                   │
│ deletedAt        │   │ tempat_lahir, tanggal_lahir     │
└──────┬───────────┘   │ alamat, no_telepon              │
       │               │ foto_profil                     │
       │               │ createdAt, updatedAt, deletedAt │
       │               └────────┬────────────────────┬───┘
       │                        │                    │
       │                        │                    │
       ▼                        ▼                    ▼
┌───────────────────────────────────────┐    ┌──────────────┐
│      PELANGGARAN_SISWA ●●●            │    │  ORANG_TUA   │
├───────────────────────────────────────┤    ├──────────────┤
│ id_pelanggaran_siswa PK               │    │ id_ortu PK   │
│ siswaId FK ───────────────────────────┼────│ nama_ayah    │
│ jenisPelanggaranId FK ────────────────┤    │ nama_ibu     │
│ guruId FK (pelapor)                   │    │ nik_ayah     │
│ tanggal_pelanggaran                   │    │ nik_ibu      │
│ tempat_kejadian                       │    │ email_ayah   │
│ kronologi                             │    │ email_ibu    │
│ catatan_konseling                     │    │ password     │
│ tindak_lanjut                         │    │ no_telepon   │
│ status_konseling                      │    │ pekerjaan    │
│ bukti_pelanggaran                     │    │ alamat       │
│ createdAt, updatedAt, deletedAt       │    │ pendidikan   │
└───────┬────────────────────┬──────────┘    │ penghasilan  │
        │                    │               │ createdAt    │
        │                    │               │ updatedAt    │
        ▼                    ▼               │ deletedAt    │
┌──────────────────┐  ┌──────────────────┐  └──────────────┘
│ TANGGAPAN_ORTU   │  │ TINDAKAN_SEKOLAH │
├──────────────────┤  ├──────────────────┤
│ id_tanggapan PK  │  │ id_tindakan PK   │
│ pelanggaranId FK │  │ pelanggaranId FK │
│ orangTuaId FK    │  │ guruId FK        │
│ tanggal_tanggapan│  │ tanggal_tindakan │
│ isi_tanggapan    │  │ jenis_tindakan ● │
│ tindakan_rumah   │  │ deskripsi        │
│ createdAt        │  │ hasil_tindakan   │
│ updatedAt        │  │ status_tindakan ●│
│ deletedAt        │  │ createdAt        │
└──────────────────┘  │ updatedAt        │
                      │ deletedAt        │
                      └──────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                     SUPPORTING ENTITIES                                 │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   NOTIFICATION   │  │  ACTIVITY_LOG    │  │  SAVED_FILTER    │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ id_notif PK      │  │ id_log PK        │  │ id_filter PK     │
│ userId FK        │  │ userId FK        │  │ userId FK        │
│ userType         │  │ userType         │  │ userType         │
│ title            │  │ action           │  │ filterName       │
│ message          │  │ target           │  │ filterType       │
│ type             │  │ targetId         │  │ filterData (JSON)│
│ isRead           │  │ details (JSON)   │  │ isDefault        │
│ relatedId        │  │ ipAddress        │  │ createdAt        │
│ relatedType      │  │ userAgent        │  │ updatedAt        │
│ createdAt        │  │ createdAt        │  └──────────────────┘
│ updatedAt        │  └──────────────────┘
└──────────────────┘

┌──────────────────┐  ┌──────────────────┐
│   FILE_UPLOAD    │  │     LAPORAN      │
├──────────────────┤  ├──────────────────┤
│ id_file PK       │  │ id_laporan PK    │
│ originalName     │  │ periode_awal     │
│ fileName         │  │ periode_akhir    │
│ filePath         │  │ total_pelanggaran│
│ fileType         │  │ total_tindakan   │
│ fileSize         │  │ total_poin       │
│ uploadedBy FK    │  │ jenis_laporan    │
│ uploaderType     │  │ guru_id FK       │
│ createdAt        │  │ tanggal_generate │
│ updatedAt        │  │ createdAt        │
└──────────────────┘  │ updatedAt        │
                      │ deletedAt        │
                      └──────────────────┘

● = ENUM values
●●● = Entitas utama/inti sistem
FK = Foreign Key
PK = Primary Key
```

#### Relasi Kunci

| From | Cardinality | To | Description |
|------|-------------|-----|-------------|
| Admin | 1 : M | JenisPelanggaran | Admin membuat kategori pelanggaran |
| Guru | 1 : M | Kelas | Guru sebagai wali kelas |
| Kelas | 1 : M | Siswa | Kelas memiliki banyak siswa |
| OrangTua | 1 : M | Siswa | Orang tua memiliki anak (siswa) |
| Siswa | 1 : M | PelanggaranSiswa | Siswa melakukan pelanggaran |
| Guru | 1 : M | PelanggaranSiswa | Guru mencatat pelanggaran |
| JenisPelanggaran | 1 : M | PelanggaranSiswa | Kategori pelanggaran |
| PelanggaranSiswa | 1 : M | TanggapanOrangTua | Pelanggaran mendapat tanggapan |
| PelanggaranSiswa | 1 : M | TindakanSekolah | Pelanggaran mendapat tindakan |
| OrangTua | 1 : M | TanggapanOrangTua | Orang tua memberi tanggapan |
| Guru | 1 : M | TindakanSekolah | Guru memberikan tindakan |
| Guru | 1 : M | Laporan | Guru membuat laporan |

#### Kategori Pelanggaran & Poin

| Kategori | Rentang Poin | Contoh |
|----------|--------------|---------|
| **Ringan** | 1 - 25 | Terlambat, tidak berseragam lengkap |
| **Sedang** | 26 - 50 | Bolos, tidak mengerjakan tugas |
| **Berat** | 51 - 100 | Berkelahi, merokok, narkoba |

---

### 🔄 Data Flow Diagram (DFD)

**File Lengkap:** [`backend/DFD.puml`](../backend/DFD.puml) - Buka untuk diagram detail dengan PlantUML

#### Level 0: Context Diagram

```
                    ┌─────────────────────┐
       ┌───────────▶│       ADMIN         │
       │            │ • Login             │
       │            │ • Kelola Data Master│
       │            └──────────┬──────────┘
       │                       │
       │                       ▼
       │            ┌──────────────────────────────┐
       │            │   SISTEM BIMBINGAN KONSELING │
       │            │      SMK N 1 Kupang          │
       │   ┌────────┤                              ├────────┐
       │   │        │  • Autentikasi               │        │
       │   │        │  • Data Management           │        │
       │   │        │  • Pelanggaran Recording     │        │
       │   │        │  • Reporting & Analytics     │        │
       │   │        │  • Real-time Notification    │        │
       │   │        └──────────────────────────────┘        │
       │   │                       ▲                         │
       │   ▼                       │                         ▼
┌──────────────┐           ┌──────────────┐         ┌──────────────┐
│   GURU BK    │           │    SISWA     │         │  ORANG TUA   │
├──────────────┤           ├──────────────┤         ├──────────────┤
│ • Login      │           │ • Login      │         │ • Login      │
│ • Input      │◀──────────┤ • Lihat      │         │ • Lihat      │
│   Pelanggaran│   Data    │   Riwayat    │         │   Laporan    │
│ • Beri       │   Siswa   │   Pelanggaran│         │   Anak       │
│   Tindakan   │           │ • Lihat Poin │         │ • Beri       │
│ • Lihat      │           │              │         │   Tanggapan  │
│   Tanggapan  │           │              │         │              │
└──────────────┘           └──────────────┘         └──────────────┘
       ▲                                                     │
       │                                                     │
       └─────────────────────────────────────────────────────┘
                    Notifikasi & Laporan
```

#### Level 1: Main Processes

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA STORES                                │
├─────────────────────────────────────────────────────────────────┤
│ [D1] Users (admin, guru, siswa, orang_tua)                      │
│ [D2] Master Data (kelas, jenis_pelanggaran)                     │
│ [D3] Pelanggaran (pelanggaran_siswa)                            │
│ [D4] Tanggapan & Tindakan (tanggapan, tindakan_sekolah)         │
│ [D5] Laporan (laporan, reports_cache)                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────┐
│  Admin   │───┐
│  Guru    │   │
│  Siswa   │   │ Credentials
│ Orang Tua│   │
└──────────┘   │
               ▼
        ┌──────────────────┐
        │  1.0 Manajemen   │
        │   Autentikasi    │◀──────▶ [D1: Users]
        │                  │
        │ • Login          │
        │ • Logout         │         Access Token
        │ • JWT Token      │─────────────────────┐
        │ • Session Mgmt   │                     │
        └──────────────────┘                     │
                                                 │
┌──────────┐                                     │
│  Admin   │──▶ CRUD Data                        │
└──────────┘                                     │
               ▼                                 ▼
        ┌──────────────────┐            ┌──────────────────┐
        │  2.0 Manajemen   │            │  3.0 Pencatatan  │
        │   Data Master    │◀──────▶ [D2]│   Pelanggaran    │
        │                  │            │                  │
        │ • Guru           │            │ • Input Form     │
        │ • Siswa          │            │ • Validasi Data  │
        │ • Kelas          │            │ • Hitung Poin    │
        │ • Jenis          │            │ • Update Total   │
        │   Pelanggaran    │            │   Poin Siswa     │
        └──────────────────┘            └────────┬─────────┘
                                                 │
                                                 ▼
                                        [D3: Pelanggaran]
                                                 │
                  ┌──────────────────────────────┼─────────────┐
                  │                              │             │
                  ▼                              ▼             ▼
        ┌──────────────────┐            ┌──────────────────┐  │
        │  4.0 Manajemen   │            │  6.0 Notifikasi  │  │
        │   Tanggapan &    │◀──────▶ [D4]│   Real-time      │  │
        │   Tindakan       │            │                  │  │
        │                  │            │ • Detect Event   │  │
        │ • Tanggapan Ortu │            │ • Push Notif     │  │
        │ • Tindakan       │            │ • Email Notif    │  │
        │   Sekolah        │            │ • WebSocket      │  │
        │ • Update Status  │            └──────────────────┘  │
        └──────────────────┘                     │            │
                                                 ▼            │
                                         ┌──────────────┐     │
                                         │ Orang Tua    │     │
                                         │ Guru BK      │     │
                                         │ Siswa        │     │
                                         └──────────────┘     │
                                                              │
┌──────────┐                                                  │
│ All Users│──▶ Request Laporan                              │
└──────────┘                                                  │
               ▼                                              │
        ┌──────────────────┐                                 │
        │  5.0 Pelaporan   │◀────────────────────────────────┘
        │   & Analitik     │
        │                  │◀──────▶ [D5: Laporan]
        │ • Filter Data    │
        │ • Aggregate      │
        │ • Generate       │
        │ • Export Excel   │
        │ • Dashboard      │
        └──────────────────┘
                │
                ▼
         Excel/PDF File
```

#### Level 2: Detail Process - Pencatatan Pelanggaran (3.0)

```
Guru BK
   │
   │ Input Form Pelanggaran
   ▼
┌────────────────────┐
│ 3.1 Input Data     │
│     Pelanggaran    │
└─────────┬──────────┘
          │
          │ Raw Data
          ▼
┌────────────────────┐        ┌─────────────┐
│ 3.2 Validasi Data  │◀──────▶│ [D2] Master │
│                    │        │     Data    │
│ • Cek Siswa Valid  │        └─────────────┘
│ • Cek Jenis        │
│   Pelanggaran      │
└─────────┬──────────┘
          │
          │ Validated Data + Poin
          ▼
┌────────────────────┐
│ 3.3 Hitung Poin    │
│                    │
│ • Get Poin dari    │
│   Jenis Pelanggaran│
│ • Calculate Total  │
└─────────┬──────────┘
          │
          │ Data + Total Poin
          ▼
┌────────────────────┐        ┌─────────────┐
│ 3.4 Simpan         │───────▶│ [D3]        │
│     Pelanggaran    │        │ Pelanggaran │
└─────────┬──────────┘        └─────────────┘
          │
          │ Update Signal
          ▼
┌────────────────────┐        ┌─────────────┐
│ 3.5 Update Total   │───────▶│ [D2] Siswa  │
│     Poin Siswa     │        │             │
└─────────┬──────────┘        └─────────────┘
          │
          │ Success + Notification Trigger
          ├─────────────────┐
          ▼                 ▼
        Guru BK      [6.0 Notifikasi]
    (Confirmation)         │
                          ▼
                     Orang Tua
                   (Real-time Alert)
```

#### Level 2: Detail Process - Tanggapan & Tindakan (4.0)

```
Orang Tua                    Guru BK
    │                           │
    │ Isi Tanggapan            │ Isi Tindakan
    ▼                           ▼
┌───────────────┐         ┌───────────────┐
│ 4.1 Beri      │         │ 4.2 Beri      │
│     Tanggapan │         │     Tindakan  │
│     Orang Tua │         │     Sekolah   │
└───────┬───────┘         └───────┬───────┘
        │                         │
        │ Tanggapan Data         │ Tindakan Data
        └──────────┬──────────────┘
                   ▼
         ┌────────────────────┐        ┌──────────────┐
         │ 4.4 Validasi &     │◀──────▶│ [D3]         │
         │     Simpan         │        │ Pelanggaran  │
         │                    │        └──────────────┘
         │ • Cek Pelanggaran  │
         │   Valid            │        ┌──────────────┐
         │ • Store Tanggapan  │───────▶│ [D4]         │
         │ • Store Tindakan   │        │ Tanggapan    │
         └─────────┬──────────┘        └──────────────┘
                   │
                   │ Update Signal    ┌──────────────┐
                   │                  │ [D4]         │
                   │                  │ Tindakan     │
                   │                  └──────────────┘
                   ▼
         ┌────────────────────┐        ┌──────────────┐
         │ 4.3 Update Status  │───────▶│ [D3]         │
         │     Konseling      │        │ Pelanggaran  │
         └─────────┬──────────┘        └──────────────┘
                   │
                   │ Confirmation
                   ├─────────────┐
                   ▼             ▼
              Orang Tua       Guru BK
            (Success Msg)   (Success Msg)
```

#### Aliran Data Kritikal

**Flow 1: Guru → Input Pelanggaran → Notifikasi Orang Tua**
```
Guru Input → Validasi → Hitung Poin → Simpan → Update Siswa → Trigger Notif → Orang Tua
```

**Flow 2: Orang Tua → Tanggapan → Notifikasi Guru**
```
Orang Tua Input → Validasi → Simpan Tanggapan → Update Status → Notif Guru
```

**Flow 3: Generate Laporan**
```
User Request → Filter Data → Aggregate → Generate Report → Export Excel/PDF
```

---

### 📁 Cara Melihat Diagram Lengkap

#### Option 1: PlantUML Online
1. Buka http://www.plantuml.com/plantuml/uml/
2. Copy paste isi file `backend/ERD.puml` atau `backend/DFD.puml`
3. Klik "Submit" untuk melihat diagram

#### Option 2: Generate Image Lokal
```bash
# Install PlantUML
choco install plantuml  # Windows
brew install plantuml   # Mac

# Generate diagrams
cd backend
plantuml ERD.puml    # → ERD.png
plantuml DFD.puml    # → DFD_001.png, DFD_002.png, ...
```

#### Option 3: VS Code Extension
1. Install extension: "PlantUML" by jebbs
2. Buka file `.puml`
3. Press `Alt+D` untuk preview

---

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
-  Multi-role Authentication (Admin, Guru, Siswa, Orang Tua)
-  Manajemen Data Master (Guru, Siswa, Orang Tua, Kelas, Jenis Pelanggaran)
-  Pencatatan Pelanggaran Siswa dengan Poin
-  Laporan Pelanggaran dengan Filter Bulan & Tahun
-  Tanggapan Orang Tua
-  Tindakan Sekolah
-  Dashboard Statistik Real-time
-  Dark/Light Mode dengan LocalStorage Persistence
-  Export Laporan ke Excel
-  Responsive Design (Mobile & Desktop)
-  Form Validation
-  Protected Routes per Role

## Struktur Folder
```
frontend/
 public/              # Static assets
 src/
    assets/          # Images, fonts
    components/      # Reusable components
       Layout.jsx
       ProtectedRoute.jsx
       ThemeToggle.jsx
       partials/
    contexts/        # React Context (Auth, Theme)
    hooks/           # Custom hooks
    lib/             # Axios configuration
    pages/           # Page components
       admin/
       guru/
       siswa/
       orangTua/
    utils/           # Utility functions
    App.jsx
    main.jsx
 package.json
```

## Backend Repository
Backend API tersedia di folder `backend/` dengan teknologi:
- Node.js + Express
- MySQL + Sequelize ORM
- JWT Authentication
- Pagination & Filtering

>  **Untuk setup backend lengkap**, lihat [Dokumentasi Utama](../README.md#-quick-start)

---

##  Navigation Links

- **[← Kembali ke Dokumentasi Utama](../README.md)** - Setup lengkap backend, database, dan API
- **[Quick Start Guide](../README.md#-quick-start)** - Install dan jalankan aplikasi
- **[Akun Testing](../README.md#-akun-login-testing)** - Login credentials untuk semua role
- **[Troubleshooting](../README.md#-troubleshooting)** - Solusi masalah umum

---

**Developed for SMK Negeri 1 Kupang**
© 2025 All Rights Reserved

---

## Notable Recent Changes (2025-11-04)

- All browser `alert(...)` calls in the frontend source have been replaced with `react-toastify` toasts for consistent, non-blocking user notifications.
- `ToastContainer` is already configured once in `src/App.jsx` and `react-toastify` is listed in `frontend/package.json` dependencies.
- If you still see `alert(...)` strings in `frontend/dist/` those are from a previous build — do not edit `dist` manually. Rebuild the frontend to regenerate the production bundle:

```bash
cd frontend
npm run build
```

- `window.confirm(...)` calls (confirmation dialogs) were intentionally left as-is. If you want them replaced with a custom modal/confirm component, open an issue or request the change and I can implement it separately.

*Last updated: 2025-11-04*