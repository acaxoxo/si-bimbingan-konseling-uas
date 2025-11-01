#  Sistem Informasi Bimbingan Konseling
**SMK Negeri 1 Kupang**

Aplikasi web untuk mengelola pencatatan pelanggaran siswa, laporan, dan komunikasi antara guru BK, siswa, dan orang tua.

##  Dokumentasi

Dokumentasi project ini dibagi menjadi beberapa bagian:

| Dokumentasi | Deskripsi | Link |
|-------------|-----------|------|
| Dokumentasi Utama | Setup lengkap, backend, database, API | *Anda di sini* |
| Frontend | React setup, komponen, struktur UI | [Frontend README](./frontend/README.md) |
| Backend | API endpoints, controllers, models | *Dalam development* |

>  **Mulai dari mana?**
> - Baru mulai? → Lihat [Quick Start](#-quick-start) di bawah
> - Developer frontend? → Buka [Frontend Documentation](./frontend/README.md)
> - Butuh API reference? → Lihat [API Endpoints](#-api-endpoints)

##  Table of Contents

- [Quick Start](#-quick-start)
- [Akun Login Testing](#-akun-login-testing)
- [Peran dan Fitur](#-peran-dan-fitur)
- [Database Schema](#-database-schema)
- [Use Case Skenario](#-use-case-skenario)
- [Teknologi](#-teknologi)
- [Struktur Project](#-struktur-project)
- [Fitur Utama](#-fitur-utama)
- [Security Features](#-security-features)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Development Notes](#-development-notes)

---

##  Quick Start

### Prerequisites
- Node.js v18+ 
- MySQL 8.0+
- npm atau yarn

### Instalasi

**1. Clone Repository**
```bash
git clone <repository-url>
cd si-bimbingan-konseling
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Buat file `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_bk
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
```

Buat database:
```sql
CREATE DATABASE db_bk;
```

Jalankan backend:
```bash
npm start
```
Backend berjalan di: `http://localhost:3000`

**3. Setup Frontend**
```bash
cd ../frontend
npm install
npm run dev
```
Frontend berjalan di: `http://localhost:5173`

---

##  Akun Login Testing

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@smk1kupang.sch.id | admin123 |
| **Guru BK** | guru@smk1kupang.sch.id | guru123 |
| **Siswa** | siswa@smk1kupang.sch.id | siswa123 |
| **Orang Tua** | ortu@smk1kupang.sch.id | ortu123 |

---

##  Peran dan Fitur

###  Admin
- Kelola data guru BK, siswa, orang tua
- Kelola data kelas dan jenis pelanggaran  
- Lihat laporan pelanggaran
- Export data ke Excel

### ‍ Guru BK
- Catat pelanggaran siswa dengan poin
- Berikan tindakan sekolah
- Lihat tanggapan orang tua
- Buat laporan dan statistik

### ‍‍ Orang Tua
- Lihat laporan pelanggaran anak
- Berikan tanggapan atas pelanggaran
- Lihat tindakan sekolah

###  Siswa
- Lihat riwayat pelanggaran sendiri
- Lihat tindakan sekolah
- Lihat poin pelanggaran

---

##  Database Schema

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

##  Use Case Skenario

### Skenario 1: Guru Mencatat Pelanggaran
1. Guru login → Dashboard
2. Menu "Pelanggaran Siswa" → "Tambah Pelanggaran"
3. Pilih siswa, jenis pelanggaran
4. Isi tanggal, tempat, kronologi
5. Simpan → Poin otomatis ditambahkan
6. Notifikasi terkirim ke orang tua

### Skenario 2: Orang Tua Memberikan Tanggapan
1. Orang tua login → "Laporan Anak Saya"
2. Lihat daftar pelanggaran
3. Klik "Tanggapi" 
4. Isi tanggapan → Simpan
5. Guru BK menerima notifikasi

### Skenario 3: Admin Kelola Data Master
1. Admin login → Menu "Data Guru/Siswa/Kelas"
2. Klik "Tambah Data"
3. Isi form lengkap → Simpan
4. Data tersimpan di database

---

##  Teknologi

### Backend
- **Runtime**: Node.js v22
- **Framework**: Express.js
- **Database**: MySQL + Sequelize ORM
- **Auth**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: bcrypt, helmet, cors

### Frontend
- **Framework**: React 18 + Vite
- **UI**: Bootstrap 5
- **HTTP Client**: Axios
- **Routing**: React Router DOM v6
- **State**: React Context API
- **Icons**: Font Awesome 6
- **Excel Export**: XLSX + FileSaver

---

##  Struktur Project

```
si-bimbingan-konseling/
 backend/
    config/
       database.js
    controllers/
       AuthController.js
       AdminController.js
       GuruController.js
       ... (10 controllers)
    models/
       AdminModel.js
       GuruModel.js
       ... (10 models)
    routes/
       ... (11 routes)
    middleware/
       verifyToken.js
       errorHandler.js
    server.js
    package.json

 frontend/
     src/
        components/
           Layout.jsx
           ProtectedRoute.jsx
           ThemeToggle.jsx
        contexts/
           AuthContext.jsx
           ThemeContext.jsx
        pages/
           admin/
           guru/
           siswa/
           orangTua/
        lib/
           axios.js
        App.jsx
     package.json
```

---

##  Fitur Utama

-  **Multi-role Authentication** (4 roles dengan hak akses berbeda)
-  **CRUD Data Master** (Guru, Siswa, Orang Tua, Kelas, Pelanggaran)
-  **Pencatatan Pelanggaran** dengan sistem poin otomatis
-  **Tanggapan Orang Tua** atas pelanggaran anak
-  **Tindakan Sekolah** oleh guru BK
-  **Laporan & Statistik** real-time di dashboard
-  **Filter & Search** pada semua tabel data
-  **Export Excel** untuk laporan
-  **Dark/Light Mode** dengan persistence
-  **Responsive Design** (Mobile & Desktop)
-  **Protected Routes** per role
-  **Form Validation** client & server side

---

##  Security Features

- JWT authentication dengan refresh token
- Password hashing dengan bcrypt (10 rounds)
- Role-based access control (RBAC)
- Input validation & sanitization
- CORS protection
- Helmet.js security headers
- SQL injection prevention (Sequelize ORM)
- XSS protection

---

##  API Endpoints

### Authentication
```
POST   /api/auth/login          # Login
POST   /api/auth/logout         # Logout
GET    /api/auth/me             # Get current user
```

### Admin Management
```
GET    /api/admin               # Get all admins (paginated)
POST   /api/admin               # Create admin
PUT    /api/admin/:id           # Update admin
DELETE /api/admin/:id           # Delete admin
```

### Guru BK
```
GET    /api/guru                # Get all guru
POST   /api/guru                # Create guru
PUT    /api/guru/:id            # Update guru
DELETE /api/guru/:id            # Delete guru
```

### Siswa
```
GET    /api/siswa               # Get all siswa
POST   /api/siswa               # Create siswa
PUT    /api/siswa/:id           # Update siswa
DELETE /api/siswa/:id           # Delete siswa
```

### Pelanggaran Siswa
```
GET    /api/pelanggaran-siswa   # Get all pelanggaran
POST   /api/pelanggaran-siswa   # Create pelanggaran
GET    /api/pelanggaran-siswa/:id  # Get detail
PUT    /api/pelanggaran-siswa/:id  # Update
DELETE /api/pelanggaran-siswa/:id  # Delete
```

*Dan 6 endpoint group lainnya...*

---

##  Testing

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

##  Troubleshooting

### Backend tidak start
```bash
# Check port 3000
netstat -ano | findstr :3000
# Kill process if needed
taskkill /PID <process_id> /F
```

### Database connection error
- Pastikan MySQL running
- Cek kredensial di `.env`
- Buat database `db_bk`

### Frontend tidak fetch data
- Pastikan backend running di port 3000
- Cek axios baseURL di `lib/axios.js`
- Lihat browser console untuk error

### JWT token expired
- Login ulang
- Token expire setelah 24 jam

---

##  Development Notes

### Menambah Fitur Baru
1. Buat model di `backend/models/`
2. Buat controller di `backend/controllers/`
3. Buat route di `backend/routes/`
4. Register route di `server.js`
5. Buat page component di `frontend/src/pages/`
6. Tambahkan route di `App.jsx`

### Database Migration
Sequelize auto-sync enabled di development.
Untuk production, gunakan migration:
```bash
npx sequelize-cli migration:generate --name create-table-name
npx sequelize-cli db:migrate
```

---

##  License

This project is for educational purposes - SMK Negeri 1 Kupang

---

##  Dokumentasi Terkait

-  **[Frontend Documentation](./frontend/README.md)** - Setup React, komponen, dan struktur frontend
-  **Backend Documentation** - API endpoints dan database schema (dalam development)
-  **Database Schema** - Lihat section "Database Schema" di atas
-  **Security Features** - Lihat section "Security Features" di atas

---

## ‍ Developer

Developed with  for SMK Negeri 1 Kupang
© 2025 All Rights Reserved

---

##  Contact

Untuk pertanyaan atau support, hubungi:
- Email: admin@smk1kupang.sch.id
- GitHub Issues: [Create Issue](link-to-repo/issues)
