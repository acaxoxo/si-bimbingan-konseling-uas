import Siswa from "../models/SiswaModel.js";
import Kelas from "../models/KelasModel.js";
import OrangTua from "../models/OrangTuaModel.js";
import { getPaginationParams, paginateResponse } from "../utils/pagination.js";
import { Op } from "sequelize";

export const getAllSiswa = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const { search, kelas_id } = req.query;

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
    console.log("[createSiswa] Received request body:", req.body);
    
    const { nama_siswa, nis, email_siswa, no_telepon, jenis_kelamin } = req.body;

    if (!nama_siswa || !nis) {
      console.log("[createSiswa] Validation failed: Missing nama_siswa or nis");
      return res.status(400).json({ 
        message: "Nama siswa dan NIS wajib diisi" 
      });
    }

    if (!/^\d{10}$/.test(nis)) {
      console.log("[createSiswa] Validation failed: Invalid NIS format:", nis);
      return res.status(400).json({ 
        message: "NIS harus 10 digit angka" 
      });
    }

    const existingNIS = await Siswa.findOne({ where: { nis } });
    if (existingNIS) {
      console.log("[createSiswa] Validation failed: NIS already exists:", nis);
      return res.status(400).json({ 
        message: "NIS sudah terdaftar" 
      });
    }

    if (email_siswa) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email_siswa)) {
        console.log("[createSiswa] Validation failed: Invalid email format:", email_siswa);
        return res.status(400).json({ 
          message: "Format email tidak valid" 
        });
      }

      const existingEmail = await Siswa.findOne({ where: { email_siswa } });
      if (existingEmail) {
        console.log("[createSiswa] Validation failed: Email already exists:", email_siswa);
        return res.status(400).json({ 
          message: "Email sudah terdaftar" 
        });
      }
    }

    if (no_telepon && !/^(\+62|62|0)[0-9]{9,12}$/.test(no_telepon.replace(/[\s-]/g, ''))) {
      console.log("[createSiswa] Validation failed: Invalid phone format:", no_telepon);
      return res.status(400).json({ 
        message: "Format nomor telepon tidak valid" 
      });
    }

    if (jenis_kelamin && !['Laki-laki', 'Perempuan'].includes(jenis_kelamin)) {
      console.log("[createSiswa] Validation failed: Invalid jenis_kelamin:", jenis_kelamin);
      return res.status(400).json({ 
        message: "Jenis kelamin harus Laki-laki atau Perempuan" 
      });
    }

    console.log("[createSiswa] All validations passed, creating siswa...");
    const siswa = await Siswa.create(req.body);
    console.log("[createSiswa] Successfully created siswa:", siswa.id_siswa);
    res.status(201).json(siswa);
  } catch (error) {
    console.error("[createSiswa] Unexpected error:", error);
    console.error("[createSiswa] Error details:", error.message);
    if (error.errors) {
      console.error("[createSiswa] Sequelize errors:", error.errors);
    }
    
    // Handle Sequelize unique constraint violations
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0]?.path;
      const value = error.errors[0]?.value;
      
      if (field === 'email_siswa') {
        return res.status(409).json({ 
          message: `Email ${value} sudah terdaftar`,
          field: 'email_siswa'
        });
      }
      if (field === 'nis') {
        return res.status(409).json({ 
          message: `NIS ${value} sudah terdaftar`,
          field: 'nis'
        });
      }
      
      return res.status(409).json({ 
        message: `Data sudah terdaftar: ${field}`,
        field: field
      });
    }
    
    // Handle other Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message).join(', ');
      return res.status(400).json({ 
        message: `Validation error: ${messages}`,
        errors: error.errors 
      });
    }
    
    res.status(400).json({ message: error.message });
  }
};

export const updateSiswa = async (req, res) => {
  try {
    const siswa = await Siswa.findByPk(req.params.id);
    if (!siswa)
      return res.status(404).json({ message: "Siswa tidak ditemukan" });

    const { nama_siswa, nis, email_siswa, no_telepon, jenis_kelamin } = req.body;

    if (nama_siswa !== undefined && !nama_siswa.trim()) {
      return res.status(400).json({ 
        message: "Nama siswa tidak boleh kosong" 
      });
    }

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

    if (no_telepon && !/^(\+62|62|0)[0-9]{9,12}$/.test(no_telepon.replace(/[\s-]/g, ''))) {
      return res.status(400).json({ 
        message: "Format nomor telepon tidak valid" 
      });
    }

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
