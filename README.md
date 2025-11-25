# Sistem Informasi Bimbingan Konseling

**SMK Negeri 1 Kupang**

> Aplikasi web modern untuk mengelola pencatatan pelanggaran siswa, laporan, dan komunikasi antara guru BK, siswa, dan orang tua.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)

---

## 📚 Dokumentasi

> **Mulai dari mana?**
>
> - Baru mulai? → Lihat [Quick Start](#quick-start)
> - Butuh API docs? → Lihat [API Endpoints](#api-endpoints)
> - **Mau Presentasi?** → Lihat [Panduan Presentasi](presentation_guide.md)

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Akun Login Testing](#akun-login-testing)
- [Peran dan Fitur](#peran-dan-fitur)
- [Teknologi](#teknologi)
- [Struktur Project](#struktur-project)
- [Fitur Utama](#fitur-utama)
- [Security Features](#security-features)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)

---

## 🚀 Quick Start

### Option 1: Automatic Start (Windows)

**Cara Tercepat:**

1. Double-click file **`start-dev.bat`** di root folder
2. Tunggu backend dan frontend start otomatis
3. Browser akan terbuka di `http://localhost:5173`

> Script otomatis akan:
>
> - Check dan install dependencies jika belum ada
> - Start backend server (port 3000)
> - Start frontend server (port 5173)

---

### Option 2: Manual Setup

#### Prerequisites

- Node.js v18+ ([Download](https://nodejs.org/))
- MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/))
- npm atau bun

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
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=db_konseling

PORT=3000
JWT_SECRET=rahasia_super_aman_bimbingan_konseling_smk1_kupang_2025
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

#### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

#### 4. Seed Test Data (Opsional)

```bash
cd backend
npm run seed
```

---

## 🔐 Akun Login Testing

Setelah menjalankan `npm run seed` di backend:

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| **Admin** | <admin@smk1kupang.sch.id> | admin123 | `/admin` |
| **Guru BK** | <guru@smk1kupang.sch.id> | guru123 | `/guru` |
| **Siswa** | <siswa@smk1kupang.sch.id> | siswa123 | `/siswa` |
| **Orang Tua** | <orangtua@smk1kupang.sch.id> | orangtua123 | `/orangtua` |

---

## 👥 Peran dan Fitur

### Admin

- ✅ Kelola data guru BK, siswa, orang tua
- ✅ Kelola data kelas dan jenis pelanggaran  
- ✅ Lihat laporan pelanggaran
- ✅ Export data ke Excel/PDF

### Guru BK

- ✅ Catat pelanggaran siswa dengan poin
- ✅ Berikan tindakan sekolah
- ✅ Lihat tanggapan orang tua
- ✅ Buat laporan dan statistik

### Orang Tua

- ✅ Lihat laporan pelanggaran anak
- ✅ Berikan tanggapan atas pelanggaran
- ✅ Lihat tindakan sekolah
- ✅ Terima notifikasi real-time

### Siswa

- ✅ Lihat riwayat pelanggaran sendiri
- ✅ Lihat tindakan sekolah
- ✅ Lihat akumulasi poin pelanggaran

---

## 🛠️ Teknologi

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
| **Multer** | v2.0.2 | File uploads |

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | v19.1.1 | UI framework |
| **Vite** | v7.1.7 | Build tool & dev server |
| **React Router** | v7.9.3 | Routing |
| **Axios** | v1.12.2 | HTTP client |
| **Bootstrap** | v5.3.8 | UI components |
| **Recharts** | v3.3.0 | Charts & graphs |
| **XLSX** | v0.18.5 | Excel export |

---

## 📁 Struktur Project

```
si-bimbingan-konseling/
├── backend/
│   ├── config/
│   │   └── database.js              # Database configuration
│   ├── controllers/                 # Business logic (17 files)
│   │   ├── AuthController.js
│   │   ├── AdminController.js
│   │   ├── GuruController.js
│   │   ├── SiswaController.js
│   │   └── ...
│   ├── models/                      # Sequelize models (15 files)
│   │   ├── AdminModel.js
│   │   ├── GuruModel.js
│   │   ├── SiswaModel.js
│   │   ├── associations.js          # Model relationships
│   │   └── ...
│   ├── routes/                      # API routes (17 files)
│   ├── middleware/                  # Auth, logging, validation
│   │   ├── verifyToken.js
│   │   ├── rateLimiter.js
│   │   └── upload.js
│   ├── services/                    # External services
│   │   ├── emailService.js
│   │   ├── socketService.js
│   │   └── backupService.js
│   ├── scripts/                     # Utility scripts
│   │   ├── seedUsers.js
│   │   └── resetPasswords.js
│   ├── uploads/                     # File storage
│   ├── server.js                    # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── contexts/                # React contexts
│   │   │   └── AuthProvider.jsx
│   │   ├── pages/                   # Page components (47 files)
│   │   │   ├── Login.jsx
│   │   │   ├── admin/               # Admin pages
│   │   │   ├── guru/                # Guru pages
│   │   │   ├── siswa/               # Siswa pages
│   │   │   └── orangTua/            # Orang tua pages
│   │   ├── hooks/                   # Custom hooks
│   │   ├── lib/                     # Utilities
│   │   │   └── axios.js             # Axios config
│   │   ├── App.jsx                  # Main app & routing
│   │   └── main.jsx                 # Entry point
│   └── package.json
│
└── start-dev.bat                    # Auto-start script
```

---

## ✨ Fitur Utama

### 1. Multi-Role Authentication

- Login dengan 4 role berbeda (Admin, Guru, Siswa, Orang Tua)
- JWT token-based authentication
- Password hashing dengan bcrypt
- Auto token refresh

### 2. Manajemen Pelanggaran

- Input pelanggaran dengan kategori (Ringan/Sedang/Berat)
- Sistem poin otomatis
- Upload bukti pelanggaran
- Tracking status konseling

### 3. Komunikasi Real-time

- Notifikasi instant dengan Socket.io
- Email notifications
- Toast notifications di UI

### 4. Laporan & Analitik

- Dashboard dengan statistik
- Charts & graphs (Recharts)
- Export ke Excel/PDF
- Filter berdasarkan periode, kelas, kategori

### 5. Manajemen Data Master

- CRUD untuk semua entitas
- Soft delete (audit trail)
- Bulk import/export
- Search & pagination

---

## 🔒 Security Features

- ✅ **JWT Authentication** - Token-based auth dengan expiry
- ✅ **Password Hashing** - bcrypt dengan salt rounds
- ✅ **Role-Based Access Control** - Protected routes per role
- ✅ **Input Validation** - express-validator
- ✅ **Rate Limiting** - API rate limiter
- ✅ **CORS Protection** - Configured CORS policy
- ✅ **SQL Injection Prevention** - Sequelize ORM
- ✅ **XSS Protection** - Input sanitization
- ✅ **Activity Logging** - Audit trail semua aktivitas

---

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/login          # Login
POST   /api/auth/register       # Register
POST   /api/auth/refresh        # Refresh token
POST   /api/auth/logout         # Logout
```

### Admin

```
GET    /api/admin               # Get all admins
GET    /api/admin/:id           # Get admin by ID
POST   /api/admin               # Create admin
PUT    /api/admin/:id           # Update admin
DELETE /api/admin/:id           # Delete admin
```

### Guru BK

```
GET    /api/guru                # Get all guru
GET    /api/guru/:id            # Get guru by ID
POST   /api/guru                # Create guru
PUT    /api/guru/:id            # Update guru
DELETE /api/guru/:id            # Delete guru
```

### Siswa

```
GET    /api/siswa               # Get all siswa
GET    /api/siswa/:id           # Get siswa by ID
POST   /api/siswa               # Create siswa
PUT    /api/siswa/:id           # Update siswa
DELETE /api/siswa/:id           # Delete siswa
GET    /api/siswa/:id/pelanggaran  # Get siswa violations
```

### Pelanggaran Siswa

```
GET    /api/pelanggaran-siswa   # Get all violations
GET    /api/pelanggaran-siswa/:id  # Get violation by ID
POST   /api/pelanggaran-siswa   # Create violation
PUT    /api/pelanggaran-siswa/:id  # Update violation
DELETE /api/pelanggaran-siswa/:id  # Delete violation
```

### Laporan

```
GET    /api/laporan             # Get reports
POST   /api/laporan/generate    # Generate report
GET    /api/laporan/export      # Export to Excel/PDF
```

### Notifications

```
GET    /api/notifications       # Get user notifications
PUT    /api/notifications/:id/read  # Mark as read
DELETE /api/notifications/:id   # Delete notification
```

> **Note:** Semua endpoint (kecuali `/auth/login` dan `/auth/register`) memerlukan JWT token di header:
>
> ```
> Authorization: Bearer <token>
> ```

---

## 🗄️ Database Schema

### Entitas Utama

**1. Admin**

- `id_admin` (PK)
- `nama_admin`, `email_admin`, `password`
- Timestamps: `createdAt`, `updatedAt`, `deletedAt`

**2. Guru (Guru BK)**

- `id_guru` (PK)
- `nama_guru`, `nik`, `email_guru`, `password`
- `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`
- `status_aktif`, `no_telepon`

**3. Siswa**

- `id_siswa` (PK)
- `nama_siswa`, `nis`, `nisn`, `email_siswa`, `password`
- `kelas_id` (FK → Kelas)
- `orangTuaId` (FK → OrangTua)

**4. Orang Tua**

- `id_orang_tua` (PK)
- `nama_ayah`, `email_ayah`, `no_telepon_ayah`
- `nama_ibu`, `email_ibu`, `no_telepon_ibu`
- `password`

**5. Kelas**

- `id_kelas` (PK)
- `nama_kelas`, `kelas_kejuruan`
- `guruId` (FK → Guru - Wali Kelas)

**6. Jenis Pelanggaran**

- `id_jenis_pelanggaran` (PK)
- `nama_jenis_pelanggaran`, `kategori_pelanggaran`
- `poin_pelanggaran`, `deskripsi`
- `admin_id` (FK → Admin)

**7. Pelanggaran Siswa** *(Entitas Utama)*

- `id_pelanggaran_siswa` (PK)
- `tanggal_pelanggaran`, `tempat_kejadian`, `kronologi`
- `status_konseling`, `bukti_pelanggaran`
- `siswaId` (FK → Siswa)
- `jenisPelanggaranId` (FK → JenisPelanggaran)
- `guruId` (FK → Guru)

**8. Tanggapan Orang Tua**

- `id_tanggapan` (PK)
- `isi_tanggapan`, `tindakan_rumah`
- `orangTuaId` (FK → OrangTua)
- `pelanggaranSiswaId` (FK → PelanggaranSiswa)

**9. Tindakan Sekolah**

- `id_tindakan` (PK)
- `jenis_tindakan`, `deskripsi_tindakan`
- `status_tindakan`, `tanggal_tindakan`
- `pelanggaranSiswaId` (FK → PelanggaranSiswa)
- `guruId` (FK → Guru)

### Relasi Utama

```
Admin (1) ──creates──> (*) JenisPelanggaran
Guru (1) ──wali_kelas──> (*) Kelas
Kelas (1) ──has──> (*) Siswa
OrangTua (1) ──has_children──> (*) Siswa
Siswa (1) ──commits──> (*) PelanggaranSiswa
Guru (1) ──reports──> (*) PelanggaranSiswa
PelanggaranSiswa (1) ──receives──> (*) TanggapanOrangTua
PelanggaranSiswa (1) ──receives──> (*) TindakanSekolah
```

**Fitur Database:**

- Primary Keys: Auto-increment integer
- Soft Delete: `deletedAt` timestamp
- Timestamps: `createdAt`, `updatedAt` otomatis
- Unique Constraints: Email, NIS, NISN, NIK

---

## 📝 License

Educational Project - SMK Negeri 1 Kupang

---

## 👨‍💻 Author

**Nada Asmarani**

---

## 🙏 Acknowledgments

- SMK Negeri 1 Kupang
- Dosen Pembimbing
- Tim Developer

---

**Need Help?** Check [Panduan Presentasi](presentation_guide.md) untuk panduan lengkap presentasi project ini.
