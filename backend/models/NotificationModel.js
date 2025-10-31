import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Notification = sequelize.define(
  "notifications",
  {
    id_notification: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID user yang menerima notifikasi",
    },
    user_role: {
      type: DataTypes.ENUM("admin", "guru", "orang_tua"),
      allowNull: false,
      comment: "Role user penerima",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Judul notifikasi",
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Isi pesan notifikasi",
    },
    type: {
      type: DataTypes.ENUM(
        "pelanggaran_baru",
        "tanggapan_baru",
        "tindakan_sekolah",
        "system",
        "reminder"
      ),
      allowNull: false,
      defaultValue: "system",
      comment: "Tipe notifikasi",
    },
    reference_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID referensi (misal: id_pelanggaran)",
    },
    reference_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Tipe referensi (misal: pelanggaran_siswa)",
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Status sudah dibaca atau belum",
    },
    is_sent_email: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Status email sudah dikirim atau belum",
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Waktu notifikasi dibaca",
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    tableName: "notifications",
  }
);

export default Notification;
