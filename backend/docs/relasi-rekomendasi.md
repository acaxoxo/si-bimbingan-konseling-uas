# Rekomendasi Perbaikan Relasi & ERD

## Ringkasan Perubahan Sudah Dilakukan
- OrangTua — Siswa: diubah menjadi 1:N (OrangTua.hasMany(Siswa)).
- Endpoint laporan anak: sekarang mendukung banyak anak + filter `siswaId`.

## Rekomendasi ERD
| Relasi | Kardinalitas Saat Ini | Rekomendasi | Catatan |
|--------|-----------------------|------------|---------|
| Admin — JenisPelanggaran | 1:N | OK | Pastikan FK `admin_id` nullable=false bila setiap jenis harus punya admin pencipta. |
| Kelas — Siswa | 1:N | OK | Tambah indeks pada `siswa.kelas_id`. |
| Guru — Kelas | 1:N | OK | Konsistensi penamaan FK: gunakan `guru_id` bukan `guruId` untuk selaras dengan `id_guru`. |
| OrangTua — Siswa | 1:N | Sudah diperbaiki | Tambah indeks pada `siswa.orangTuaId`. Pertimbangkan `ON DELETE SET NULL`. |
| Siswa — PelanggaranSiswa | 1:N | OK | Tambah indeks komposit `(siswaId, tanggal_pelanggaran)` untuk query tren. |
| JenisPelanggaran — PelanggaranSiswa | 1:N | OK | Indeks pada `jenisPelanggaranId`. |
| Guru — PelanggaranSiswa | 1:N | OK | Indeks pada `guruId`. |
| PelanggaranSiswa — TindakanSekolah | 1:1 (?) | Evaluasi | Jika satu pelanggaran bisa punya banyak tindakan (eskalasi), ubah ke 1:N. Jika benar 1:1, pastikan unique index di `tindakan_sekolah.pelanggaran_id`. |
| TindakanSekolah — TanggapanOrangTua | 1:1 | OK | Pastikan unique index di `tanggapan_orangtua.tindakan_id`. |
| TindakanSekolah — Laporan | 1:N | OK | Pastikan naming konsisten (`tindakan_id`). |
| Guru — Laporan | 1:N | OK | Indeks pada `laporan.guru_id`. |

## Konsistensi Penamaan
Gunakan snake_case seragam untuk semua kolom FK agar mudah dipetakan:
- Ubah `guruId` -> `guru_id`
- Ubah `orangTuaId` -> `orang_tua_id` (opsional, jika belum dipakai luas di frontend)
- Ubah `jenisPelanggaranId` -> `jenis_pelanggaran_id`, dsb.
Jika ingin migrasi bertahap, buat view atau alias di layer ORM sebelum refactor penuh.

## Indeks yang Disarankan
```sql
-- Contoh (PostgreSQL / MySQL umum)
CREATE INDEX idx_siswa_orangtua ON siswa(orangTuaId);
CREATE INDEX idx_siswa_kelas ON siswa(kelas_id);
CREATE INDEX idx_pelanggaran_siswaId_tanggal ON pelanggaran_siswa(siswaId, tanggal_pelanggaran);
CREATE INDEX idx_pelanggaran_jenis ON pelanggaran_siswa(jenisPelanggaranId);
CREATE INDEX idx_pelanggaran_guru ON pelanggaran_siswa(guruId);
```
Jika menggunakan Sequelize migrations, buat file migrasi dengan `queryInterface.addIndex()`.

## Integritas Referensial (Foreign Key Actions)
Pertimbangkan aksi berikut:
- `ON DELETE SET NULL` untuk `siswa.orangTuaId` (jika akun orang tua dihapus).
- `ON DELETE CASCADE` untuk relasi kuat seperti PelanggaranSiswa -> TindakanSekolah -> TanggapanOrangTua (agar tidak orphan).
- Hindari cascade dari JenisPelanggaran ke PelanggaranSiswa (riwayat pelanggaran sebaiknya tetap, atau gunakan `RESTRICT`).

## Normalisasi & Data Opsional
- Model `OrangTua`: saat ini menggabungkan data ayah & ibu dalam satu row. Jika nanti butuh fleksibilitas (ayah/ibu bisa login terpisah), pertimbangkan tabel terpisah `orang_tua_anggota` dengan role `ayah|ibu`.
- Nilai penghasilan dan pendidikan dapat ditempatkan pada tabel referensi (dimension table) bila ingin agregasi statistik.

## Audit & Soft Delete
Semua tabel paranoid (soft delete) harus mempertimbangkan query default:
- Pastikan query analitik yang melakukan agregasi poin memanggil model tanpa menyertakan `deletedAt` data atau menyesuaikan `paranoid: false` jika memang ingin historis.

## Potensi 1:1 vs 1:N (TindakanSekolah)
Jika alur konseling memungkinkan beberapa tindakan untuk satu pelanggaran (peringatan lisan, surat, skors, dsb), ubah:
```js
PelanggaranSiswa.hasMany(TindakanSekolah, { foreignKey: 'pelanggaran_id' });
TindakanSekolah.belongsTo(PelanggaranSiswa, { foreignKey: 'pelanggaran_id' });
```
Lalu sesuaikan controller yang membaca `tindakan_sekolahs`.

## Template Migrasi Index (Sequelize)
```js
// migrations/20251111-add-indexes.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.addIndex('siswa', ['orangTuaId'], { name: 'idx_siswa_orangtua' });
  await queryInterface.addIndex('siswa', ['kelas_id'], { name: 'idx_siswa_kelas' });
  await queryInterface.addIndex('pelanggaran_siswa', ['siswaId', 'tanggal_pelanggaran'], { name: 'idx_pelanggaran_siswa_tanggal' });
  await queryInterface.addIndex('pelanggaran_siswa', ['jenisPelanggaranId'], { name: 'idx_pelanggaran_jenis' });
  await queryInterface.addIndex('pelanggaran_siswa', ['guruId'], { name: 'idx_pelanggaran_guru' });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex('siswa', 'idx_siswa_orangtua');
  await queryInterface.removeIndex('siswa', 'idx_siswa_kelas');
  await queryInterface.removeIndex('pelanggaran_siswa', 'idx_pelanggaran_siswa_tanggal');
  await queryInterface.removeIndex('pelanggaran_siswa', 'idx_pelanggaran_jenis');
  await queryInterface.removeIndex('pelanggaran_siswa', 'idx_pelanggaran_guru');
}
```

## Validasi Tambahan API
- Tambahkan batasan peran sehingga orang tua hanya bisa akses anaknya (`WHERE siswa.orangTuaId = parent.id`). Sudah diterapkan.
- Tambahkan rate limit khusus endpoint orang tua jika penggunaan tinggi.

## Langkah Lanjutan Opsional
1. Refactor penamaan kolom FK agar seragam.
2. Tambah unique constraint untuk relasi 1:1 (tanggapan_orangtua.tindakan_id).
3. Implement mekanisme historis perubahan tindakan (riwayat status) dengan tabel `tindakan_histori`.
4. Tambah materialized view / summary table untuk agregasi poin per siswa/per kelas (optimalkan dashboard).

---
Dokumen ini menjadi referensi untuk penyelarasan ERD & implementasi ORM.
