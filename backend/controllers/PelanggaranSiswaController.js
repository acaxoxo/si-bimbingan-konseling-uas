import PelanggaranSiswa from "../models/PelanggaranSiswaModel.js";
import Siswa from "../models/SiswaModel.js";
import JenisPelanggaran from "../models/JenisPelanggaranModel.js";
import Guru from "../models/GuruModel.js";
import Kelas from "../models/KelasModel.js";
import OrangTua from "../models/OrangTuaModel.js";
import { getPaginationParams, paginateResponse } from "../utils/pagination.js";
import { Op } from "sequelize";
import { notifyParentAboutPelanggaran } from "../services/notificationService.js";

export const getAllPelanggaranSiswa = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const { search, siswaId, status_konseling } = req.query;

    // Build where clause for filters
    const whereClause = {};
    if (siswaId) {
      whereClause.siswaId = siswaId;
    }
    if (status_konseling) {
      whereClause.status_konseling = status_konseling;
    }

    const { count, rows } = await PelanggaranSiswa.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: Siswa, 
          attributes: ["id_siswa", "nama_siswa", "nis"],
          where: search ? {
            [Op.or]: [
              { nama_siswa: { [Op.like]: `%${search}%` } },
              { nis: { [Op.like]: `%${search}%` } }
            ]
          } : undefined,
          include: [
            { 
              model: Kelas, 
              attributes: ["id_kelas", "nama_kelas", "kelas_kejuruan"] 
            },
            { 
              model: OrangTua, 
              attributes: ["id_orang_tua", "nama_ayah", "nama_ibu"] 
            }
          ]
        },
        {
          model: JenisPelanggaran,
          attributes: [
            "id_jenis_pelanggaran",
            "nama_jenis_pelanggaran",
            "kategori_pelanggaran",
            "poin_pelanggaran",
          ],
        },
        { model: Guru, attributes: ["id_guru", "nama_guru"] },
      ],
      limit,
      offset,
      order: [["id_pelanggaran_siswa", "DESC"]],
    });

    res.json(paginateResponse(rows, page, limit, count));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPelanggaranSiswaById = async (req, res) => {
  try {
    const data = await PelanggaranSiswa.findByPk(req.params.id, {
      include: [
        {
          model: Siswa,
          attributes: ["id_siswa", "nama_siswa", "nis"],
          include: [
            {
              model: Kelas,
              attributes: ["id_kelas", "nama_kelas", "kelas_kejuruan"],
            },
            {
              model: OrangTua,
              attributes: ["id_orang_tua", "nama_ayah", "nama_ibu"],
            },
          ],
        },
        {
          model: JenisPelanggaran,
          attributes: [
            "id_jenis_pelanggaran",
            "nama_jenis_pelanggaran",
            "kategori_pelanggaran",
            "poin_pelanggaran",
          ],
        },
        { model: Guru, attributes: ["id_guru", "nama_guru"] },
      ],
    });

    if (!data)
      return res
        .status(404)
        .json({ message: "Data pelanggaran siswa tidak ditemukan" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPelanggaranSiswa = async (req, res) => {
  try {
    const {
      siswaId,
      jenisPelanggaranId,
      guruId,
      tanggal_pelanggaran,
      catatan_konseling,
      tindak_lanjut,
      status_konseling,
    } = req.body;

    const newData = await PelanggaranSiswa.create({
      siswaId,
      jenisPelanggaranId,
      guruId,
      tanggal_pelanggaran,
      catatan_konseling,
      tindak_lanjut,
      status_konseling,
    });

    // 🔔 Send notification to parent (real-time + email)
    try {
      // Fetch related data for notification
      const pelanggaranWithDetails = await PelanggaranSiswa.findByPk(newData.id_pelanggaran, {
        include: [
          {
            model: Siswa,
            include: [{ model: OrangTua }],
          },
          { model: JenisPelanggaran },
        ],
      });

      if (pelanggaranWithDetails?.siswa?.orang_tua) {
        await notifyParentAboutPelanggaran(
          {
            id_pelanggaran: newData.id_pelanggaran,
            tanggal_pelanggaran: newData.tanggal_pelanggaran,
            deskripsi_pelanggaran: pelanggaranWithDetails.jenis_pelanggaran?.nama_jenis_pelanggaran || "Pelanggaran",
          },
          pelanggaranWithDetails.siswa.orang_tua,
          pelanggaranWithDetails.siswa
        );
        console.log("✅ Parent notification sent successfully");
      }
    } catch (notifError) {
      console.error("⚠️  Error sending notification:", notifError.message);
      // Don't fail the request if notification fails
    }

    res.status(201).json({
      message: "Data pelanggaran siswa berhasil ditambahkan",
      data: newData,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePelanggaranSiswa = async (req, res) => {
  try {
    const data = await PelanggaranSiswa.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });

    await data.update(req.body);
    res.json({ message: "Data pelanggaran siswa berhasil diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePelanggaranSiswa = async (req, res) => {
  try {
    const data = await PelanggaranSiswa.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });

    await data.destroy();
    res.json({ message: "Data pelanggaran siswa berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};