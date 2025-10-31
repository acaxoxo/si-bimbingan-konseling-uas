import { DataTypes } from "sequelize";
import db from "../config/database.js";

const JenisPelanggaran = db.define(
  "jenis_pelanggaran",
  {
    id_jenis_pelanggaran: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_jenis_pelanggaran: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    kategori_pelanggaran: {
      type: DataTypes.ENUM("Ringan", "Sedang", "Berat"),
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tindakan_sekolah: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    poin_pelanggaran: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
  }
);

export default JenisPelanggaran;