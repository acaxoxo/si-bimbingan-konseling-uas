import Siswa from "../models/SiswaModel.js";
import PelanggaranSiswa from "../models/PelanggaranSiswaModel.js";
import JenisPelanggaran from "../models/JenisPelanggaranModel.js";
import TindakanSekolah from "../models/TindakanSekolahModel.js";
import Guru from "../models/GuruModel.js";
import Kelas from "../models/KelasModel.js";
import { Op } from "sequelize";
import db from "../config/database.js";

export const getLaporanSekolah = async (req, res) => {
  try {
    const laporan = await Siswa.findAll({
      attributes: ["id_siswa", "nama_siswa", "nis"],
      include: [
        {
          model: PelanggaranSiswa,
          include: [
            {
              model: JenisPelanggaran,
              attributes: ["nama_jenis_pelanggaran", "poin_pelanggaran", "kategori_pelanggaran"],
            },
            {
              model: TindakanSekolah,
              attributes: ["jenis_tindakan", "status_tindakan", "tanggal_tindakan"],
            },
          ],
        },
      ],
    });

    const hasil = laporan.map((s) => {
      const pelanggaran = s.pelanggaran_siswas || [];
      const totalPoin = pelanggaran.reduce((sum, p) => sum + (p.jenis_pelanggaran?.poin_pelanggaran || 0), 0);
      const totalTindakan = pelanggaran.reduce(
        (sum, p) => sum + (p.tindakan_sekolahs?.length || 0),
        0
      );

      return {
        id_siswa: s.id_siswa,
        nama_siswa: s.nama_siswa,
        nis: s.nis,
        jumlah_pelanggaran: pelanggaran.length,
        total_poin: totalPoin,
        jumlah_tindakan: totalTindakan,
        status_terakhir:
          pelanggaran.length > 0
            ? pelanggaran[pelanggaran.length - 1]?.status_konseling || "-"
            : "-",
      };
    });

    res.json(hasil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getLaporanAnak = async (req, res) => {
  try {
    const parentId = req.user?.id;
    if (!parentId) {
      return res.status(401).json({ message: "Tidak terautentik" });
    }

    const siswa = await Siswa.findOne({ where: { orangTuaId: parentId } });
    if (!siswa) {
      return res.json([]);
    }

    const pelanggarans = await PelanggaranSiswa.findAll({
      where: { siswaId: siswa.id_siswa },
      include: [
        {
          model: JenisPelanggaran,
          attributes: [
            "id_jenis_pelanggaran",
            "nama_jenis_pelanggaran",
            "poin_pelanggaran",
            "kategori_pelanggaran",
          ],
        },
        { model: Guru, attributes: ["id_guru", "nama_guru"] },
      ],
      order: [["tanggal_pelanggaran", "DESC"], ["id_pelanggaran_siswa", "DESC"]],
    });

    const result = pelanggarans.map((p) => ({
      id_laporan: p.id_pelanggaran_siswa,
      jenis_pelanggaran: p.jenis_pelanggaran?.nama_jenis_pelanggaran || "",
      poin: p.jenis_pelanggaran?.poin_pelanggaran || 0,
      tanggal_pelanggaran: p.tanggal_pelanggaran,
      catatan_konseling: p.catatan_konseling || "",
      status_konseling: (p.status_konseling || "Belum").toString().toLowerCase(),
      tindak_lanjut: p.tindak_lanjut || "",
      guru: p.guru?.nama_guru || "",
      tanggapan_orangtua: null,
    }));

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

  export const getDashboardStats = async (req, res) => {
    try {
      const currentYear = new Date().getFullYear();

      const trendBulanan = await PelanggaranSiswa.findAll({
        attributes: [
          [db.fn('MONTH', db.col('tanggal_pelanggaran')), 'bulan'],
          [db.fn('YEAR', db.col('tanggal_pelanggaran')), 'tahun'],
          [db.fn('COUNT', db.col('id_pelanggaran_siswa')), 'total']
        ],
        where: {
          tanggal_pelanggaran: {
            [Op.gte]: new Date(currentYear - 1, new Date().getMonth(), 1)
          }
        },
        group: [
          db.fn('YEAR', db.col('tanggal_pelanggaran')),
          db.fn('MONTH', db.col('tanggal_pelanggaran'))
        ],
        order: [[db.fn('YEAR', db.col('tanggal_pelanggaran')), 'ASC'], [db.fn('MONTH', db.col('tanggal_pelanggaran')), 'ASC']],
        raw: true
      });

      const pelanggaranByKategori = await db.query(
        `SELECT jp.kategori_pelanggaran, COUNT(ps.id_pelanggaran_siswa) as total
         FROM pelanggaran_siswa ps
         INNER JOIN jenis_pelanggaran jp ON ps.jenisPelanggaranId = jp.id_jenis_pelanggaran
         GROUP BY jp.kategori_pelanggaran`,
        { type: db.QueryTypes.SELECT }
      );

      const topPelanggar = await db.query(
        `SELECT ps.siswaId, s.nama_siswa, s.nis,
                SUM(jp.poin_pelanggaran) as total_poin,
                COUNT(ps.id_pelanggaran_siswa) as jumlah_pelanggaran
         FROM pelanggaran_siswa ps
         INNER JOIN siswa s ON ps.siswaId = s.id_siswa
         INNER JOIN jenis_pelanggaran jp ON ps.jenisPelanggaranId = jp.id_jenis_pelanggaran
         GROUP BY ps.siswaId, s.id_siswa, s.nama_siswa, s.nis
         ORDER BY total_poin DESC
         LIMIT 10`,
        { type: db.QueryTypes.SELECT }
      );

      const pelanggaranByKelas = await db.query(
        `SELECT k.nama_kelas, k.kelas_kejuruan, COUNT(ps.id_pelanggaran_siswa) as total
         FROM pelanggaran_siswa ps
         INNER JOIN siswa s ON ps.siswaId = s.id_siswa
         INNER JOIN kelas k ON s.kelas_id = k.id_kelas
         GROUP BY k.id_kelas, k.nama_kelas, k.kelas_kejuruan`,
        { type: db.QueryTypes.SELECT }
      );

      res.json({
        trendBulanan,
        pelanggaranByKategori,
        topPelanggar,
        pelanggaranByKelas
      });
    } catch (error) {
      console.error("Error getDashboardStats:", error);
      res.status(500).json({ message: error.message });
    }
  };

  export const getLaporanPelanggaran = async (req, res) => {
    try {
      const { startDate, endDate, periode, kelasId, kategori } = req.query;
    
      let whereClause = {};

      if (startDate && endDate) {
        whereClause.tanggal_pelanggaran = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      } else if (periode) {
        const now = new Date();
        let start, end;
      
        if (periode === 'bulanan') {
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else if (periode === 'semester') {
          const currentMonth = now.getMonth();
          if (currentMonth < 6) {
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear(), 5, 30);
          } else {
            start = new Date(now.getFullYear(), 6, 1);
            end = new Date(now.getFullYear(), 11, 31);
          }
        } else if (periode === 'tahunan') {
          start = new Date(now.getFullYear(), 0, 1);
          end = new Date(now.getFullYear(), 11, 31);
        }
      
        whereClause.tanggal_pelanggaran = {
          [Op.between]: [start, end]
        };
      }

      const includeClause = [
        {
          model: Siswa,
          attributes: ['nama_siswa', 'nis'],
          required: true,
          include: [{
            model: Kelas,
            attributes: ['nama_kelas', 'kelas_kejuruan'],
            required: true,
            where: kelasId ? { id_kelas: kelasId } : {}
          }]
        },
        {
          model: JenisPelanggaran,
          attributes: ['nama_jenis_pelanggaran', 'kategori_pelanggaran', 'poin_pelanggaran'],
          required: true,
          where: kategori ? { kategori_pelanggaran: kategori } : {}
        },
        {
          model: Guru,
          attributes: ['nama_guru'],
          required: false
        }
      ];

      const laporan = await PelanggaranSiswa.findAll({
        where: whereClause,
        include: includeClause,
        order: [['tanggal_pelanggaran', 'DESC']],
      });

      res.json(laporan);
    } catch (error) {
      console.error("Error getLaporanPelanggaran:", error);
      res.status(500).json({ message: error.message });
    }
  };

  export const getAnalisisPoinPerSiswa = async (req, res) => {
    try {
      const { kelasId } = req.query;
    
      let siswaWhere = {};
      if (kelasId) {
        siswaWhere.kelas_id = kelasId;
      }

      const analisis = await PelanggaranSiswa.findAll({
        attributes: [
          'siswa_id',
          [db.fn('SUM', db.col('JenisPelanggaran.poin_pelanggaran')), 'total_poin'],
          [db.fn('COUNT', db.col('PelanggaranSiswa.id_pelanggaran_siswa')), 'jumlah_pelanggaran']
        ],
        include: [
          {
            model: Siswa,
            attributes: ['nama_siswa', 'nis'],
            required: true,
            where: siswaWhere,
            include: [{
              model: Kelas,
              attributes: ['nama_kelas'],
              required: true
            }]
          },
          {
            model: JenisPelanggaran,
            attributes: [],
            required: true
          }
        ],
        group: ['siswa_id', 'Siswa.id_siswa', 'Siswa.Kelas.id_kelas'],
        order: [[db.fn('SUM', db.col('JenisPelanggaran.poin_pelanggaran')), 'DESC']],
        raw: true
      });

      res.json(analisis);
    } catch (error) {
      console.error("Error getAnalisisPoinPerSiswa:", error);
      res.status(500).json({ message: error.message });
    }
  };

  export const getAnalisisPoinPerKelas = async (req, res) => {
    try {
      const analisis = await PelanggaranSiswa.findAll({
        attributes: [
          [db.fn('SUM', db.col('JenisPelanggaran.poin_pelanggaran')), 'total_poin'],
          [db.fn('COUNT', db.col('PelanggaranSiswa.id_pelanggaran_siswa')), 'jumlah_pelanggaran'],
          [db.fn('COUNT', db.fn('DISTINCT', db.col('Siswa.id_siswa'))), 'jumlah_siswa']
        ],
        include: [
          {
            model: Siswa,
            attributes: [],
            required: true,
            include: [{
              model: Kelas,
              attributes: ['nama_kelas', 'kelas_kejuruan'],
              required: true
            }]
          },
          {
            model: JenisPelanggaran,
            attributes: [],
            required: true
          }
        ],
        group: ['Siswa.Kelas.id_kelas'],
        order: [[db.fn('SUM', db.col('JenisPelanggaran.poin_pelanggaran')), 'DESC']],
        raw: true
      });

      res.json(analisis);
    } catch (error) {
      console.error("Error getAnalisisPoinPerKelas:", error);
      res.status(500).json({ message: error.message });
    }
  };
