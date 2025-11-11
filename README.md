# Sistem Informasi Bimbingan Konseling
**SMK Negeri 1 Kupang**

> Aplikasi web modern untuk mengelola pencatatan pelanggaran siswa, laporan, dan komunikasi antara guru BK, siswa, dan orang tua.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-Educational-yellow.svg)](LICENSE)

---

## Dokumentasi

> **Mulai dari mana?**
> - Baru mulai? → Lihat [Quick Start](#quick-start)
> - Developer frontend? → Lihat [Struktur Project](#struktur-project) dan [Frontend Stack](#teknologi)
> - Ada masalah? → Cek [Troubleshooting](#troubleshooting)
> - Butuh API docs? → Lihat [API Endpoints](#api-endpoints)

## Table of Contents

- [Quick Start](#quick-start)
- [Akun Login Testing](#akun-login-testing)
- [Peran dan Fitur](#peran-dan-fitur)
- [Database Schema](#database-schema)
- [Desain Struktural Sistem](#desain-struktural-sistem)
  - [Entity Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
  - [Data Flow Diagram (DFD)](#data-flow-diagram-dfd)
- [Use Case Skenario](#use-case-skenario)
- [Teknologi](#teknologi)
- [Struktur Project](#struktur-project)
- [Backend Architecture](#backend-architecture)
- [Fitur Utama](#fitur-utama)
- [Security Features](#security-features)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Development Notes](#development-notes)

---

## Quick Start

### Option 1: Automatic Start (Windows)

**Cara Tercepat:**
1. Double-click file **`start-dev.bat`** di root folder
2. Tunggu backend dan frontend start otomatis
3. Browser akan terbuka di `http://localhost:5173`

> Script otomatis akan:
> - Check dan install dependencies jika belum ada
> - Start backend server (port 3000)
> - Start frontend server (port 5173)
> - Membuka 2 terminal windows terpisah

---

### Option 2: Manual Setup

#### Prerequisites
- Node.js v18+ ([Download](https://nodejs.org/))
- MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/))
- npm atau yarn
- Git

#### 1. Clone Repository
```bash
git clone https://github.com/acaxoxo/si-bimbingan-konseling-uas.git
cd si-bimbingan-konseling
```

#### 2. Setup Backend
```bash
cd backend
npm install
```

**Konfigurasi Environment:**

File `.env` sudah ada, update jika perlu:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=db_konseling
DB_DIALECT=mysql

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=rahasia_super_aman_bimbingan_konseling_smk1_kupang_2025
JWT_EXPIRES_IN=2h

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Buat Database:**
```sql
CREATE DATABASE db_konseling CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Jalankan Backend:**
```bash
npm run dev
```
Backend berjalan di: `http://localhost:3000`

#### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

File `.env` sudah tersedia:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Sistem Bimbingan Konseling
VITE_APP_SCHOOL=SMK Negeri 1 Kupang
```

**Jalankan Frontend:**
```bash
npm run dev
```
Frontend berjalan di: `http://localhost:5173`

#### 4. Seed Test Data (Opsional)
```bash
cd backend
npm run seed
```

Ini akan membuat akun testing untuk semua role.

---

### Verifikasi Setup

Buka browser ke `http://localhost:5173`

Anda akan melihat halaman login. Sistem siap digunakan!

---

## Akun Login Testing

Setelah menjalankan `npm run seed` di backend, gunakan akun berikut:

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| **Admin** | admin@smk1kupang.sch.id | admin123 | `/admin` |
| **Guru BK** | guru@smk1kupang.sch.id | guru123 | `/guru` |
| **Siswa** | siswa@smk1kupang.sch.id | siswa123 | `/siswa` |
| **Orang Tua** | orangtua@smk1kupang.sch.id | orangtua123 | `/orangtua` |

> **Catatan:** Ganti password default setelah deployment production!

### Demo Mode
Untuk testing tanpa seed data, Anda bisa register akun baru melalui halaman `/register`

---

## Peran dan Fitur

### Admin
- Kelola data guru BK, siswa, orang tua
- Kelola data kelas dan jenis pelanggaran  
- Lihat laporan pelanggaran
- Export data ke Excel

### Guru BK
- Catat pelanggaran siswa dengan poin
- Berikan tindakan sekolah
- Lihat tanggapan orang tua
- Buat laporan dan statistik

### Orang Tua
- Lihat laporan pelanggaran anak
- Berikan tanggapan atas pelanggaran
- Lihat tindakan sekolah

### Siswa
- Lihat riwayat pelanggaran sendiri
- Lihat tindakan sekolah
- Lihat poin pelanggaran

---

## Database Schema

### Entitas Utama

**1. Admin**
- id_admin, nama_admin, email, password

**2. Guru** 
- id_guru, nama_guru, nik, email, password, telepon, alamat

**3. Siswa**
- id_siswa, nama_siswa, nis, nisn, email, password
- id_kelas (FK), id_orang_tua (FK)

**4. Orang Tua**
- id_orang_tua, nama_orang_tua, nik, email, password, pekerjaan

**5. Kelas**
- id_kelas, nama_kelas, kelas_kejuruan

**6. Jenis Pelanggaran**
- id_jenis_pelanggaran, nama_jenis_pelanggaran
- kategori_pelanggaran (Ringan/Sedang/Berat)
- poin_pelanggaran

**7. Pelanggaran Siswa**
- id_pelanggaran_siswa
- id_siswa (FK), id_jenis_pelanggaran (FK), id_guru (FK)
- tanggal_pelanggaran, kronologi, tindak_lanjut

**8. Tanggapan Orang Tua**
- id_tanggapan, id_pelanggaran_siswa (FK)
- id_orang_tua (FK), tanggapan

**9. Tindakan Sekolah**
- id_tindakan, id_pelanggaran_siswa (FK)
- jenis_tindakan, deskripsi_tindakan

**10. Laporan**
- id_laporan, id_pelanggaran_siswa (FK)
- tanggal_laporan, status_laporan

### Relasi
```
Guru (1)  records  (*) PelanggaranSiswa
Siswa (1)  commits  (*) PelanggaranSiswa
Siswa (*)  belongs to  (1) Kelas
Siswa (*)  has  (1) OrangTua
JenisPelanggaran (1)  categorizes  (*) PelanggaranSiswa
PelanggaranSiswa (1)  receives  (*) TanggapanOrangTua
PelanggaranSiswa (1)  receives  (*) TindakanSekolah
```

---

## Desain Struktural Sistem

### Entity Relationship Diagram (ERD)

**Lokasi File:** `backend/ERD.puml`

ERD menggambarkan struktur database lengkap dengan 14 entitas utama dan pendukung:

#### Entitas Utama (Core Tables)
1. **Admin** - Administrator sistem
2. **Guru** - Guru Bimbingan Konseling
3. **Siswa** - Data siswa dengan NIS/NISN
4. **Orang Tua** - Data orang tua/wali siswa
5. **Kelas** - Data kelas dan kejuruan
6. **Jenis Pelanggaran** - Kategori pelanggaran dengan poin
7. **Pelanggaran Siswa** - Record pelanggaran (entity utama)
8. **Tanggapan Orang Tua** - Respon orang tua terhadap pelanggaran
9. **Tindakan Sekolah** - Tindak lanjut sekolah
10. **Laporan** - Laporan periodik

#### Entitas Pendukung (Supporting Tables)
11. **Notification** - Sistem notifikasi real-time
12. **Activity Log** - Audit trail semua aktivitas
13. **Saved Filter** - Filter tersimpan per user
14. **File Upload** - Metadata file upload

#### Relasi Utama (Key Relationships)
```
Admin (1) ──creates──> (*) JenisPelanggaran
Guru (1) ──wali_kelas──> (0..*) Kelas
Kelas (1) ──has──> (0..*) Siswa
OrangTua (1) ──has_children──> (0..*) Siswa
Siswa (1) ──commits──> (0..*) PelanggaranSiswa
Guru (1) ──reports──> (0..*) PelanggaranSiswa
JenisPelanggaran (1) ──categorizes──> (0..*) PelanggaranSiswa
PelanggaranSiswa (1) ──receives_responses──> (0..*) TanggapanOrangTua
PelanggaranSiswa (1) ──receives_actions──> (0..*) TindakanSekolah
OrangTua (1) ──gives_responses──> (0..*) TanggapanOrangTua
Guru (1) ──executes_actions──> (0..*) TindakanSekolah
Guru (1) ──generates_reports──> (0..*) Laporan
```

**Notasi Kardinalitas:**
- `(1)` = Exactly one (satu)
- `(0..*)` = Zero or more (nol atau banyak)
- `(1..*)` = One or more (satu atau banyak)

**Catatan Penting:**
- Relasi menggunakan `0..*` karena data bisa tidak ada saat pertama kali (fresh install)
- Semua foreign key nullable kecuali yang marked sebagai `NOT NULL`
- Soft delete aktif di semua tabel utama untuk audit trail

#### Fitur Database
- **Primary Keys:** Auto-increment integer
- **Foreign Keys:** Indexed untuk performance
- **Unique Constraints:** Email, NIS, NISN, NIK
- **Soft Delete:** `deletedAt` timestamp untuk audit
- **Timestamps:** `createdAt`, `updatedAt` otomatis
- **Data Types:** VARCHAR, TEXT, INT, DATE, TIMESTAMP, ENUM, JSON, DECIMAL

#### Cara Melihat ERD
```bash
# Install PlantUML (jika belum)
# Windows: choco install plantuml
# Mac: brew install plantuml
# Linux: sudo apt install plantuml

# Generate diagram
cd backend
plantuml ERD.puml

# Output: ERD.png
```

**Online Viewer:**  
Buka [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/) dan paste isi `ERD.puml`

---

### Data Flow Diagram (DFD)

**Lokasi File:** `backend/DFD.puml`

DFD menggambarkan aliran data dalam sistem dengan 3 level detail:

#### Level 0: Context Diagram
Menampilkan sistem secara keseluruhan dengan 4 external entities:
- **Admin** → Kelola data master, lihat laporan
- **Guru BK** → Input pelanggaran, beri tindakan
- **Siswa** → Lihat riwayat pelanggaran
- **Orang Tua** → Beri tanggapan, terima notifikasi

#### Level 1: Main Processes
6 proses utama dengan data stores:

**Processes:**
1. **1.0 Manajemen Autentikasi** - Login, logout, JWT token
2. **2.0 Manajemen Data Master** - CRUD Admin, Guru, Siswa, Kelas, dll.
3. **3.0 Pencatatan Pelanggaran** - Input dan tracking pelanggaran
4. **4.0 Manajemen Tanggapan & Tindakan** - Respon ortu & tindak lanjut
5. **5.0 Pelaporan & Analitik** - Generate laporan & statistik
6. **6.0 Notifikasi Real-time** - WebSocket & email notifications

**Data Stores:**
- **D1:** User Database (admin, guru, siswa, orang_tua)
- **D2:** Master Data (kelas, jenis_pelanggaran)
- **D3:** Pelanggaran (pelanggaran_siswa)
- **D4:** Tanggapan & Tindakan (tanggapan_orang_tua, tindakan_sekolah)
- **D5:** Laporan (laporan)

#### Level 2: Detailed Processes

**2.1 Authentication Process (1.0)**
```
1.1 Validasi Credentials → 1.2 Verifikasi Password
   → 1.3 Generate JWT Token → 1.4 Create Session
```

**2.2 Violation Recording (3.0)**
```
3.1 Input Data Pelanggaran → 3.2 Validasi Data
   → 3.3 Hitung Poin → 3.4 Simpan Pelanggaran
   → 3.5 Update Total Poin Siswa
```

**2.3 Response & Action (4.0)**
```
4.1 Beri Tanggapan Orang Tua ──┐
4.2 Beri Tindakan Sekolah ──────┼→ 4.4 Validasi & Simpan
                                 │      → 4.3 Update Status
```

**2.4 Reporting (5.0)**
```
5.1 Terima Request → 5.2 Filter & Kumpulkan Data
   → 5.3 Proses Analitik → 5.4 Generate Report
   → 5.5 Export (Excel/PDF)
```

**2.5 Notification (6.0)**
```
6.1 Detect Event → 6.2 Identify Recipients
   → 6.3 Create Notification ──┬→ 6.4 Send Email
                                └→ 6.5 Send WebSocket
```

#### Aliran Data Kritikal

**Flow 1: Guru Mencatat Pelanggaran**
```
Guru → [3.1 Input Data] → [3.2 Validasi] → [D2 Master Data]
    → [3.3 Hitung Poin] → [3.4 Simpan] → [D3 Pelanggaran]
    → [3.5 Update Poin] → [D2 Siswa]
    → [6.0 Notifikasi] → Orang Tua
```

**Flow 2: Orang Tua Beri Tanggapan**
```
Orang Tua → [4.1 Beri Tanggapan] → [4.4 Validasi & Simpan]
    → [D4 Tanggapan] → [4.3 Update Status] → [D3 Pelanggaran]
    → [6.0 Notifikasi] → Guru BK
```

**Flow 3: Generate Laporan**
```
User → [5.1 Request] → [5.2 Filter Data] → [D3, D4, D5]
    → [5.3 Analitik] → [5.4 Generate] → [5.5 Export]
    → Excel/PDF → User
```

#### Cara Melihat DFD
```bash
# Generate diagram
cd backend
plantuml DFD.puml

# Output: Multiple pages (DFD_001.png, DFD_002.png, ...)
```

**Online Viewer:**  
Buka [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/) dan paste isi `DFD.puml`

---

## Use Case Skenario

### Skenario 1: Guru Mencatat Pelanggaran
1. Guru login → Dashboard
2. Menu "Pelanggaran Siswa" → "Tambah Pelanggaran"
3. Pilih siswa, jenis pelanggaran
4. Isi tanggal, tempat, kronologi
5. Simpan → Poin otomatis ditambahkan
6. Notifikasi terkirim ke orang tua

**Detail Lengkap:**
1. Guru login ke sistem dengan email dan password
2. Guru membuka menu "Pelanggaran Siswa" dari sidebar
3. Guru klik tombol "Tambah Pelanggaran"
4. Guru memilih siswa dari dropdown (auto-complete)
5. Guru memilih jenis pelanggaran dari dropdown
6. Guru mengisi tanggal pelanggaran, tempat kejadian, dan kronologi detail
7. Guru menyimpan data pelanggaran
8. Sistem mencatat pelanggaran dan menambahkan poin ke total siswa
9. Sistem mengirim notifikasi real-time ke orang tua siswa
10. Guru menerima konfirmasi pelanggaran berhasil dicatat

### Skenario 2: Orang Tua Memberikan Tanggapan
1. Orang tua login → "Laporan Anak Saya"
2. Lihat daftar pelanggaran
3. Klik "Tanggapi" 
4. Isi tanggapan → Simpan
5. Guru BK menerima notifikasi

**Detail Lengkap:**
1. Orang tua login ke sistem dengan email dan password
2. Orang tua membuka menu "Laporan Anak Saya" dari dashboard
3. Orang tua melihat daftar pelanggaran anak (terbaru di atas)
4. Orang tua klik tombol "Tanggapi" pada pelanggaran tertentu
5. Orang tua mengisi tanggapan dan tindakan yang akan diambil di rumah
6. Orang tua menyimpan tanggapan
7. Sistem mencatat tanggapan dan memberi notifikasi real-time ke guru BK
8. Status pelanggaran diupdate menjadi "Ditanggapi"

### Skenario 3: Admin Kelola Data Master
1. Admin login → Menu "Data Guru/Siswa/Kelas"
2. Klik "Tambah Data"
3. Isi form lengkap → Simpan
4. Data tersimpan di database

**Detail Lengkap:**
1. Admin login ke sistem dengan email dan password
2. Admin membuka menu "Data Guru", "Data Siswa", atau "Data Kelas"
3. Admin klik tombol "Tambah Data"
4. Admin mengisi form dengan data lengkap:
   - Untuk Guru: NIK, nama, email, password, alamat, telepon, dll
   - Untuk Siswa: NIS, NISN, nama, kelas, orang tua, dll
   - Untuk Kelas: Nama kelas, kejuruan, wali kelas
5. Admin menyimpan data
6. Sistem memvalidasi data (cek duplikat email, NIK, NIS)
7. Data baru tersimpan di database
8. Data baru muncul di tabel dengan status aktif

### Skenario 4: Guru BK Memberikan Tindakan Sekolah
1. Guru login ke sistem
2. Guru membuka menu "Pelanggaran Siswa"
3. Guru klik tombol "Detail" pada pelanggaran tertentu
4. Guru melihat detail lengkap pelanggaran dan tanggapan orang tua
5. Guru klik tombol "Tambah Tindakan"
6. Guru memilih jenis tindakan (Teguran/Peringatan/Skorsing/Lainnya)
7. Guru mengisi deskripsi tindakan dan tanggal pelaksanaan
8. Guru menyimpan tindakan
9. Sistem mencatat tindakan dan update status pelanggaran
10. Notifikasi terkirim ke siswa dan orang tua

### Skenario 5: Export Laporan ke Excel
1. User login ke sistem
2. User membuka menu "Laporan Pelanggaran"
3. User memilih filter:
   - Rentang tanggal (dari - sampai)
   - Kelas tertentu (opsional)
   - Kategori pelanggaran (opsional)
4. User klik tombol "Export Excel"
5. Sistem generate file Excel dengan data terfilter
6. File Excel otomatis terdownload ke komputer user
7. File berisi: No, Nama Siswa, Kelas, Jenis Pelanggaran, Poin, Tanggal, Tindakan

---

## Teknologi

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v18+ | Runtime environment |
| **Express.js** | v5.1.0 | Web framework |
| **MySQL** | v8.0+ | Database |
| **Sequelize** | v6.37.7 | ORM |
| **JWT** | v9.0.2 | Authentication |
| **bcrypt** | v6.0.0 | Password hashing |
| **Socket.io** | v4.8.1 | Real-time notifications |
| **Nodemailer** | v7.0.10 | Email service |
| **Multer** | v2.0.2 | File uploads |
| **express-validator** | v7.2.1 | Input validation |

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | v19.1.1 | UI framework |
| **Vite** | v7.1.7 | Build tool & dev server |
| **React Router** | v7.9.3 | Routing |
| **Axios** | v1.12.2 | HTTP client |
| **Bootstrap** | v5.3.8 | UI components |
| **React Toastify** | v11.0.5 | Notifications |
| **Recharts** | v3.3.0 | Charts & graphs |
| **XLSX** | v0.18.5 | Excel export |
| **jsPDF** | v3.0.3 | PDF generation |

### Development Tools
- **nodemon** - Auto-restart server
- **ESLint** - Code linting
- **Git** - Version control

---

## Struktur Project

```
si-bimbingan-konseling/
├── backend/
│   ├── config/
│   │   └── database.js              # Database configuration with pooling
│   ├── controllers/
│   │   ├── AuthController.js        # Login, register, refresh token
│   │   ├── AdminController.js       # Admin CRUD
│   │   ├── GuruController.js        # Guru BK CRUD
│   │   ├── SiswaController.js       # Siswa CRUD
│   │   ├── OrangTuaController.js    # Orang tua CRUD
│   │   ├── KelasController.js       # Kelas CRUD
│   │   ├── JenisPelanggaranController.js
│   │   ├── PelanggaranSiswaController.js
│   │   ├── TanggapanOrangTuaController.js
│   │   ├── TindakanSekolahController.js
│   │   ├── LaporanController.js
│   │   ├── NotificationController.js
│   │   ├── VisualizationController.js
│   │   ├── BackupController.js
│   │   └── SavedFilterController.js
│   ├── 📁 models/
│   │   ├── AdminModel.js
│   │   ├── GuruModel.js
│   │   ├── SiswaModel.js
│   │   ├── OrangTuaModel.js
│   │   ├── KelasModel.js
│   │   ├── JenisPelanggaranModel.js
│   │   ├── PelanggaranSiswaModel.js
│   │   ├── TanggapanOrangTuaModel.js
│   │   ├── TindakanSekolahModel.js
│   │   ├── LaporanModel.js
│   │   ├── NotificationModel.js
│   │   ├── ActivityLogModel.js
│   │   ├── SavedFilterModel.js
│   │   ├── FileUploadModel.js
│   │   └── associations.js          # Model relationships
│   ├── 📁 routes/
│   │   └── ... (15 route files)
│   ├── 📁 middleware/
│   │   ├── verifyToken.js           # JWT verification
│   │   ├── authErrorHandler.js      # Auth error handling
│   │   ├── errorHandler.js          # Global error handler
│   │   ├── logger.js                # Request logger
│   │   ├── rateLimiter.js           # Rate limiting
│   │   ├── upload.js                # File upload config
│   │   └── activityLogger.js        # Activity logging
│   ├── 📁 services/
│   │   ├── backupService.js         # Auto backup
│   │   ├── emailService.js          # Email notifications
│   │   ├── notificationService.js   # Push notifications
│   │   └── socketService.js         # WebSocket
│   ├── 📁 scripts/
│   │   ├── seedUsers.js             # Seed test data
│   │   ├── resetPasswords.js        # Reset passwords
│   │   └── add_timestamps.js        # Migration helper
│   ├── 📁 uploads/
│   │   ├── documents/               # Document uploads
│   │   └── profiles/                # Profile pictures
│   ├── server.js                    # Main server file
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Env template
│   ├── package.json
│   └── ERD.puml                     # Database diagram
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Layout.jsx           # Main layout wrapper
│   │   │   ├── ProtectedRoute.jsx   # Route guard
│   │   │   ├── ThemeToggle.jsx      # Dark/Light mode
│   │   │   ├── ErrorBoundary.jsx    # Error catcher
│   │   │   ├── Loading.jsx          # Loading spinner
│   │   │   ├── Pagination.jsx       # Pagination component
│   │   │   ├── Breadcrumbs.jsx      # Breadcrumb navigation
│   │   │   └── 📁 partials/         # Header, Sidebar, Footer
│   │   ├── 📁 contexts/
│   │   │   ├── AuthContext.jsx      # Auth context
│   │   │   ├── AuthProvider.jsx     # Auth state management
│   │   │   └── ThemeContext.jsx     # Theme management
│   │   ├── 📁 pages/
│   │   │   ├── 📁 admin/            # Admin pages (10 pages)
│   │   │   ├── 📁 guru/             # Guru pages (7 pages)
│   │   │   ├── 📁 siswa/            # Siswa pages (11 pages)
│   │   │   ├── 📁 orangTua/         # Orang tua pages (8 pages)
│   │   │   ├── 📁 kelas/            # Kelas pages
│   │   │   ├── 📁 JenisPelanggaran/ # Jenis pelanggaran pages
│   │   │   ├── 📁 pelanggaranSiswa/ # Pelanggaran pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Unauthorized.jsx
│   │   ├── 📁 lib/
│   │   │   └── axios.js             # Axios config with interceptors
│   │   ├── 📁 utils/
│   │   │   ├── validation.js        # Form validation
│   │   │   └── pagination.js        # Pagination helper
│   │   ├── 📁 hooks/
│   │   │   └── useAuth.js           # Auth hook
│   │   ├── App.jsx                  # Main app with routes
│   │   ├── main.jsx                 # Entry point
│   │   ├── App.css
│   │   └── index.css
│   ├── 📁 public/                   # Static assets
│   ├── .env                         # Vite env variables
│   ├── vite.config.js               # Vite configuration
│   ├── package.json
│   ├── eslint.config.js
│   └── README.md                    # Frontend docs
│
├── 📄 README.md                     # Main documentation (this file)
├── 📄 start-dev.bat                 # Windows auto-start script
```

### Statistics
- **Backend Files:** 80+ files
- **Frontend Files:** 60+ pages & components
- **Total Lines:** ~15,000+ LOC
- **API Endpoints:** 50+ endpoints
- **Database Tables:** 14 tables

---

## Fitur Utama

### Authentication & Authorization
- Multi-role authentication (Admin, Guru, Siswa, Orang Tua)
- JWT token with refresh mechanism
- Protected routes per role
- Secure password hashing (bcrypt)
- Session management

### Dashboard & Analytics
- Real-time statistics per role
- Interactive charts & graphs (Recharts)
- Violation trends visualization
- Student performance metrics
- Class-based analytics

### Data Management (CRUD)
- **Admin Management** - Kelola admin sistem
- **Guru BK Management** - Data guru bimbingan konseling
- **Siswa Management** - Data siswa lengkap dengan kelas
- **Orang Tua Management** - Data orang tua/wali
- **Kelas Management** - Data kelas dan kejuruan
- **Jenis Pelanggaran** - Kategori pelanggaran dengan poin

### Violation Management
- **Pencatatan Pelanggaran** - Guru BK catat pelanggaran siswa
- **Sistem Poin Otomatis** - Poin ditambahkan otomatis
- **Kronologi Detail** - Catatan lengkap kejadian
- **File Attachment** - Upload bukti/dokumen
- **Tanggapan Orang Tua** - Orang tua beri tanggapan
- **Tindakan Sekolah** - Guru BK tentukan tindak lanjut

### Reporting & Export
- **Export to Excel** - Download laporan dalam format .xlsx
- **Export to PDF** - Generate PDF reports
- **Filter & Search** - Filter berdasarkan berbagai kriteria
- **Saved Filters** - Simpan filter yang sering digunakan
- **Date Range Filter** - Filter berdasarkan periode

### Notifications
- **Real-time Notifications** - Socket.io untuk notif instant
- **Email Notifications** - Kirim email ke orang tua
- **Toast Notifications** - Feedback visual untuk aksi user
- **Activity Logging** - Log semua aktivitas penting

### User Experience
- **Dark/Light Mode** - Toggle tema dengan persistence
- **Responsive Design** - Mobile, tablet, desktop friendly
- **Loading States** - Feedback saat loading data
- **Error Boundary** - Tangani error dengan graceful
- **Form Validation** - Client & server side validation
- **Pagination** - Navigasi data yang besar

### Security Features
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt dengan 10 rounds
- **Role-Based Access Control (RBAC)** - Akses sesuai role
- **Input Validation** - Cegah injection attacks
- **CORS Protection** - Konfigurasi CORS yang aman
- **Rate Limiting** - Cegah brute force attacks
- **SQL Injection Prevention** - Menggunakan Sequelize ORM

### Backup & Recovery
- **Automated Backups** - Backup database otomatis (cron)
- **Manual Backup** - Admin bisa backup manual
- **Database Export** - Export database ke file

### Additional Features
- **WebSocket Support** - Real-time communication
- **File Upload** - Upload dokumen & foto profil
- **Search Functionality** - Pencarian di semua tabel
- **Breadcrumb Navigation** - Navigasi yang jelas
- **Error Handling** - Comprehensive error messages

---

## Security Features

### Authentication
- **JWT (JSON Web Token)** - Stateless authentication
  - Access token expires in 2 hours
  - Refresh token mechanism
  - Token stored in localStorage
  - Auto logout on token expiration

### Password Security
- **bcrypt Hashing** - Industry standard password hashing
  - 10 salt rounds
  - One-way encryption
  - Rainbow table resistant

### Authorization
- **Role-Based Access Control (RBAC)**
  - 4 distinct roles: Admin, Guru, Siswa, Orang Tua
  - Route-level protection
  - API endpoint protection with middleware
  - Granular permissions per feature

### Attack Prevention
- **SQL Injection** - Prevented by Sequelize ORM parameterized queries
- **XSS (Cross-Site Scripting)** - Input sanitization & validation
- **CSRF** - CORS configuration & token validation
- **Brute Force** - Rate limiting on login/register endpoints
  - Login: 5 attempts per 15 minutes
  - Register: 3 attempts per 15 minutes
  - API: 100 requests per 15 minutes

### Network Security
- **CORS (Cross-Origin Resource Sharing)**
  - Whitelist allowed origins
  - Credentials support
  - Specific headers allowed
  - Development & production modes

### Input Validation
- **express-validator** - Server-side validation
  - Email format validation
  - Required field checks
  - Data type validation
  - Length constraints
- **Client-side Validation** - React form validation
  - Real-time feedback
  - Error messages per field
  - Prevent invalid submissions

### Audit & Logging
- **Activity Logger** - Track all user actions
  - Login/logout timestamps
  - CRUD operations
  - User IP & user agent
  - Failed login attempts

### Database Security
- **Connection Pooling** - Prevent connection exhaustion
  - Max 5 connections
  - Connection timeout: 60s
  - Idle timeout: 10s
- **Prepared Statements** - Sequelize ORM prevents SQL injection
- **Environment Variables** - Sensitive data in .env file

### Error Handling
- **Global Error Handler** - Catch all errors
- **Auth Error Handler** - Specific auth errors
- **Error Boundary** - React error boundary
- **Production Mode** - Hide sensitive error details

---

## Backend Architecture

### Technology Stack

#### Core Framework
- **Node.js v18+** - JavaScript runtime environment
- **Express.js v5.1.0** - Fast, minimalist web framework
- **MySQL 8.0+** - Relational database management system
- **Sequelize v6.37.7** - Promise-based ORM for Node.js

#### Security & Authentication
- **JWT (jsonwebtoken v9.0.2)** - Stateless authentication
- **bcrypt v6.0.0** - Password hashing with salt rounds
- **express-validator v7.2.1** - Input validation & sanitization
- **express-rate-limit v8.1.0** - Rate limiting middleware
- **CORS v2.8.5** - Cross-Origin Resource Sharing

#### File Handling & Storage
- **Multer v2.0.2** - File upload middleware
- **Archiver v7.0.1** - Backup creation (zip files)
- **extract-zip v2.0.1** - Backup restoration

#### Real-time & Notifications
- **Socket.io v4.8.1** - WebSocket for real-time features
- **Nodemailer v7.0.10** - Email notifications
- **node-cron v4.2.1** - Task scheduling (automated backups)

### Architecture Pattern

**MVC (Model-View-Controller) with Service Layer**

```
┌─────────────────────────────────────────────────────────┐
│                      Client Request                      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   Middleware Layer                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ • CORS       • Rate Limiter   • Logger          │   │
│  │ • Auth       • Error Handler  • Upload          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                     Routes Layer                         │
│  /api/auth  /api/admin  /api/guru  /api/siswa  ...      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  Controllers Layer                       │
│  Business logic, Request validation, Response formatting │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   Services Layer                         │
│  • Notification Service  • Email Service                 │
│  • Backup Service        • Socket Service                │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Models Layer                          │
│  Sequelize ORM Models with Associations                  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  MySQL Database                          │
│  14 Tables with Relationships                            │
└─────────────────────────────────────────────────────────┘
```

### Directory Structure Explained

```
backend/
├── 📁 config/
│   └── database.js              # MySQL connection with pooling
│
├── 📁 models/                   # Sequelize Models (ORM)
│   ├── AdminModel.js            # Admin table schema
│   ├── GuruModel.js             # Teacher table schema
│   ├── SiswaModel.js            # Student table schema
│   ├── OrangTuaModel.js         # Parent table schema
│   ├── KelasModel.js            # Class table schema
│   ├── JenisPelanggaranModel.js # Violation type schema
│   ├── PelanggaranSiswaModel.js # Student violation schema
│   ├── TanggapanOrangTuaModel.js # Parent response schema
│   ├── TindakanSekolahModel.js  # School action schema
│   ├── LaporanModel.js          # Report schema
│   ├── NotificationModel.js     # Notification schema
│   ├── ActivityLogModel.js      # Activity log schema
│   ├── SavedFilterModel.js      # Saved filter schema
│   ├── FileUploadModel.js       # File metadata schema
│   └── associations.js          # Model relationships
│
├── 📁 controllers/              # Business Logic
│   ├── AuthController.js        # Login, register, JWT refresh
│   ├── AdminController.js       # Admin CRUD operations
│   ├── GuruController.js        # Teacher CRUD operations
│   ├── SiswaController.js       # Student CRUD operations
│   ├── OrangTuaController.js    # Parent CRUD operations
│   ├── KelasController.js       # Class CRUD operations
│   ├── JenisPelanggaranController.js  # Violation type CRUD
│   ├── PelanggaranSiswaController.js  # Violation CRUD
│   ├── TanggapanOrangTuaController.js # Response CRUD
│   ├── TindakanSekolahController.js   # Action CRUD
│   ├── LaporanController.js     # Reports & analytics
│   ├── NotificationController.js # Notification management
│   ├── VisualizationController.js # Charts & graphs data
│   ├── BackupController.js      # Database backup/restore
│   ├── SavedFilterController.js # Saved filters
│   ├── ActivityLogController.js # Activity logging
│   └── FileUploadController.js  # File uploads
│
├── 📁 routes/                   # API Routes
│   ├── AuthRoute.js             # /api/auth/*
│   ├── AdminRoute.js            # /api/admin/*
│   ├── GuruRoute.js             # /api/guru/*
│   ├── SiswaRoute.js            # /api/siswa/*
│   ├── OrangTuaRoute.js         # /api/orang-tua/*
│   ├── KelasRoute.js            # /api/kelas/*
│   ├── JenisPelanggaranRoute.js # /api/jenis-pelanggaran/*
│   ├── PelanggaranSiswaRoute.js # /api/pelanggaran-siswa/*
│   ├── TanggapanOrangTuaRoute.js # /api/tanggapan/*
│   ├── TindakanSekolahRoute.js  # /api/tindakan/*
│   ├── LaporanRoute.js          # /api/laporan/*
│   ├── NotificationRoute.js     # /api/notifications/*
│   ├── VisualizationRoute.js    # /api/visualization/*
│   ├── BackupRoute.js           # /api/backup/*
│   ├── SavedFilterRoute.js      # /api/saved-filters/*
│   ├── ActivityLogRoute.js      # /api/activity-logs/*
│   └── FileUploadRoute.js       # /api/file-upload/*
│
├── 📁 middleware/               # Custom Middleware
│   ├── verifyToken.js           # JWT verification
│   ├── authErrorHandler.js      # Auth-specific errors
│   ├── errorHandler.js          # Global error handler
│   ├── logger.js                # Request logging
│   ├── rateLimiter.js           # Rate limiting config
│   ├── upload.js                # Multer configuration
│   ├── activityLogger.js        # Log user activities
│   └── middleware.js            # Helper middleware
│
├── 📁 services/                 # Business Services
│   ├── backupService.js         # Auto backup scheduler
│   ├── emailService.js          # Email notifications
│   ├── notificationService.js   # Push notifications
│   └── socketService.js         # WebSocket handlers
│
├── 📁 scripts/                  # Utility Scripts
│   ├── seedUsers.js             # Seed test data
│   ├── resetPasswords.js        # Reset all passwords
│   ├── fixAdminPassword.js      # Fix admin password
│   ├── testLogin.js             # Test login endpoint
│   ├── testRegister.js          # Test register endpoint
│   ├── verifyLogin.js           # Verify login works
│   ├── add_timestamps.js        # Add timestamps to tables
│   ├── check_active_data.js     # Check soft delete status
│   └── check_tindakan_sekolah.js # Check tindakan data
│
├── 📁 migrations/               # Database Migrations
│   ├── add_tindakan_sekolah_column.js
│   ├── addUniqueConstraints.js
│   └── update_unique_indexes_soft_delete.js
│
├── 📁 uploads/                  # File Storage
│   ├── documents/               # Document files
│   └── profiles/                # Profile pictures
│
├── 📁 utils/                    # Utilities
│   └── pagination.js            # Pagination helper
│
├── server.js                    # Main server entry point
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── package.json                 # Dependencies & scripts
└── ERD.puml                     # Database diagram (PlantUML)
```

### Key Features Implementation

#### 1. Authentication Flow
```javascript
// JWT-based authentication with refresh token
1. User submits credentials → AuthController.login
2. Verify credentials with bcrypt
3. Generate access token (2h expiry)
4. Return token + user data
5. Frontend stores token in localStorage
6. Each request includes: Authorization: Bearer <token>
7. verifyToken middleware validates token
8. Expired? → Use refresh endpoint
```

#### 2. Authorization (RBAC)
```javascript
// Role-Based Access Control
Roles: ['admin', 'guru', 'siswa', 'orang_tua']

// Middleware checks
verifyToken → authorizeRoles(['admin', 'guru'])

// Example: Only admin can create jenis pelanggaran
POST /api/jenis-pelanggaran
  → verifyToken
  → authorizeRoles(['admin'])
  → JenisPelanggaranController.create
```

#### 3. Database Connection Pooling
```javascript
// config/database.js
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql',
  pool: {
    max: 5,          // Maximum connections
    min: 0,          // Minimum connections
    acquire: 60000,  // Max time to get connection
    idle: 10000      // Max idle time
  }
});
```

#### 4. Input Validation
```javascript
// Using express-validator
POST /api/admin
  → Validation rules:
    - email: must be valid email
    - nama_admin: required, min 3 chars
    - password: required, min 6 chars
  → Validation errors? → 400 Bad Request
  → Valid? → Continue to controller
```

#### 5. Error Handling
```javascript
// Three-layer error handling
1. Try-catch in controllers
2. authErrorHandler - Auth-specific errors
3. errorHandler - Global error handler

// Production mode: Hide sensitive details
// Development mode: Show full stack trace
```

#### 6. Real-time Notifications
```javascript
// Socket.io implementation
1. Client connects → socketService.js
2. Join room by userId
3. Event occurs (new violation)
   → notificationService.createNotification()
   → Emit to specific user's room
4. Client receives real-time update
```

#### 7. File Upload
```javascript
// Multer configuration
1. Client uploads file → /api/file-upload/upload
2. Multer middleware validates:
   - File size < 5MB
   - File type (images, PDF, docs)
3. Store in uploads/ with unique filename
4. Save metadata to database
5. Return file URL
```

#### 8. Automated Backups
```javascript
// node-cron scheduler
1. Cron job runs daily at 2 AM
2. backupService.createBackup()
3. Export database to .sql file
4. Compress to .zip
5. Store in uploads/backups/
6. Delete backups older than 30 days
```

### API Response Standards

#### Success Response
```javascript
{
  success: true,
  data: { ... },
  message: "Operation successful",
  pagination: {      // For list endpoints
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10
  }
}
```

#### Error Response
```javascript
{
  success: false,
  message: "Error message",
  errors: [...],     // Validation errors
  stack: "..."       // Only in development
}
```

### Security Measures

#### 1. Password Security
- Hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Never returned in API responses

#### 2. SQL Injection Prevention
- Sequelize ORM with parameterized queries
- Input validation before database operations

#### 3. XSS Prevention
- express-validator sanitization
- Content Security Policy headers

#### 4. CSRF Protection
- CORS whitelist
- Token-based authentication

#### 5. Rate Limiting
```javascript
Login:    5 attempts / 15 min
Register: 3 attempts / 15 min
API:      100 requests / 15 min
```

#### 6. Soft Delete
- Records never truly deleted
- `deletedAt` timestamp for recovery
- Exclude soft-deleted in queries

### Performance Optimizations

#### 1. Database Indexing
- Primary keys auto-indexed
- Foreign keys indexed
- Unique constraints on email, NIS, NIK

#### 2. Eager Loading
```javascript
// Load related data in one query
PelanggaranSiswa.findAll({
  include: [
    { model: Siswa },
    { model: JenisPelanggaran },
    { model: Guru }
  ]
});
```

#### 3. Pagination
- Default: 10 items per page
- Prevents loading large datasets
- Improves response time

#### 4. Connection Pooling
- Reuse database connections
- Reduces connection overhead
- Max 5 concurrent connections

### Monitoring & Logging

#### Activity Logs
```javascript
// All CRUD operations logged
{
  userId: 123,
  userType: 'guru',
  action: 'CREATE',
  target: 'pelanggaran_siswa',
  targetId: 456,
  details: {...},
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  timestamp: '2025-11-11 10:00:00'
}
```

#### Request Logs
```javascript
// All API requests logged
[2025-11-11 10:00:00] GET /api/siswa?page=1&limit=10
[2025-11-11 10:00:01] POST /api/pelanggaran-siswa
[2025-11-11 10:00:02] PUT /api/guru/123
```

---

## API Endpoints

> **Base URL:** `http://localhost:3000/api`  
> **Authentication:** Most endpoints require JWT token in Authorization header: `Bearer <token>`

### Authentication & Authorization
```
POST   /api/auth/register       # Register new user (rate limited)
POST   /api/auth/login          # Login (rate limited)
POST   /api/auth/logout         # Logout
POST   /api/auth/refresh        # Refresh JWT token
```

### Admin Management
```
GET    /api/admin               # Get all admins (paginated)
GET    /api/admin/:id           # Get admin by ID
POST   /api/admin               # Create new admin (admin only)
PUT    /api/admin/:id           # Update admin (admin only)
DELETE /api/admin/:id           # Delete admin (soft delete)
```

### Guru BK Management
```
GET    /api/guru                # Get all guru (paginated, searchable)
GET    /api/guru/:id            # Get guru by ID with relations
POST   /api/guru                # Create new guru (admin only)
PUT    /api/guru/:id            # Update guru (admin/guru)
DELETE /api/guru/:id            # Delete guru (soft delete)
```

### Siswa Management
```
GET    /api/siswa               # Get all siswa (paginated, filterable)
GET    /api/siswa/:id           # Get siswa detail with kelas & orang tua
POST   /api/siswa               # Create new siswa (admin/guru)
PUT    /api/siswa/:id           # Update siswa (admin/guru)
DELETE /api/siswa/:id           # Delete siswa (soft delete)
```

### Orang Tua Management
```
GET    /api/orang-tua           # Get all orang tua (paginated)
GET    /api/orang-tua/:id       # Get orang tua detail with children
POST   /api/orang-tua           # Create new orang tua (admin/guru)
PUT    /api/orang-tua/:id       # Update orang tua
DELETE /api/orang-tua/:id       # Delete orang tua (soft delete)
```

### Kelas Management
```
GET    /api/kelas               # Get all kelas
GET    /api/kelas/:id           # Get kelas detail with siswa
GET    /api/kelas/:id/siswa     # Get all siswa in a kelas
POST   /api/kelas               # Create new kelas (admin only)
PUT    /api/kelas/:id           # Update kelas (admin/guru)
DELETE /api/kelas/:id           # Delete kelas (soft delete)
```

### Jenis Pelanggaran
```
GET    /api/jenis-pelanggaran   # Get all jenis pelanggaran
GET    /api/jenis-pelanggaran/:id  # Get detail
POST   /api/jenis-pelanggaran   # Create (admin only)
PUT    /api/jenis-pelanggaran/:id  # Update (admin only)
DELETE /api/jenis-pelanggaran/:id  # Delete (admin only)
```

### Pelanggaran Siswa
```
GET    /api/pelanggaran-siswa   # Get all pelanggaran (filterable by date, siswa, kelas)
GET    /api/pelanggaran-siswa/:id  # Get detail with all relations
POST   /api/pelanggaran-siswa   # Create pelanggaran (guru only)
PUT    /api/pelanggaran-siswa/:id  # Update pelanggaran (guru only)
DELETE /api/pelanggaran-siswa/:id  # Delete pelanggaran (soft delete)
```

### Tanggapan Orang Tua
```
GET    /api/tanggapan           # Get all tanggapan
GET    /api/tanggapan/:id       # Get tanggapan detail
POST   /api/tanggapan           # Create tanggapan (orang tua only)
PUT    /api/tanggapan/:id       # Update tanggapan (orang tua only)
DELETE /api/tanggapan/:id       # Delete tanggapan
```

### Tindakan Sekolah
```
GET    /api/tindakan/tindakan   # Get all tindakan
GET    /api/tindakan/:id        # Get tindakan detail
POST   /api/tindakan            # Create tindakan (guru only)
PUT    /api/tindakan/:id        # Update tindakan (guru only)
DELETE /api/tindakan/:id        # Delete tindakan
```

### Laporan & Analytics
```
GET    /api/laporan/laporan              # Get laporan pelanggaran (filterable)
GET    /api/laporan/anak                 # Laporan untuk orang tua (by child)
GET    /api/laporan/dashboard-stats      # Dashboard statistics
GET    /api/laporan/pelanggaran          # Pelanggaran reports with filters
GET    /api/laporan/analisis-siswa       # Student analysis report
GET    /api/laporan/analisis-kelas       # Class analysis report
```

### Visualization & Charts
```
GET    /api/visualization/trend-monthly      # Monthly violation trends
GET    /api/visualization/kelas-comparison   # Class comparison chart
GET    /api/visualization/category-comparison  # Category comparison
GET    /api/visualization/top-violators      # Top violators list
```

### Notifications
```
GET    /api/notifications              # Get user notifications
GET    /api/notifications/unread-count # Get unread count
GET    /api/notifications/stats        # Notification statistics
PATCH  /api/notifications/:id/read     # Mark as read
PATCH  /api/notifications/read-all     # Mark all as read
DELETE /api/notifications/:id          # Delete notification
DELETE /api/notifications/read/all     # Delete all read notifications
POST   /api/notifications/test         # Send test notification
```

### Saved Filters
```
POST   /api/saved-filters              # Save a filter
GET    /api/saved-filters              # Get user's saved filters
GET    /api/saved-filters/:id          # Get specific filter
PUT    /api/saved-filters/:id          # Update filter
DELETE /api/saved-filters/:id          # Delete filter
PATCH  /api/saved-filters/:id/set-default  # Set as default
```

### File Upload
```
POST   /api/file-upload/upload          # Upload single file
POST   /api/file-upload/upload-multiple # Upload multiple files
GET    /api/file-upload                 # Get all uploaded files
GET    /api/file-upload/:id             # Get file metadata
GET    /api/file-upload/:id/download    # Download file
DELETE /api/file-upload/:id             # Delete file
```

### Backup & Restore
```
POST   /api/backup/create               # Create manual backup (admin)
POST   /api/backup/restore              # Restore from backup (admin)
GET    /api/backup/list                 # List all backups (admin)
GET    /api/backup/download/:fileName   # Download backup file (admin)
DELETE /api/backup/:fileName            # Delete backup file (admin)
POST   /api/backup/cleanup              # Cleanup old backups (admin)
```

### Activity Logs
```
GET    /api/activity-logs               # Get all activity logs (admin)
GET    /api/activity-logs/stats         # Activity statistics (admin)
GET    /api/activity-logs/:id           # Get specific log (admin)
DELETE /api/activity-logs/cleanup       # Delete old logs (admin)
```

### Query Parameters (Common)

**Pagination:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Search & Filter:**
- `search` - Search keyword
- `kelasId` - Filter by class
- `startDate` - Start date filter (YYYY-MM-DD)
- `endDate` - End date filter (YYYY-MM-DD)
- `kategori` - Filter by category

**Sorting:**
- `sort` - Field to sort by
- `order` - Sort order (ASC/DESC)

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [...]
}
```

### Rate Limiting
- **Login:** 5 attempts per 15 minutes per IP
- **Register:** 3 attempts per 15 minutes per IP
- **General API:** 100 requests per 15 minutes per IP

---

## Testing

### Manual Testing
1. Jalankan backend dan frontend
2. Login dengan akun testing yang disediakan
3. Test setiap fitur sesuai role:
   - Admin: CRUD data master
   - Guru: Catat pelanggaran, beri tindakan
   - Orang Tua: Beri tanggapan
   - Siswa: Lihat riwayat

### Test Data
Database sudah include seed data untuk testing:
- 1 Admin
- 2 Guru BK
- 5 Siswa
- 5 Orang Tua
- 3 Kelas
- 10 Jenis Pelanggaran

---

## Troubleshooting

### Backend Issues

#### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

#### Database Connection Failed
**Symptoms:** `Database connection failed: Access denied`

**Solutions:**
1. Check MySQL is running:
   ```bash
   # Windows
   net start MySQL80
   
   # Linux
   sudo systemctl start mysql
   ```

2. Verify credentials in `backend/.env`:
   ```env
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=db_konseling
   ```

3. Create database if not exists:
   ```sql
   CREATE DATABASE db_konseling CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. Check database permissions:
   ```sql
   GRANT ALL PRIVILEGES ON db_konseling.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

#### Module Not Found Error
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

### 🔵 Frontend Issues

#### Port 5173 Already in Use
```bash
# Find and kill process using port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5173
kill -9 <PID>
```

#### CORS Error
**Symptoms:** `Access-Control-Allow-Origin error`

**Solutions:**
1. Verify backend `.env` has:
   ```env
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

2. Restart backend server

3. Clear browser cache (Ctrl+Shift+Delete)

4. Check axios baseURL in `frontend/src/lib/axios.js`:
   ```javascript
   const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
   ```

#### Vite Environment Variables Not Working
**Symptoms:** `import.meta.env.VITE_API_URL is undefined`

**Solutions:**
1. Create/check `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

2. Restart Vite dev server:
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

3. Environment variables must start with `VITE_`

---

### Authentication Issues

#### Token Expired
**Symptoms:** Automatically logged out or `401 Unauthorized`

**Solutions:**
1. Login again (token expires after 2 hours)

2. Clear localStorage and refresh:
   ```javascript
   // Open browser console (F12)
   localStorage.clear()
   location.reload()
   ```

#### Login Page Reloads on Error
**Status:** ✅ **FIXED** in latest version

**Verify Fix:**
- Check `frontend/src/lib/axios.js` has updated interceptor
- Login errors should NOT trigger page reload
- Toast notification should appear

#### Toast Notifications Not Showing
**Status:** ✅ **FIXED** in latest version

**Verify Fix:**
- Check `frontend/src/contexts/AuthProvider.jsx` throws errors
- Check `Login.jsx` has proper catch block
- ToastContainer should be in App.jsx

---

### Database Issues

#### Tables Not Created
**Symptoms:** `Table 'db_konseling.admins' doesn't exist`

**Solutions:**
1. Wait for auto-sync message in backend console:
   ```
   Semua model berhasil disinkronisasi.
   ```

2. If still failing, manually sync:
   ```javascript
   // In server.js, change to:
   await db.sync({ force: true }); // WARNING: Drops all tables
   ```

3. Check database exists:
   ```sql
   SHOW DATABASES;
   USE db_konseling;
   SHOW TABLES;
   ```

---

### Development Issues

#### ESLint Errors
```bash
cd frontend
npm run lint
```

To temporarily disable ESLint in a file:
```javascript
/* eslint-disable */
// your code here
/* eslint-enable */
```

#### Hot Reload Not Working
```bash
# Restart Vite dev server
# Press Ctrl+C
npm run dev
```

---

### Need More Help?

1. **Component Structure** - Check [Struktur Project](#struktur-project) untuk detail komponen
2. **Browser Console** - Open DevTools (F12) to see errors
3. **Backend Logs** - Check terminal running backend
4. **Network Tab** - Check API requests/responses in browser

### Still Stuck?

Create an issue on GitHub with:
- Error message (full text)
- Screenshots
- Steps to reproduce
- Browser & OS version
- Node.js version (`node --version`)
- npm version (`npm --version`)

---

## Development Notes

### Development Workflow

#### Starting Development
```bash
# Option 1: Auto start (Windows)
start-dev.bat

# Option 2: Manual start
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

#### Available Scripts

**Backend:**
```bash
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production mode
npm run seed         # Seed test data
npm run reset-passwords  # Reset all passwords
```

**Frontend:**
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

### Adding New Features

#### 1. Add New Model (Database Table)
```javascript
// backend/models/NewModel.js
import { Sequelize } from "sequelize";
import db from "../config/database.js";

const NewModel = db.define('new_table', {
  id_field: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name_field: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true
});

export default NewModel;
```

#### 2. Create Controller
```javascript
// backend/controllers/NewController.js
export const getAll = async (req, res) => {
  try {
    const data = await NewModel.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

#### 3. Create Route
```javascript
// backend/routes/NewRoute.js
import express from "express";
import { getAll } from "../controllers/NewController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
router.get("/", verifyToken, getAll);

export default router;
```

#### 4. Register Route in server.js
```javascript
import NewRoute from "./routes/NewRoute.js";
app.use("/api/new-endpoint", NewRoute);
```

#### 5. Create Frontend Page
```jsx
// frontend/src/pages/NewPage.jsx
import { useState, useEffect } from "react";
import api from "../../lib/axios";

export default function NewPage() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const res = await api.get("/new-endpoint");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  
  return <div>{/* Your UI */}</div>;
}
```

#### 6. Add Route to App.jsx
```jsx
<Route
  path="/admin/new-page"
  element={
    <ProtectedRoute roles={["admin"]}>
      <NewPage />
    </ProtectedRoute>
  }
/>
```

---

### Database Management

#### Create Database
```sql
CREATE DATABASE db_konseling CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Reset Database
```sql
DROP DATABASE IF EXISTS db_konseling;
CREATE DATABASE db_konseling CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Backup Database
```bash
# Windows (using mysqldump path)
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump" -u root -p db_konseling > backup.sql

# Linux/Mac
mysqldump -u root -p db_konseling > backup_$(date +%Y%m%d).sql
```

#### Restore Database
```bash
mysql -u root -p db_konseling < backup.sql
```

#### Manual Sync (Development Only)
```javascript
// In server.js, temporarily change to:
await db.sync({ force: true }); // WARNING: Drops all tables!
await db.sync({ alter: true });  // SAFER: Alters existing tables
```

---

### 🔧 Configuration

#### Environment Variables

**Backend `.env`:**
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=db_konseling
DB_DIALECT=mysql

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=2h

# CORS
FRONTEND_URL=http://localhost:5173

# Email (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Backup (optional)
ENABLE_AUTO_BACKUP=false
BACKUP_CRON_SCHEDULE=0 2 * * *

# Rate Limiting
RATE_LIMIT_LOGIN=5
RATE_LIMIT_REGISTER=3
RATE_LIMIT_API=100
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Sistem Bimbingan Konseling
VITE_APP_SCHOOL=SMK Negeri 1 Kupang
```

---

### Testing Checklist

- [ ] Login dengan semua role (Admin, Guru, Siswa, Orang Tua)
- [ ] Create, Read, Update, Delete pada semua entitas
- [ ] Filter dan search functionality
- [ ] Pagination pada tabel dengan banyak data
- [ ] Export to Excel/PDF
- [ ] Dark/Light mode toggle
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Form validation (client & server)
- [ ] Error handling & toast notifications
- [ ] File upload (profiles, documents)
- [ ] Token expiration & refresh
- [ ] Protected routes per role

---

### Production Deployment

#### 1. Prepare Backend
```bash
cd backend

# Update .env
NODE_ENV=production
DB_HOST=your-production-db-host
FRONTEND_URL=https://your-domain.com

# Install production dependencies
npm install --production
```

#### 2. Build Frontend
```bash
cd frontend

# Update .env
VITE_API_URL=https://api.your-domain.com

# Build
npm run build

# Output will be in dist/ folder
```

#### 3. Deploy
- Backend: Deploy to VPS, Heroku, Railway, etc.
- Frontend: Deploy dist/ to Netlify, Vercel, Cloudflare Pages, etc.
- Database: Use managed MySQL (AWS RDS, Google Cloud SQL, etc.)

#### 4. Post-Deployment
- [ ] Update CORS origins in backend
- [ ] Change JWT_SECRET to strong value
- [ ] Enable HTTPS
- [ ] Setup database backups
- [ ] Configure email service
- [ ] Monitor logs & errors
- [ ] Change default passwords

---

### Code Style Guide

#### JavaScript/React
- Use ES6+ syntax
- Arrow functions preferred
- Async/await over promises
- Destructuring when possible
- Meaningful variable names

#### Components
- One component per file
- PascalCase for component names
- Use hooks (useState, useEffect, useContext)
- Extract reusable logic to custom hooks

#### API Calls
- Use try-catch for error handling
- Show loading states
- Display error messages with toast
- Validate data before sending

---

### Debugging Tips

1. **Backend Debugging:**
   - Check console logs in terminal
   - Use `console.log()` liberally
   - Check MySQL logs
   - Use Postman to test API endpoints

2. **Frontend Debugging:**
   - Open Browser DevTools (F12)
   - Check Console for errors
   - Check Network tab for API calls
   - Use React DevTools extension
   - Check localStorage in Application tab

3. **Database Debugging:**
   - Use MySQL Workbench
   - Check table structures
   - Verify relationships
   - Check for orphaned records

---

### Resources

- [Express.js Docs](https://expressjs.com/)
- [Sequelize Docs](https://sequelize.org/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Bootstrap Docs](https://getbootstrap.com/)
- [MySQL Docs](https://dev.mysql.com/doc/)

---

## License

This project is developed for educational purposes at **SMK Negeri 1 Kupang**.

© 2025 SMK Negeri 1 Kupang. All Rights Reserved.

---

## Acknowledgments

### Technologies Used
- Node.js & Express.js team
- React & Vite team
- MySQL & Sequelize team
- Bootstrap team
- All open source contributors

### Special Thanks
- SMK Negeri 1 Kupang
- Guru Bimbingan Konseling
- Students & Parents
- Development team

---

## Developer Information

**Project Name:** Sistem Informasi Bimbingan Konseling  
**Institution:** SMK Negeri 1 Kupang  
**Year:** 2025  
**Type:** Web Application (Full Stack)  
**Purpose:** Educational Project & School Management System

### Tech Stack Summary
- **Backend:** Node.js + Express.js + MySQL
- **Frontend:** React + Vite + Bootstrap
- **Authentication:** JWT
- **ORM:** Sequelize
- **Real-time:** Socket.io

---

## Contact & Support

### For Technical Support
- 📧 Email: asmaraninada16@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/acaxoxo/si-bimbingan-konseling-uas/issues)
- 📖 Docs: Check `DEBUG_REPORT.md` and `QUICK_FIXES.md`

### For Feature Requests
- Create an issue on GitHub
- Include detailed description
- Explain use case and benefits

### For Bug Reports
Please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser & OS version
- Error messages from console

---

## Version History

### v1.0.0 (Latest) - November 2, 2025
#### New Features
- Complete authentication system with 4 roles
- Dashboard with real-time analytics
- Full CRUD for all entities
- Violation management with points system
- Parent responses to violations
- School actions tracking
- Export to Excel/PDF
- Dark/Light theme
- Real-time notifications
- File upload support

#### Bug Fixes
- Fixed login page reload on error
- Fixed toast notifications not showing
- Fixed axios interceptor causing unwanted redirects
- Fixed CORS configuration
- Fixed token refresh mechanism
- Fixed error boundary implementation
- Improved database connection pooling
- Enhanced error handling across the app

#### Improvements
- Better code organization
- Comprehensive documentation
- Environment variable configuration
- Auto-start scripts for development
- Debug tools and guides
- Security enhancements
- Performance optimizations
- Responsive design improvements

---

## Future Enhancements

### Planned Features
- [ ] Mobile app (React Native)
- [ ] Advanced reporting & analytics
- [ ] Email notifications automation
- [ ] SMS notifications
- [ ] Parent mobile app
- [ ] Teacher mobile app
- [ ] Automated counseling scheduling
- [ ] Student behavior prediction using AI
- [ ] Integration with school LMS
- [ ] Multi-language support
- [ ] Print violation reports
- [ ] Digital signature for parents
- [ ] Biometric attendance integration
- [ ] Video call counseling
- [ ] Chat system between stakeholders

### Technical Improvements
- [ ] Unit & integration tests
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] Microservices architecture
- [ ] GraphQL API
- [ ] Redis caching
- [ ] Elasticsearch for search
- [ ] AWS/GCP cloud deployment
- [ ] Load balancing
- [ ] Database replication
- [ ] Automated backups to cloud

---

## Project Status

**Status:** Production Ready

### Completed
- [x] Backend API (100%)
- [x] Frontend UI (100%)
- [x] Authentication & Authorization (100%)
- [x] Database Schema (100%)
- [x] CRUD Operations (100%)
- [x] Real-time Features (100%)
- [x] Export Features (100%)
- [x] Responsive Design (100%)
- [x] Security Features (100%)
- [x] Documentation (100%)

### Statistics
- **Total Files:** 140+ files
- **Lines of Code:** ~15,000+ LOC
- **API Endpoints:** 50+ endpoints
- **React Components:** 60+ components
- **Database Tables:** 14 tables
- **Development Time:** 3+ months
- **Bug Fixes:** 20+ critical fixes
- **Features:** 40+ features

---

## Documentation Index

| Document | Description | Link |
|----------|-------------|------|
| **README.md** | Complete documentation (all-in-one) | You're here! |
| **ERD Diagram** | Database schema & relationships | [backend/ERD.puml](./backend/ERD.puml) |
| **DFD Diagram** | Data flow & system processes | [backend/DFD.puml](./backend/DFD.puml) |

### Viewing PlantUML Diagrams

**Option 1: Generate Images**
```bash
# Install PlantUML
# Windows: choco install plantuml
# Mac: brew install plantuml
# Linux: sudo apt install plantuml

# Generate PNG images
cd backend
plantuml ERD.puml    # Creates ERD.png
plantuml DFD.puml    # Creates DFD_001.png, DFD_002.png, etc.
```

**Option 2: Online Viewer**
1. Buka [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
2. Copy paste isi file `.puml`
3. Klik "Submit"

**Option 3: VS Code Extension**
1. Install extension: "PlantUML" by jebbs
2. Buka file `.puml`
3. Press `Alt+D` untuk preview

---

## Star This Repository

If you find this project helpful, please star this repository!

---

**Built with care for SMK Negeri 1 Kupang**

*Last Updated: November 4, 2025*

---

## Notable Recent Changes

### 2025-11-11: Major Documentation Update
- ✅ Added comprehensive **Backend Architecture** section with detailed technology stack
- ✅ Added complete **API Endpoints** documentation (100+ endpoints documented)
- ✅ Improved **ERD (Entity Relationship Diagram)** with complete schema details
  - 14 entities fully documented with all attributes
  - All relationships clearly mapped
  - Added notes for critical entities
  - Enhanced styling and readability
- ✅ Created new **DFD (Data Flow Diagram)** with 3 levels:
  - Level 0: Context Diagram
  - Level 1: Main Processes (6 processes)
  - Level 2: Detailed Processes (5 detailed flows)
- ✅ Added **Desain Struktural Sistem** section in README
- ✅ Updated Table of Contents with new sections
- ✅ Added viewing instructions for PlantUML diagrams

### 2025-11-04: Frontend Notification Improvements
- Frontend migration: all browser `alert(...)` calls in the `frontend/src` codebase have been replaced with `react-toastify` toasts for non-blocking, consistent in-app notifications. The change is implemented across page components and forms.
- `ToastContainer` is already configured once in `frontend/src/App.jsx`. `react-toastify` is present in `frontend/package.json` dependencies (version ~11.x).
- The production bundle in `frontend/dist/` may still contain `alert(...)` strings generated by older builds — do not edit files inside `dist` manually. To refresh the production bundle run:

```bash
cd frontend
npm run build
```

- `window.confirm(...)` dialogs were intentionally left in place (confirmation flows). Replacing confirmations with a modal/confirm component is available as a separate task if desired.

*Notes for developers:* perform a final `grep -R "alert(" frontend/src || true` to verify no `alert` calls remain in source before building the production bundle.