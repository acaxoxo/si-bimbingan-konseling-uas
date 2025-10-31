import Admin from "../models/AdminModel.js";

export const getAllAdmin = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: ["id_admin", "nama_admin", "email_admin"],
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id, {
      attributes: ["id_admin", "nama_admin", "email_admin"],
    });
    if (!admin)
      return res.status(404).json({ message: "Admin tidak ditemukan" });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin)
      return res.status(404).json({ message: "Admin tidak ditemukan" });

    await admin.update(req.body);
    res.json({ message: "Admin berhasil diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin)
      return res.status(404).json({ message: "Admin tidak ditemukan" });

    await admin.destroy();
    res.json({ message: "Admin berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
