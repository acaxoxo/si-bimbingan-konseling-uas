import PelanggaranSiswa from "../models/PelanggaranSiswaModel.js";
import Siswa from "../models/SiswaModel.js";
import Kelas from "../models/KelasModel.js";
import JenisPelanggaran from "../models/JenisPelanggaranModel.js";
import { Op } from "sequelize";
import sequelize from "../config/database.js";

export const getPelanggaranTrendPerBulan = async (req, res) => {
  try {
    const { year = new Date().getFullYear(), kelasId } = req.query;

    const whereClause = {
      tanggal_pelanggaran: {
        [Op.between]: [
          new Date(`${year}-01-01`),
          new Date(`${year}-12-31 23:59:59`),
        ],
      },
    };

    let include = [];
    if (kelasId) {
      include.push({
        model: Siswa,
        attributes: [],
        where: { kelasId: kelasId },
        required: true,
      });
    }

    const pelanggaranData = await PelanggaranSiswa.findAll({
      where: whereClause,
      include,
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("tanggal_pelanggaran"), "%Y-%m"),
          "month",
        ],
        [sequelize.fn("COUNT", sequelize.col("id_pelanggaran")), "count"],
      ],
      group: ["month"],
      order: [[sequelize.literal("month"), "ASC"]],
      raw: true,
    });

    const monthlyData = [];
    for (let i = 1; i <= 12; i++) {
      const monthStr = `${year}-${String(i).padStart(2, "0")}`;
      const found = pelanggaranData.find((d) => d.month === monthStr);
      
      monthlyData.push({
        month: monthStr,
        monthName: new Date(`${year}-${i}-01`).toLocaleDateString("id-ID", {
          month: "long",
        }),
        count: found ? parseInt(found.count) : 0,
      });
    }

    res.json({
      year: parseInt(year),
      kelasId: kelasId || "all",
      data: monthlyData,
    });
  } catch (error) {
    console.error("Error getting pelanggaran trend:", error);
    res.status(500).json({
      message: "Gagal mengambil data trend pelanggaran",
      error: error.message,
    });
  }
};

export const getKelasComparison = async (req, res) => {
  try {
    const { startDate, endDate, year = new Date().getFullYear() } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        tanggal_pelanggaran: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      };
    } else {
      
      dateFilter = {
        tanggal_pelanggaran: {
          [Op.between]: [
            new Date(`${year}-01-01`),
            new Date(`${year}-12-31 23:59:59`),
          ],
        },
      };
    }

    const kelasData = await Kelas.findAll({
      attributes: [
        "id_kelas",
        "nama_kelas",
        "kelas_kejuruan",
        [
          sequelize.fn("COUNT", sequelize.col("siswas.pelanggaran_siswas.id_pelanggaran")),
          "total_pelanggaran",
        ],
        [
          sequelize.fn("COUNT", sequelize.fn("DISTINCT", sequelize.col("siswas.id_siswa"))),
          "total_siswa",
        ],
      ],
      include: [
        {
          model: Siswa,
          attributes: [],
          include: [
            {
              model: PelanggaranSiswa,
              attributes: [],
              where: dateFilter,
              required: false,
            },
          ],
          required: false,
        },
      ],
      group: ["kelas.id_kelas"],
      order: [[sequelize.literal("total_pelanggaran"), "DESC"]],
      raw: true,
    });

    const enrichedData = kelasData.map((kelas) => {
      const totalPelanggaran = parseInt(kelas.total_pelanggaran) || 0;
      const totalSiswa = parseInt(kelas.total_siswa) || 0;
      const avgPerSiswa = totalSiswa > 0 ? (totalPelanggaran / totalSiswa).toFixed(2) : 0;

      return {
        id_kelas: kelas.id_kelas,
        nama_kelas: kelas.nama_kelas,
        kelas_kejuruan: kelas.kelas_kejuruan,
        total_pelanggaran: totalPelanggaran,
        total_siswa: totalSiswa,
        avg_pelanggaran_per_siswa: parseFloat(avgPerSiswa),
      };
    });

    res.json({
      period: startDate && endDate ? { startDate, endDate } : { year: parseInt(year) },
      data: enrichedData,
    });
  } catch (error) {
    console.error("Error getting kelas comparison:", error);
    res.status(500).json({
      message: "Gagal mengambil perbandingan antar kelas",
      error: error.message,
    });
  }
};

