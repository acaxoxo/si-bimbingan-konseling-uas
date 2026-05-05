# Sistem Informasi Bimbingan Konseling

**SMK Negeri 1 Kupang**

> Aplikasi untuk mencatat pelanggaran siswa, tindak lanjut, dan komunikasi antara guru BK, siswa, dan orang tua.

---

## Fungsional Sistem

### Autentikasi dan Akses

- Login 4 peran: Admin, Guru BK, Siswa, Orang Tua
- Akses fitur berdasarkan peran

### Admin

- Kelola data master: siswa, guru BK, orang tua, kelas, jenis pelanggaran
- Lihat rekap pelanggaran dan laporan

### Guru BK

- Catat pelanggaran siswa beserta poin
- Tentukan tindakan sekolah
- Lihat tanggapan orang tua
- Buat laporan dan ringkasan statistik

### Orang Tua

- Lihat laporan pelanggaran anak
- Berikan tanggapan
- Lihat tindakan sekolah

### Siswa

- Lihat riwayat pelanggaran sendiri
- Lihat tindakan sekolah dan akumulasi poin
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
