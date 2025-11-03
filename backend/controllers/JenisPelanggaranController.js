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
    console.log(`[GET /jenis-pelanggaran] Returning ${data.length} items`);
    res.json(data);
  } catch (error) {
    console.error('[GET /jenis-pelanggaran] Error:', error);
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
      tindakan_sekolah,
    } = req.body;

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

    const validKategori = ["Ringan", "Sedang", "Berat"];
    if (!validKategori.includes(kategori_pelanggaran)) {
      return res.status(400).json({ 
        message: "Kategori pelanggaran harus 'Ringan', 'Sedang', atau 'Berat'" 
      });
    }

    if (poin_pelanggaran !== undefined && poin_pelanggaran !== null) {
      if (typeof poin_pelanggaran !== 'number' || poin_pelanggaran < 0) {
        return res.status(400).json({ 
          message: "Poin pelanggaran harus berupa angka positif" 
        });
      }
    }

    // Check for existing (including soft-deleted) to properly handle duplicates
    const existingPelanggaran = await JenisPelanggaran.findOne({ 
      where: { nama_jenis_pelanggaran },
      paranoid: false // Check including soft-deleted records
    });
    
    console.log(`[CREATE] Checking for existing '${nama_jenis_pelanggaran}':`, 
      existingPelanggaran ? 
      `Found (id: ${existingPelanggaran.id_jenis_pelanggaran}, deletedAt: ${existingPelanggaran.deletedAt})` : 
      'Not found'
    );
    
    if (existingPelanggaran) {
      if (existingPelanggaran.deletedAt) {
        // Restore soft-deleted record instead of creating new one
        console.log(`[CREATE] Restoring soft-deleted record id: ${existingPelanggaran.id_jenis_pelanggaran}`);
        await existingPelanggaran.restore();
        
        // Update with new values
        await existingPelanggaran.update({
          kategori_pelanggaran,
          deskripsi,
          tindakan_sekolah,
          poin_pelanggaran,
          admin_id: req.user?.id || null,
        });
        
        return res.status(201).json({
          message: "Data jenis pelanggaran berhasil ditambahkan (restored from trash)",
          data: existingPelanggaran,
        });
      } else {
        // Active record exists
        return res.status(409).json({ 
          message: "Nama jenis pelanggaran sudah terdaftar",
          fields: { nama_jenis_pelanggaran: "Nama jenis pelanggaran sudah terdaftar" }
        });
      }
    }

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
      tindakan_sekolah,
      poin_pelanggaran,
      admin_id,
    });

    console.log(`[CREATE] Successfully created new record id: ${newData.id_jenis_pelanggaran}`);

    res.status(201).json({
      message: "Data jenis pelanggaran berhasil ditambahkan",
      data: newData,
    });
  } catch (error) {
    console.error("Error creating jenis pelanggaran:", error);
    // Handle Sequelize validation and unique constraint errors and return detailed messages
    if (error && Array.isArray(error.errors)) {
      const messages = error.errors.map((e) => e.message);

      // Build a field->message map for client-friendly errors when possible
      const fields = {};
      let isUnique = false;
      error.errors.forEach((e) => {
        const field = e.path || e.instance?.constructor?.name || 'unknown';
        if (e.type === 'unique violation' || (e.message && e.message.includes('must be unique'))) {
          isUnique = true;
          if (field === 'nama_jenis_pelanggaran') {
            fields[field] = 'Nama jenis pelanggaran sudah terdaftar';
          } else {
            fields[field] = e.message;
          }
        } else {
          fields[field] = e.message;
        }
      });

      // Return 409 for unique constraint, 400 for other validation errors
      if (isUnique) {
        return res.status(409).json({ message: "Conflict", errors: messages, fields });
      }
      return res.status(400).json({ message: "Validation error", errors: messages, fields });
    }

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

  const { nama_jenis_pelanggaran, kategori_pelanggaran, poin_pelanggaran, tindakan_sekolah } = req.body;

    if (nama_jenis_pelanggaran !== undefined && !nama_jenis_pelanggaran) {
      return res.status(400).json({ 
        message: "Nama jenis pelanggaran tidak boleh kosong" 
      });
    }

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

    if (kategori_pelanggaran && kategori_pelanggaran !== pelanggaran.kategori_pelanggaran) {
      const validKategori = ["Ringan", "Sedang", "Berat"];
      if (!validKategori.includes(kategori_pelanggaran)) {
        return res.status(400).json({ 
          message: "Kategori pelanggaran harus 'Ringan', 'Sedang', atau 'Berat'" 
        });
      }
    }

    if (poin_pelanggaran !== undefined && poin_pelanggaran !== null) {
      if (typeof poin_pelanggaran !== 'number' || poin_pelanggaran < 0) {
        return res.status(400).json({ 
          message: "Poin pelanggaran harus berupa angka positif" 
        });
      }
    }
    // Only allow updating known fields
    const updateData = {
      ...(nama_jenis_pelanggaran !== undefined && { nama_jenis_pelanggaran }),
      ...(kategori_pelanggaran !== undefined && { kategori_pelanggaran }),
      ...(poin_pelanggaran !== undefined && { poin_pelanggaran }),
      ...(tindakan_sekolah !== undefined && { tindakan_sekolah }),
      ...(req.body.deskripsi !== undefined && { deskripsi: req.body.deskripsi }),
    };

    await pelanggaran.update(updateData);
    res.json({ message: "Data jenis pelanggaran berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating jenis pelanggaran:", error);
    if (error && Array.isArray(error.errors)) {
      const messages = error.errors.map((e) => e.message);
      const fields = {};
      let isUnique = false;
      error.errors.forEach((e) => {
        const field = e.path || e.instance?.constructor?.name || 'unknown';
        if (e.type === 'unique violation' || (e.message && e.message.includes('must be unique'))) {
          isUnique = true;
          if (field === 'nama_jenis_pelanggaran') {
            fields[field] = 'Nama jenis pelanggaran sudah terdaftar';
          } else {
            fields[field] = e.message;
          }
        } else {
          fields[field] = e.message;
        }
      });
      if (isUnique) {
        return res.status(409).json({ message: 'Conflict', errors: messages, fields });
      }
      return res.status(400).json({ message: 'Validation error', errors: messages, fields });
    }
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