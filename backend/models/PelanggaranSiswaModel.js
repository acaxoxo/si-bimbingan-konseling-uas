import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Siswa from "./SiswaModel.js";
import JenisPelanggaran from "./JenisPelanggaranModel.js";
import Guru from "./GuruModel.js";

const PelanggaranSiswa = db.define(
  "pelanggaran_siswa",
  {
    id_pelanggaran_siswa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    siswaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Siswa,
        key: "id_siswa",
      },
    },
    jenisPelanggaranId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: JenisPelanggaran,
        key: "id_jenis_pelanggaran",
      },
    },
    guruId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Guru,
        key: "id_guru",
      },
    },
    tanggal_pelanggaran: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    catatan_konseling: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tindak_lanjut: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status_konseling: {
      type: DataTypes.ENUM("Belum", "Sedang", "Selesai"),
      defaultValue: "Belum",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Siswa.hasMany(PelanggaranSiswa, { foreignKey: "siswaId" });
PelanggaranSiswa.belongsTo(Siswa, { foreignKey: "siswaId" });

JenisPelanggaran.hasMany(PelanggaranSiswa, {
  foreignKey: "jenisPelanggaranId",
});
PelanggaranSiswa.belongsTo(JenisPelanggaran, {
  foreignKey: "jenisPelanggaranId",
});

Guru.hasMany(PelanggaranSiswa, { foreignKey: "guruId" });
PelanggaranSiswa.belongsTo(Guru, { foreignKey: "guruId" });

export default PelanggaranSiswa;