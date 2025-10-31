import TanggapanOrangTua from "../models/TanggapanOrangTuaModel.js";
import OrangTua from "../models/OrangTuaModel.js";
import PelanggaranSiswa from "../models/PelanggaranSiswaModel.js";
import Siswa from "../models/SiswaModel.js";
import JenisPelanggaran from "../models/JenisPelanggaranModel.js";

export const getAllTanggapan = async (req, res) => {
  try {
    const data = await TanggapanOrangTua.findAll({
      include: [
        { model: OrangTua, attributes: ["id_orang_tua", "nama_ayah", "nama_ibu"] },
        {
          model: PelanggaranSiswa,
          include: [
            { model: Siswa, attributes: ["nama_siswa", "nis"] },
            { model: JenisPelanggaran, attributes: ["nama_jenis_pelanggaran", "kategori_pelanggaran"] },
          ],
        },
      ],
      order: [["id_tanggapan", "DESC"]],
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTanggapanById = async (req, res) => {
  try {
    const data = await TanggapanOrangTua.findByPk(req.params.id, {
      include: [
        { model: OrangTua, attributes: ["nama_ayah", "nama_ibu"] },
        {
          model: PelanggaranSiswa,
          include: [
            { model: Siswa, attributes: ["nama_siswa", "nis"] },
            { model: JenisPelanggaran, attributes: ["nama_jenis_pelanggaran", "kategori_pelanggaran"] },
          ],
        },
      ],
    });
    if (!data) return res.status(404).json({ message: "Tanggapan tidak ditemukan" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTanggapan = async (req, res) => {
  try {
    const parentId = req.user?.id;
    if (!parentId) return res.status(401).json({ message: "Tidak terautentik" });

    const { pelanggaranSiswaId, isi_tanggapan, tindakan_rumah } = req.body;

    const newTanggapan = await TanggapanOrangTua.create({
      orangTuaId: parentId,
      pelanggaranSiswaId,
      isi_tanggapan,
      tindakan_rumah,
    });

    res.status(201).json({
      message: "Tanggapan orang tua berhasil ditambahkan",
      data: newTanggapan,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTanggapan = async (req, res) => {
  try {
    const data = await TanggapanOrangTua.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Tanggapan tidak ditemukan" });

    await data.update(req.body);
    res.json({ message: "Tanggapan berhasil diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTanggapan = async (req, res) => {
  try {
    const data = await TanggapanOrangTua.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Tanggapan tidak ditemukan" });

    await data.destroy();
    res.json({ message: "Tanggapan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};