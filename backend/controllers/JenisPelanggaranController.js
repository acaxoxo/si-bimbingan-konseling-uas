import JenisPelanggaran from "../models/JenisPelanggaranModel.js";
import Admin from "../models/AdminModel.js";

export const getAllJenisPelanggaran = async (req, res) => {
  try {
    const data = await JenisPelanggaran.findAll({
      include: {
        model: Admin,
        attributes: ["id_admin", "nama_admin", "email_admin"],
      },
      order: [["id_jenis_pelanggaran", "ASC"]],
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJenisPelanggaranById = async (req, res) => {
  try {
    const pelanggaran = await JenisPelanggaran.findByPk(req.params.id, {
      include: {
        model: Admin,
        attributes: ["id_admin", "nama_admin", "email_admin"],
      },
    });
    if (!pelanggaran)
      return res
        .status(404)
        .json({ message: "Jenis pelanggaran tidak ditemukan" });
    res.json(pelanggaran);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createJenisPelanggaran = async (req, res) => {
  try {
    const {
      nama_jenis_pelanggaran,
      kategori_pelanggaran,
      deskripsi,
      poin_pelanggaran,
    } = req.body;

    // Validasi required fields
    if (!nama_jenis_pelanggaran) {
      return res.status(400).json({ 
        message: "Nama jenis pelanggaran wajib diisi" 
      });
    }

    if (!kategori_pelanggaran) {
      return res.status(400).json({ 
        message: "Kategori pelanggaran wajib diisi" 
      });
    }

    // Validasi kategori pelanggaran
    const validKategori = ["Ringan", "Sedang", "Berat"];
    if (!validKategori.includes(kategori_pelanggaran)) {
      return res.status(400).json({ 
        message: "Kategori pelanggaran harus 'Ringan', 'Sedang', atau 'Berat'" 
      });
    }

    // Validasi poin pelanggaran
    if (poin_pelanggaran !== undefined && poin_pelanggaran !== null) {
      if (typeof poin_pelanggaran !== 'number' || poin_pelanggaran < 0) {
        return res.status(400).json({ 
          message: "Poin pelanggaran harus berupa angka positif" 
        });
      }
    }

    // Validasi unique nama jenis pelanggaran
    const existingPelanggaran = await JenisPelanggaran.findOne({ 
      where: { nama_jenis_pelanggaran } 
    });
    if (existingPelanggaran) {
      return res.status(400).json({ 
        message: "Nama jenis pelanggaran sudah terdaftar" 
      });
    }

    // Get admin_id from authenticated user
    const admin_id = req.user?.id || null;

    console.log("=== Debug Create Jenis Pelanggaran ===");
    console.log("req.user:", req.user);
    console.log("admin_id:", admin_id);
    console.log("Request body:", req.body);

    if (!admin_id) {
      return res.status(400).json({ 
        message: "Admin ID tidak ditemukan. Pastikan Anda sudah login sebagai admin.",
        debug: { user: req.user }
      });
    }

    const newData = await JenisPelanggaran.create({
      nama_jenis_pelanggaran,
      kategori_pelanggaran,
      deskripsi,
      poin_pelanggaran,
      admin_id,
    });

    res.status(201).json({
      message: "Data jenis pelanggaran berhasil ditambahkan",
      data: newData,
    });
  } catch (error) {
    console.error("Error creating jenis pelanggaran:", error);
    res.status(400).json({ message: error.message });
  }
};

export const updateJenisPelanggaran = async (req, res) => {
  try {
    const pelanggaran = await JenisPelanggaran.findByPk(req.params.id);
    if (!pelanggaran)
      return res
        .status(404)
        .json({ message: "Jenis pelanggaran tidak ditemukan" });

    const { nama_jenis_pelanggaran, kategori_pelanggaran, poin_pelanggaran } = req.body;

    // Validasi nama tidak boleh kosong
    if (nama_jenis_pelanggaran !== undefined && !nama_jenis_pelanggaran) {
      return res.status(400).json({ 
        message: "Nama jenis pelanggaran tidak boleh kosong" 
      });
    }

    // Validasi unique nama jenis pelanggaran jika diubah
    if (nama_jenis_pelanggaran && nama_jenis_pelanggaran !== pelanggaran.nama_jenis_pelanggaran) {
      const existingPelanggaran = await JenisPelanggaran.findOne({ 
        where: { nama_jenis_pelanggaran } 
      });
      if (existingPelanggaran) {
        return res.status(400).json({ 
          message: "Nama jenis pelanggaran sudah terdaftar" 
        });
      }
    }

    // Validasi kategori pelanggaran jika diubah
    if (kategori_pelanggaran && kategori_pelanggaran !== pelanggaran.kategori_pelanggaran) {
      const validKategori = ["Ringan", "Sedang", "Berat"];
      if (!validKategori.includes(kategori_pelanggaran)) {
        return res.status(400).json({ 
          message: "Kategori pelanggaran harus 'Ringan', 'Sedang', atau 'Berat'" 
        });
      }
    }

    // Validasi poin pelanggaran jika diubah
    if (poin_pelanggaran !== undefined && poin_pelanggaran !== null) {
      if (typeof poin_pelanggaran !== 'number' || poin_pelanggaran < 0) {
        return res.status(400).json({ 
          message: "Poin pelanggaran harus berupa angka positif" 
        });
      }
    }

    await pelanggaran.update(req.body);
    res.json({ message: "Data jenis pelanggaran berhasil diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteJenisPelanggaran = async (req, res) => {
  try {
    const pelanggaran = await JenisPelanggaran.findByPk(req.params.id);
    if (!pelanggaran)
      return res
        .status(404)
        .json({ message: "Jenis pelanggaran tidak ditemukan" });

    await pelanggaran.destroy();
    res.json({ message: "Data jenis pelanggaran berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};