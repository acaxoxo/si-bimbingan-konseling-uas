import { DataTypes } from "sequelize";
import db from "../config/database.js";
import bcrypt from "bcrypt";

const OrangTua = db.define(
  "orang_tua",
  {
    id_orang_tua: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_ayah: { type: DataTypes.STRING, allowNull: false },
    nama_ibu: { type: DataTypes.STRING, allowNull: false },

    nik_ayah: { type: DataTypes.STRING, allowNull: true },
    nik_ibu: { type: DataTypes.STRING, allowNull: true },

    email_ayah: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },
    email_ibu: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    no_telepon_ayah: { type: DataTypes.STRING },
    no_telepon_ibu: { type: DataTypes.STRING },

    pekerjaan_ayah: { type: DataTypes.STRING },
    pekerjaan_ibu: { type: DataTypes.STRING },
    alamat_ayah: { type: DataTypes.TEXT },
    alamat_ibu: { type: DataTypes.TEXT },
    pendidikan_ayah: { type: DataTypes.STRING },
    pendidikan_ibu: { type: DataTypes.STRING },
    penghasilan_ayah: { type: DataTypes.DECIMAL },
    penghasilan_ibu: { type: DataTypes.DECIMAL },
  },
  {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate: async (ortu) => {
        if (ortu.password) {
          ortu.password = await bcrypt.hash(ortu.password, 10);
        }
      },
      beforeUpdate: async (ortu) => {
        if (ortu.changed("password")) {
          ortu.password = await bcrypt.hash(ortu.password, 10);
        }
      },
    },
  }
);

export default OrangTua;