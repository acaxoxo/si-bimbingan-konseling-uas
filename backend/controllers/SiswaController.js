import Siswa from "../models/SiswaModel.js";
import Kelas from "../models/KelasModel.js";
import OrangTua from "../models/OrangTuaModel.js";
import { getPaginationParams, paginateResponse } from "../utils/pagination.js";
import { Op } from "sequelize";

export const getAllSiswa = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const { search, kelas_id } = req.query;

    // Build where clause for search
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { nama_siswa: { [Op.like]: `%${search}%` } },
        { nis: { [Op.like]: `%${search}%` } },
        { email_siswa: { [Op.like]: `%${search}%` } }
      ];
    }
    if (kelas_id) {
      whereClause.kelas_id = kelas_id;
    }

    const { count, rows } = await Siswa.findAndCountAll({
      where: whereClause,
      include: [
        { model: Kelas, attributes: ["nama_kelas", "kelas_kejuruan"] },
        { model: OrangTua, attributes: ["nama_ayah", "nama_ibu"] }
      ],
      limit,
      offset,
      order: [['nama_siswa', 'ASC']]
    });

    res.json(paginateResponse(rows, page, limit, count));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSiswaById = async (req, res) => {
  try {
    const siswa = await Siswa.findByPk(req.params.id, {
      include: [
        { model: Kelas, attributes: ["nama_kelas", "kelas_kejuruan"] },
        { 
          model: OrangTua, 
          attributes: [
            "nama_ayah", "nama_ibu", 
            "no_telepon_ayah", "no_telepon_ibu",
            "email_ayah", "email_ibu",
            "alamat_ayah", "alamat_ibu",
            "pekerjaan_ayah", "pekerjaan_ibu"
          ] 
        }
      ],
    });
    if (!siswa)
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    res.json(siswa);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSiswa = async (req, res) => {
  try {
    const { nama_siswa, nis, email_siswa, no_telepon, jenis_kelamin } = req.body;

    // Validasi required fields
    if (!nama_siswa || !nis) {
      return res.status(400).json({ 
        message: "Nama siswa dan NIS wajib diisi" 
      });
    }

    // Validasi format NIS (10 digit)
    if (!/^\d{10}$/.test(nis)) {
      return res.status(400).json({ 
        message: "NIS harus 10 digit angka" 
      });
    }

    // Check NIS unique
    const existingNIS = await Siswa.findOne({ where: { nis } });
    if (existingNIS) {
      return res.status(400).json({ 
        message: "NIS sudah terdaftar" 
      });
    }

    // Validasi email jika ada
    if (email_siswa) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email_siswa)) {
        return res.status(400).json({ 
          message: "Format email tidak valid" 
        });
      }

      // Check email unique
      const existingEmail = await Siswa.findOne({ where: { email_siswa } });
      if (existingEmail) {
        return res.status(400).json({ 
          message: "Email sudah terdaftar" 
        });
      }
    }

    // Validasi nomor telepon jika ada
    if (no_telepon && !/^(\+62|62|0)[0-9]{9,12}$/.test(no_telepon.replace(/[\s-]/g, ''))) {
      return res.status(400).json({ 
        message: "Format nomor telepon tidak valid" 
      });
    }

    // Validasi jenis kelamin
    if (jenis_kelamin && !['Laki-laki', 'Perempuan'].includes(jenis_kelamin)) {
      return res.status(400).json({ 
        message: "Jenis kelamin harus Laki-laki atau Perempuan" 
      });
    }

    const siswa = await Siswa.create(req.body);
    res.status(201).json(siswa);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSiswa = async (req, res) => {
  try {
    const siswa = await Siswa.findByPk(req.params.id);
    if (!siswa)
      return res.status(404).json({ message: "Siswa tidak ditemukan" });

    const { nama_siswa, nis, email_siswa, no_telepon, jenis_kelamin } = req.body;

    // Validasi required fields jika ada
    if (nama_siswa !== undefined && !nama_siswa.trim()) {
      return res.status(400).json({ 
        message: "Nama siswa tidak boleh kosong" 
      });
    }

    // Validasi NIS jika diubah
    if (nis && nis !== siswa.nis) {
      if (!/^\d{10}$/.test(nis)) {
        return res.status(400).json({ 
          message: "NIS harus 10 digit angka" 
        });
      }

      const existingNIS = await Siswa.findOne({ where: { nis } });
      if (existingNIS) {
        return res.status(400).json({ 
          message: "NIS sudah terdaftar" 
        });
      }
    }

    // Validasi email jika diubah
    if (email_siswa && email_siswa !== siswa.email_siswa) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email_siswa)) {
        return res.status(400).json({ 
          message: "Format email tidak valid" 
        });
      }

      const existingEmail = await Siswa.findOne({ where: { email_siswa } });
      if (existingEmail) {
        return res.status(400).json({ 
          message: "Email sudah terdaftar" 
        });
      }
    }

    // Validasi nomor telepon jika ada
    if (no_telepon && !/^(\+62|62|0)[0-9]{9,12}$/.test(no_telepon.replace(/[\s-]/g, ''))) {
      return res.status(400).json({ 
        message: "Format nomor telepon tidak valid" 
      });
    }

    // Validasi jenis kelamin
    if (jenis_kelamin && !['Laki-laki', 'Perempuan'].includes(jenis_kelamin)) {
      return res.status(400).json({ 
        message: "Jenis kelamin harus Laki-laki atau Perempuan" 
      });
    }

    await siswa.update(req.body);
    res.json({ message: "Data siswa berhasil diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSiswa = async (req, res) => {
  try {
    const siswa = await Siswa.findByPk(req.params.id);
    if (!siswa)
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    await siswa.destroy();
    res.json({ message: "Data siswa berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
