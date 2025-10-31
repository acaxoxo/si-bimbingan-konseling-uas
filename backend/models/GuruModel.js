import { DataTypes } from "sequelize";
import db from "../config/database.js";
import bcrypt from "bcrypt";

const Guru = db.define(
  "guru",
  {
    id_guru: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_guru: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tempat_lahir: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tanggal_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    jenis_kelamin: {
      type: DataTypes.ENUM("Laki-laki", "Perempuan"),
      allowNull: true,
    },
    pendidikan_terakhir: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jurusan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jabatan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status_aktif: {
      type: DataTypes.ENUM("Aktif", "Nonaktif"),
      defaultValue: "Aktif",
    },
    no_telepon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_guru: {
      type: DataTypes.STRING,
      allowNull: true,
    },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
  },
  {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate: async (guru) => {
        if (guru.password) {
          guru.password = await bcrypt.hash(guru.password, 10);
        }
      },
      beforeUpdate: async (guru) => {
        if (guru.changed("password")) {
          guru.password = await bcrypt.hash(guru.password, 10);
        }
      },
    },
  }
);

export default Guru;