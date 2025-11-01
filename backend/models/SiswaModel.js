import { DataTypes } from "sequelize";
import db from "../config/database.js";
import bcrypt from "bcrypt";

const Siswa = db.define(
  "siswa",
  {
    id_siswa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_siswa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nis: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    orangTuaId: {
      
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "orangTuaId",
    },
    kelas_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jenis_kelamin: {
      type: DataTypes.ENUM("Laki-laki", "Perempuan"),
      allowNull: false,
    },
    tempat_lahir: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tanggal_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    no_telepon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_siswa: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
      beforeCreate: async (siswa) => {
        if (siswa.password) {
          siswa.password = await bcrypt.hash(siswa.password, 10);
        }
      },
      beforeUpdate: async (siswa) => {
        if (siswa.changed("password")) {
          siswa.password = await bcrypt.hash(siswa.password, 10);
        }
      },
    },
  }
);

export default Siswa;
