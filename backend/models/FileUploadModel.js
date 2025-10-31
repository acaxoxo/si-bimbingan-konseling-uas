import { DataTypes } from "sequelize";
import db from "../config/database.js";

const FileUpload = db.define(
  "file_upload",
  {
    id_file: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    file_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "image, document, pdf, etc",
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Size in bytes",
    },
    module: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "siswa, guru, pelanggaran, dll",
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID dari module terkait",
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    uploaded_by_role: {
      type: DataTypes.ENUM("admin", "guru", "orangtua", "siswa"),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default FileUpload;
