import { DataTypes } from "sequelize";
import db from "../config/database.js";
import PelanggaranSiswa from "./PelanggaranSiswaModel.js";
import Guru from "./GuruModel.js";

const TindakanSekolah = db.define(
  "tindakan_sekolah",
  {
    id_tindakan: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pelanggaranSiswaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PelanggaranSiswa,
        key: "id_pelanggaran_siswa",
      },
    },
    guruId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Guru,
        key: "id_guru",
      },
    },
    tanggal_tindakan: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    jenis_tindakan: {
      type: DataTypes.ENUM("Konseling", "Pemanggilan Orang Tua", "Skorsing", "Lainnya"),
      allowNull: false,
    },
    hasil_tindakan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status_tindakan: {
      type: DataTypes.ENUM("Dijadwalkan", "Selesai", "Dibatalkan"),
      defaultValue: "Dijadwalkan",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

PelanggaranSiswa.hasMany(TindakanSekolah, { foreignKey: "pelanggaranSiswaId" });
TindakanSekolah.belongsTo(PelanggaranSiswa, { foreignKey: "pelanggaranSiswaId" });

Guru.hasMany(TindakanSekolah, { foreignKey: "guruId" });
TindakanSekolah.belongsTo(Guru, { foreignKey: "guruId" });

export default TindakanSekolah;