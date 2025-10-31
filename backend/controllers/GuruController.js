import Guru from "../models/GuruModel.js";
import { getPaginationParams, paginateResponse } from "../utils/pagination.js";
import { Op } from "sequelize";
  
export const getAllGuru = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const { search } = req.query;

    // Build where clause for search
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { nama_guru: { [Op.like]: `%${search}%` } },
        { nik: { [Op.like]: `%${search}%` } },
        { email_guru: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Guru.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['nama_guru', 'ASC']]
    });

    res.json(paginateResponse(rows, page, limit, count));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGuruById = async (req, res) => {
  try {
    const guru = await Guru.findByPk(req.params.id);
    if (!guru) return res.status(404).json({ message: "Guru tidak ditemukan" });
    res.json(guru);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createGuru = async (req, res) => {
  try {
    const { nama_guru, nik, email_guru, no_telepon, jenis_kelamin } = req.body;

    // Validasi required fields
    if (!nama_guru || !nik) {
      return res.status(400).json({ 
        message: "Nama guru dan NIK wajib diisi" 
      });
    }

    // Validasi format NIK (16 digit)
    if (!/^\d{16}$/.test(nik)) {
      return res.status(400).json({ 
        message: "NIK harus 16 digit angka" 
      });
    }

    // Validasi NIK unique
    const existingNIK = await Guru.findOne({ where: { nik } });
    if (existingNIK) {
      return res.status(400).json({ 
        message: "NIK sudah terdaftar" 
      });
    }

    // Validasi email format (jika diisi)
    if (email_guru) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email_guru)) {
        return res.status(400).json({ 
          message: "Format email tidak valid" 
        });
      }

      // Validasi email unique
      const existingEmail = await Guru.findOne({ where: { email_guru } });
      if (existingEmail) {
        return res.status(400).json({ 
          message: "Email sudah terdaftar" 
        });
      }
    }

    // Validasi no telepon (jika diisi)
    if (no_telepon) {
      const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
      if (!phoneRegex.test(no_telepon)) {
        return res.status(400).json({ 
          message: "Format nomor telepon tidak valid (contoh: 081234567890)" 
        });
      }
    }

    // Validasi jenis kelamin (jika diisi)
    if (jenis_kelamin && !["Laki-laki", "Perempuan"].includes(jenis_kelamin)) {
      return res.status(400).json({ 
        message: "Jenis kelamin harus 'Laki-laki' atau 'Perempuan'" 
      });
    }

    const guru = await Guru.create(req.body);
    res.status(201).json(guru);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateGuru = async (req, res) => {
  try {
    const guru = await Guru.findByPk(req.params.id);
    if (!guru) return res.status(404).json({ message: "Guru tidak ditemukan" });

    const { nama_guru, nik, email_guru, no_telepon, jenis_kelamin } = req.body;

    // Validasi required fields
    if (nama_guru !== undefined && !nama_guru) {
      return res.status(400).json({ 
        message: "Nama guru tidak boleh kosong" 
      });
    }

    // Validasi format NIK jika diubah
    if (nik && nik !== guru.nik) {
      if (!/^\d{16}$/.test(nik)) {
        return res.status(400).json({ 
          message: "NIK harus 16 digit angka" 
        });
      }

      const existingNIK = await Guru.findOne({ where: { nik } });
      if (existingNIK) {
        return res.status(400).json({ 
          message: "NIK sudah terdaftar" 
        });
      }
    }

    // Validasi email jika diubah
    if (email_guru && email_guru !== guru.email_guru) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email_guru)) {
        return res.status(400).json({ 
          message: "Format email tidak valid" 
        });
      }

      const existingEmail = await Guru.findOne({ where: { email_guru } });
      if (existingEmail) {
        return res.status(400).json({ 
          message: "Email sudah terdaftar" 
        });
      }
    }

    // Validasi no telepon jika diisi
    if (no_telepon && no_telepon !== guru.no_telepon) {
      const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
      if (!phoneRegex.test(no_telepon)) {
        return res.status(400).json({ 
          message: "Format nomor telepon tidak valid (contoh: 081234567890)" 
        });
      }
    }

    // Validasi jenis kelamin jika diubah
    if (jenis_kelamin && jenis_kelamin !== guru.jenis_kelamin) {
      if (!["Laki-laki", "Perempuan"].includes(jenis_kelamin)) {
        return res.status(400).json({ 
          message: "Jenis kelamin harus 'Laki-laki' atau 'Perempuan'" 
        });
      }
    }

    await guru.update(req.body);
    res.json({ message: "Data guru berhasil diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteGuru = async (req, res) => {
  try {
    const guru = await Guru.findByPk(req.params.id);
    if (!guru) return res.status(404).json({ message: "Guru tidak ditemukan" });
    await guru.destroy();
    res.json({ message: "Data guru berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
