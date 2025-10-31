import { DataTypes } from "sequelize";
import db from "../config/database.js";

const ActivityLog = db.define(
  "activity_log",
  {
    id_log: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_role: {
      type: DataTypes.ENUM("admin", "guru", "orangtua", "siswa"),
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT",
    },
    module: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "siswa, guru, pelanggaran, dll",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default ActivityLog;
