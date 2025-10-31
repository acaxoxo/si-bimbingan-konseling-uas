import { DataTypes } from "sequelize";
import db from "../config/database.js";
import OrangTua from "./OrangTuaModel.js";
import PelanggaranSiswa from "./PelanggaranSiswaModel.js";

const TanggapanOrangTua = db.define(
  "tanggapan_orang_tua",
  {
    id_tanggapan: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orangTuaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OrangTua,
        key: "id_orang_tua",
      },
    },
    pelanggaranSiswaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PelanggaranSiswa,
        key: "id_pelanggaran_siswa",
      },
    },
    tanggal_tanggapan: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isi_tanggapan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tindakan_rumah: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

OrangTua.hasMany(TanggapanOrangTua, { foreignKey: "orangTuaId" });
TanggapanOrangTua.belongsTo(OrangTua, { foreignKey: "orangTuaId" });

PelanggaranSiswa.hasOne(TanggapanOrangTua, { foreignKey: "pelanggaranSiswaId" });
TanggapanOrangTua.belongsTo(PelanggaranSiswa, { foreignKey: "pelanggaranSiswaId" });

export default TanggapanOrangTua;