export const getCategoryComparison = async (req, res) => {
  try {
    const { startDate, endDate, year = new Date().getFullYear(), kelasId } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        tanggal_pelanggaran: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      };
    } else {
      dateFilter = {
        tanggal_pelanggaran: {
          [Op.between]: [
            new Date(`${year}-01-01`),
            new Date(`${year}-12-31 23:59:59`),
          ],
        },
      };
    }

    let includeClause = [];
    if (kelasId) {
      includeClause.push({
        model: Siswa,
        attributes: [],
        where: { kelasId: kelasId },
        required: true,
      });
    }

    const categoryData = await JenisPelanggaran.findAll({
      attributes: [
        "id_jenis_pelanggaran",
        "nama_jenis_pelanggaran",
        "kategori_pelanggaran",
        "poin_pelanggaran",
        [
          sequelize.fn("COUNT", sequelize.col("pelanggaran_siswas.id_pelanggaran")),
          "total_count",
        ],
      ],
      include: [
        {
          model: PelanggaranSiswa,
          attributes: [],
          where: dateFilter,
          required: false,
          include: includeClause,
        },
      ],
      group: ["jenis_pelanggaran.id_jenis_pelanggaran"],
      order: [[sequelize.literal("total_count"), "DESC"]],
      raw: true,
    });

    res.json({
      period: startDate && endDate ? { startDate, endDate } : { year: parseInt(year) },
      kelasId: kelasId || "all",
      data: categoryData.map((cat) => ({
        id_jenis_pelanggaran: cat.id_jenis_pelanggaran,
        nama_jenis_pelanggaran: cat.nama_jenis_pelanggaran,
        kategori_pelanggaran: cat.kategori_pelanggaran,
        poin_pelanggaran: cat.poin_pelanggaran,
        total_count: parseInt(cat.total_count) || 0,
      })),
    });
  } catch (error) {
    console.error("Error getting category comparison:", error);
    res.status(500).json({
      message: "Gagal mengambil perbandingan kategori pelanggaran",
      error: error.message,
    });
  }
};

export const getTopViolators = async (req, res) => {
  try {
    const { limit = 10, startDate, endDate, year = new Date().getFullYear() } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        tanggal_pelanggaran: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      };
    } else {
      dateFilter = {
        tanggal_pelanggaran: {
          [Op.between]: [
            new Date(`${year}-01-01`),
            new Date(`${year}-12-31 23:59:59`),
          ],
        },
      };
    }

    const topViolators = await Siswa.findAll({
      attributes: [
        "id_siswa",
        "nama_siswa",
        "nis",
        [
          sequelize.fn("COUNT", sequelize.col("pelanggaran_siswas.id_pelanggaran")),
          "total_pelanggaran",
        ],
        [
          sequelize.fn("SUM", sequelize.col("pelanggaran_siswas.jenis_pelanggaran.poin_pelanggaran")),
          "total_poin",
        ],
      ],
      include: [
        {
          model: Kelas,
          attributes: ["nama_kelas", "kelas_kejuruan"],
        },
        {
          model: PelanggaranSiswa,
          attributes: [],
          where: dateFilter,
          required: true,
          include: [
            {
              model: JenisPelanggaran,
              attributes: [],
            },
          ],
        },
      ],
      group: ["siswa.id_siswa", "kela.id_kelas"],
      order: [[sequelize.literal("total_pelanggaran"), "DESC"]],
      limit: parseInt(limit),
      subQuery: false,
    });

    res.json({
      period: startDate && endDate ? { startDate, endDate } : { year: parseInt(year) },
      limit: parseInt(limit),
      data: topViolators.map((siswa) => ({
        id_siswa: siswa.id_siswa,
        nama_siswa: siswa.nama_siswa,
        nis: siswa.nis,
        kelas: siswa.kela
          ? `${siswa.kela.nama_kelas} ${siswa.kela.kelas_kejuruan}`
          : "-",
        total_pelanggaran: parseInt(siswa.get("total_pelanggaran")) || 0,
        total_poin: parseInt(siswa.get("total_poin")) || 0,
      })),
    });
  } catch (error) {
    console.error("Error getting top violators:", error);
    res.status(500).json({
      message: "Gagal mengambil data top violators",
      error: error.message,
    });
  }
};

export default {
  getPelanggaranTrendPerBulan,
  getKelasComparison,
  getCategoryComparison,
  getTopViolators,
};
