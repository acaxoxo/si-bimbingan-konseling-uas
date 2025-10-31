import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Kelas = db.define(
  "kelas",
  {
    id_kelas: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_kelas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kelas_kejuruan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    guruId: {
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

export default Kelas;