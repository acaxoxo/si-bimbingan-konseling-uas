import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Laporan = db.define(
  "laporan",
  {
    id_laporan: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    periode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_pelanggaran: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_tindakan: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_poin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    tanggal_generate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Laporan;
