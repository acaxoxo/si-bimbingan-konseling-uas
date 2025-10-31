import Kelas from "../models/KelasModel.js";
import Guru from "../models/GuruModel.js";
import db from "../config/database.js";

export const getAllKelas = async (req, res) => {
  try {
    const data = await Kelas.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllKelasWithGuru = async (req, res) => {
  try {
    const data = await Kelas.findAll({
      include: [
        { model: Guru, attributes: ["nama_guru", "email_guru"] },
      ],
      attributes: {
        include: [
          [
            db.literal(`(
              SELECT COUNT(*)
              FROM siswa
              WHERE siswa.kelas_id = kelas.id_kelas
            )`),
            'jumlah_siswa'
          ]
        ]
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getKelasById = async (req, res) => {
  try {
    const data = await Kelas.findByPk(req.params.id, {
      include: Guru,
    });
    if (!data)
      return res.status(404).json({ message: "Kelas tidak ditemukan" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createKelas = async (req, res) => {
  try {
    const { nama_kelas, kelas_kejuruan, guruId } = req.body;

    // Validasi required fields
    if (!nama_kelas) {
      return res.status(400).json({ 
        message: "Nama kelas wajib diisi" 
      });
    }

    // Validasi unique nama kelas
    const existingKelas = await Kelas.findOne({ where: { nama_kelas } });
    if (existingKelas) {
      return res.status(400).json({ 
        message: "Nama kelas sudah terdaftar" 
      });
    }

    // Validasi guruId (jika diisi, pastikan guru ada)
    if (guruId) {
      const guruExists = await Guru.findByPk(guruId);
      if (!guruExists) {
        return res.status(400).json({ 
          message: "Guru tidak ditemukan" 
        });
      }
    }

    const newData = await Kelas.create({ nama_kelas, kelas_kejuruan, guruId });
    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateKelas = async (req, res) => {
  try {
    const kelas = await Kelas.findByPk(req.params.id);
    if (!kelas)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    const { nama_kelas, guruId } = req.body;

    // Validasi nama kelas tidak boleh kosong
    if (nama_kelas !== undefined && !nama_kelas) {
      return res.status(400).json({ 
        message: "Nama kelas tidak boleh kosong" 
      });
    }

    // Validasi unique nama kelas jika diubah
    if (nama_kelas && nama_kelas !== kelas.nama_kelas) {
      const existingKelas = await Kelas.findOne({ where: { nama_kelas } });
      if (existingKelas) {
        return res.status(400).json({ 
          message: "Nama kelas sudah terdaftar" 
        });
      }
    }

    // Validasi guruId jika diubah
    if (guruId && guruId !== kelas.guruId) {
      const guruExists = await Guru.findByPk(guruId);
      if (!guruExists) {
        return res.status(400).json({ 
          message: "Guru tidak ditemukan" 
        });
      }
    }

    await kelas.update(req.body);
    res.json({ message: "Data berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteKelas = async (req, res) => {
  try {
    const kelas = await Kelas.findByPk(req.params.id);
    if (!kelas)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    await kelas.destroy();
    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};