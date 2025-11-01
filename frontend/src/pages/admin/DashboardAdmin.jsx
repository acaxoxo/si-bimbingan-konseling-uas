import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../lib/axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardAdmin() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    admin: 0,
    orangTua: 0,
    guru: 0,
    siswa: 0,
    kelas: 0,
    jenisPelanggaran: 0,
    guruAktif: 0,
    kelasAktif: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    trendBulanan: [],
    pelanggaranByKategori: [],
    topPelanggar: [],
    pelanggaranByKelas: [],
  });
  const [loadingChart, setLoadingChart] = useState(true);
  const [totals, setTotals] = useState({ totalUsers: 0, totalViolations: 0 });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [adminRes, orangTuaRes, guruRes, siswaRes, kelasRes, jenisRes] = await Promise.all([
          api.get("/admin").catch(() => ({ data: { data: [] } })),
          api.get("/orang-tua").catch(() => ({ data: { data: [] } })),
          api.get("/guru").catch(() => ({ data: { data: [] } })),
          api.get("/siswa").catch(() => ({ data: { data: [] } })),
          api.get("/kelas").catch(() => ({ data: { data: [] } })),
          api.get("/jenis-pelanggaran").catch(() => ({ data: { data: [] } })),
        ]);

        const admins = Array.isArray(adminRes.data?.data) ? adminRes.data.data : (Array.isArray(adminRes.data) ? adminRes.data : []);
        const orangTuas = Array.isArray(orangTuaRes.data?.data) ? orangTuaRes.data.data : (Array.isArray(orangTuaRes.data) ? orangTuaRes.data : []);
        const gurus = Array.isArray(guruRes.data?.data) ? guruRes.data.data : (Array.isArray(guruRes.data) ? guruRes.data : []);
        const siswas = Array.isArray(siswaRes.data?.data) ? siswaRes.data.data : (Array.isArray(siswaRes.data) ? siswaRes.data : []);
        const kelass = Array.isArray(kelasRes.data?.data) ? kelasRes.data.data : (Array.isArray(kelasRes.data) ? kelasRes.data : []);
        const jenis = Array.isArray(jenisRes.data?.data) ? jenisRes.data.data : (Array.isArray(jenisRes.data) ? jenisRes.data : []);

        const guruAktif = gurus.filter((g) => (g.status_aktif || "").toString().trim().toLowerCase() === "aktif").length;
        const kelasAktif = kelass.filter((k) => Number(k.guruId) > 0).length;

        const nextStats = {
          admin: admins.length,
          orangTua: orangTuas.length,
          guru: gurus.length,
          siswa: siswas.length,
          kelas: kelass.length,
          jenisPelanggaran: jenis.length,
          guruAktif,
          kelasAktif,
        };

        setStats(nextStats);
        setTotals({
          totalUsers: nextStats.admin + nextStats.orangTua + nextStats.guru + nextStats.siswa,
          totalViolations: 0, 
        });
      } finally {
        setLoading(false);
      }
    })();

    (async () => {
      try {
        setLoadingChart(true);
        const res = await api.get("/laporan/dashboard-stats");
        const data = res.data || {};
        const bulanNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const trendFormatted = (data.trendBulanan || []).map((it) => ({ bulan: `${bulanNames[it.bulan - 1]} ${it.tahun}`, total: parseInt(it.total) }));
        const kategoriFormatted = (data.pelanggaranByKategori || []).map((it) => ({ kategori: it.kategori_pelanggaran, total: parseInt(it.total) }));
        const topPelanggarFormatted = (data.topPelanggar || []).map((it) => ({ nama: it.nama_siswa, nis: it.nis, total_poin: parseInt(it.total_poin) }));
        const kelasFormatted = (data.pelanggaranByKelas || []).map((it) => ({ kelas: it.nama_kelas, total: parseInt(it.total) }));
        const nextChartData = {
          trendBulanan: trendFormatted,
          pelanggaranByKategori: kategoriFormatted,
          topPelanggar: topPelanggarFormatted,
          pelanggaranByKelas: kelasFormatted,
        };
        setChartData(nextChartData);
        const totalViolations = (trendFormatted || []).reduce((sum, i) => sum + (Number(i.total) || 0), 0);
        setTotals((prev) => ({ ...prev, totalViolations }));
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        
        setChartData({
          trendBulanan: [],
          pelanggaranByKategori: [],
          topPelanggar: [],
          pelanggaranByKelas: [],
        });
      } finally {
        setLoadingChart(false);
      }
    })();
  }, []);

  const COLORS = { Ringan: "#28a745", Sedang: "#ffc107", Berat: "#dc3545" };

  const TopMetric = ({ title, value, color }) => (
    <div className="dashboard-card">
      <div className="d-flex justify-content-between align-items-start">
        <span className="label" style={{ color: 'var(--text-secondary)' }}>{title}</span>
      </div>
      <div className="mt-2">
        <span className="metric" style={{ color }}>
          {loading ? '…' : value}
        </span>
      </div>
    </div>
  );

  const EmptyState = ({ message = "Tidak ada data untuk ditampilkan" }) => (
    <div className="empty-state">
      <i className="fa-regular fa-circle-pause me-2"></i>
      <span>{message}</span>
    </div>
  );

  const cards = [
    { title: "Administrator", count: stats.admin, color: "primary", link: "/admin/data/admin" },
    { title: "Orang Tua / Wali", count: stats.orangTua, color: "success", link: "/admin/data/orang-tua" },
    { title: "Guru", count: stats.guru, color: "dark", link: "/admin/data/guru" },
    { title: "Siswa", count: stats.siswa, color: "warning", link: "/admin/data/siswa" },
    { title: "Kelas", count: stats.kelas, color: "info", link: "/admin/data/kelas" },
    { title: "Jenis Pelanggaran", count: stats.jenisPelanggaran, color: "danger", link: "/admin/data/jenis-pelanggaran" },
  ];

  return (
    <div className="container mt-5 mb-5 pb-4">
      {}
      <div className="card border-0 shadow-sm mb-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
        <div className="card-body">
          <h3 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Selamat Datang, {user?.name || "Administrator"}</h3>
          <p className="mt-1 mb-0" style={{ color: 'var(--text-secondary)' }}>Sistem Informasi Bimbingan Konseling SMK Negeri 1 Kupang</p>
        </div>
      </div>

      {}
      <div className="dashboard-grid-top mb-4">
        <TopMetric title="Total Pengguna" value={totals.totalUsers} color="#667eea" />
        <TopMetric title="Guru Aktif" value={stats.guruAktif} color="#10b981" />
        <TopMetric title="Total Pelanggaran (12 bln)" value={totals.totalViolations} color="#ef4444" />
      </div>

      {}
      <div className="dashboard-grid-secondary mb-4">
        {cards.map((item, idx) => (
          <div key={idx} className="dashboard-card">
            <span className="label" style={{ color: 'var(--text-secondary)' }}>{item.title}</span>
            <div className="d-flex align-items-end justify-content-between mt-2">
              <span className="metric" style={{ color: `var(--text-primary)` }}>{loading ? '…' : item.count}</span>
              <Link to={item.link} className="btn btn-sm btn-outline-secondary">Lihat</Link>
            </div>
          </div>
        ))}
      </div>

      {}
      <h5 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}><i className="fa-solid fa-chart-line me-2"></i>Statistik Pelanggaran</h5>
      {loadingChart ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div><p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Memuat grafik...</p></div>
      ) : (
        <>
          {}
          <div className="dashboard-panel mb-4">
            <div className="panel-header"><h6 className="mb-0"><i className="fa-solid fa-chart-line me-2"></i>Trend Pelanggaran (12 Bulan Terakhir)</h6></div>
            <div className={`panel-body ${chartData.trendBulanan.length === 0 ? 'shrink' : ''}`}>
              {chartData.trendBulanan.length === 0 ? (
                <EmptyState message="Belum ada data trend pelanggaran" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.trendBulanan}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bulan" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#667eea" strokeWidth={2} name="Jumlah Pelanggaran" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {}
          <div className="dashboard-grid-charts">
            {}
            <div className="dashboard-panel">
              <div className="panel-header"><h6 className="mb-0"><i className="fa-solid fa-chart-pie me-2"></i>Pelanggaran per Kategori</h6></div>
              <div className={`panel-body ${chartData.pelanggaranByKategori.length === 0 ? 'shrink' : ''}`}>
                {chartData.pelanggaranByKategori.length === 0 ? (
                  <EmptyState message="Belum ada data kategori pelanggaran" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={chartData.pelanggaranByKategori} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="total" label={({ kategori, total, percent }) => `${kategori}: ${total} (${(percent * 100).toFixed(0)}%)`}>
                        {chartData.pelanggaranByKategori.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.kategori] || "#9ca3af"} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {}
            <div className="dashboard-panel">
              <div className="panel-header"><h6 className="mb-0"><i className="fa-solid fa-chart-column me-2"></i>Pelanggaran per Kelas</h6></div>
              <div className={`panel-body ${chartData.pelanggaranByKelas.length === 0 ? 'shrink' : ''}`}>
                {chartData.pelanggaranByKelas.length === 0 ? (
                  <EmptyState message="Belum ada data pelanggaran per kelas" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.pelanggaranByKelas}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="kelas" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" fill="#22c55e" name="Jumlah Pelanggaran" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {}
          <div className="dashboard-panel mt-4">
            <div className="panel-header"><h6 className="mb-0"><i className="fa-solid fa-ranking-star me-2"></i>Top 10 Siswa (Poin Tertinggi)</h6></div>
            <div className={`panel-body ${chartData.topPelanggar.length === 0 ? 'shrink' : ''}`}>
              {chartData.topPelanggar.length === 0 ? (
                <EmptyState message="Belum ada data peringkat pelanggaran" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.topPelanggar} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nama" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total_poin" fill="#ef4444" name="Total Poin" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div className="mt-3 d-flex justify-content-end">
                <Link to="/admin/laporan" className="btn btn-sm btn-outline-secondary"><i className="fa-solid fa-file-lines me-2"></i>Lihat Laporan</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
