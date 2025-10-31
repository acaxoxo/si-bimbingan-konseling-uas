import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SavedFilter = sequelize.define(
  "saved_filters",
  {
    id_filter: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID user yang menyimpan filter",
    },
    user_role: {
      type: DataTypes.ENUM("admin", "guru", "orang_tua"),
      allowNull: false,
      comment: "Role user",
    },
    filter_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Nama filter yang disimpan",
    },
    filter_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "Tipe filter (siswa, pelanggaran, laporan, dll)",
    },
    filter_data: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "Data filter dalam format JSON",
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Apakah filter ini default untuk user tersebut",
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    tableName: "saved_filters",
  }
);

export default SavedFilter;
