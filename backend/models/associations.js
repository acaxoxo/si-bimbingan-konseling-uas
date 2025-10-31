import Admin from "./AdminModel.js";
import JenisPelanggaran from "./JenisPelanggaranModel.js";
import Kelas from "./KelasModel.js";
import Siswa from "./SiswaModel.js";
import OrangTua from "./OrangTuaModel.js";
import Guru from "./GuruModel.js";
import PelanggaranSiswa from "./PelanggaranSiswaModel.js";
import TindakanSekolah from "./TindakanSekolahModel.js";
import Laporan from "./LaporanModel.js";
import TanggapanOrangTua from "./TanggapanOrangTuaModel.js";

Admin.hasMany(JenisPelanggaran, { foreignKey: "admin_id" });
JenisPelanggaran.belongsTo(Admin, { foreignKey: "admin_id" });

Kelas.hasMany(Siswa, { foreignKey: "kelas_id" });
Siswa.belongsTo(Kelas, { foreignKey: "kelas_id" });

// Relasi Kelas - Guru (wali kelas)
Guru.hasMany(Kelas, { foreignKey: "guruId" });
Kelas.belongsTo(Guru, { foreignKey: "guruId" });

// Relasi: Siswa milik OrangTua (FK di tabel siswa: orangTuaId)
OrangTua.hasOne(Siswa, { foreignKey: "orangTuaId" });
Siswa.belongsTo(OrangTua, { foreignKey: "orangTuaId" });

Siswa.hasMany(PelanggaranSiswa, { foreignKey: "siswaId" });
PelanggaranSiswa.belongsTo(Siswa, { foreignKey: "siswaId" });

JenisPelanggaran.hasMany(PelanggaranSiswa, { foreignKey: "jenisPelanggaranId" });
PelanggaranSiswa.belongsTo(JenisPelanggaran, { foreignKey: "jenisPelanggaranId" });

Guru.hasMany(PelanggaranSiswa, { foreignKey: "guruId" });
PelanggaranSiswa.belongsTo(Guru, { foreignKey: "guruId" });

PelanggaranSiswa.hasOne(TindakanSekolah, { foreignKey: "pelanggaran_id" });
TindakanSekolah.belongsTo(PelanggaranSiswa, { foreignKey: "pelanggaran_id" });

TindakanSekolah.hasOne(TanggapanOrangTua, { foreignKey: "tindakan_id" });
TanggapanOrangTua.belongsTo(TindakanSekolah, { foreignKey: "tindakan_id" });

TindakanSekolah.hasMany(Laporan, { foreignKey: "tindakan_id" });
Laporan.belongsTo(TindakanSekolah, { foreignKey: "tindakan_id" });

Guru.hasMany(Laporan, { foreignKey: "guru_id" });
Laporan.belongsTo(Guru, { foreignKey: "guru_id" });

export {
  Admin,
  JenisPelanggaran,
  Kelas,
  Siswa,
  OrangTua,
  Guru,
  PelanggaranSiswa,
  TindakanSekolah,
  Laporan,
  TanggapanOrangTua,
};