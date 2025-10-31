import { DataTypes } from "sequelize";
import db from "../config/database.js";
import bcrypt from "bcrypt";

const Admin = db.define(
  "admin",
  {
    id_admin: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_admin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_admin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    hooks: {
      beforeCreate: async (admin) => {
        admin.password = await bcrypt.hash(admin.password, 10);
      },
      beforeUpdate: async (admin) => {
        if (admin.changed("password")) {
          admin.password = await bcrypt.hash(admin.password, 10);
        }
      },
    },
  }
);

export default Admin;
