import TindakanSekolah from "../models/TindakanSekolahModel.js";
import PelanggaranSiswa from "../models/PelanggaranSiswaModel.js";
import Guru from "../models/GuruModel.js";
import Siswa from "../models/SiswaModel.js";
import JenisPelanggaran from "../models/JenisPelanggaranModel.js";

export const getAllTindakan = async (req, res) => {
  try {
    const data = await TindakanSekolah.findAll({
      include: [
        {
          model: PelanggaranSiswa,
          include: [
            { model: Siswa, attributes: ["nama_siswa", "nis"] },
            { model: JenisPelanggaran, attributes: ["nama_jenis_pelanggaran", "kategori_pelanggaran"] },
          ],
        },
        { model: Guru, attributes: ["nama_guru", "jabatan"] },
      ],
      order: [["tanggal_tindakan", "DESC"]],
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTindakanById = async (req, res) => {
  try {
    const data = await TindakanSekolah.findByPk(req.params.id, {
      include: [
        {
          model: PelanggaranSiswa,
          include: [
            { model: Siswa, attributes: ["nama_siswa"] },
            { model: JenisPelanggaran, attributes: ["nama_jenis_pelanggaran"] },
          ],
        },
        { model: Guru, attributes: ["nama_guru"] },
      ],
    });
    if (!data) return res.status(404).json({ message: "Tindakan tidak ditemukan" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTindakan = async (req, res) => {
  try {
    const tindakan = await TindakanSekolah.create(req.body);
    res.status(201).json({
      message: "Tindakan sekolah berhasil ditambahkan",
      data: tindakan,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTindakan = async (req, res) => {
  try {
    const tindakan = await TindakanSekolah.findByPk(req.params.id);
    if (!tindakan) return res.status(404).json({ message: "Tindakan tidak ditemukan" });
    await tindakan.update(req.body);
    res.json({ message: "Tindakan berhasil diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTindakan = async (req, res) => {
  try {
    const tindakan = await TindakanSekolah.findByPk(req.params.id);
    if (!tindakan) return res.status(404).json({ message: "Tindakan tidak ditemukan" });
    await tindakan.destroy();
    res.json({ message: "Tindakan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};