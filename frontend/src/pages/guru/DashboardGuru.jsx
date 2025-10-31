import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";
import Loading from "../../components/Loading";
import { formatAxiosError } from "../../lib/error";

export default function DashboardGuru() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    pelanggaranBulanIni: 0,
    tanggapanOrangTua: 0,
    laporanDibuat: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError("");
        // Fetch all pelanggaran siswa and tanggapan
        const [pelRes, tanggapanRes] = await Promise.all([
          api.get("/pelanggaran-siswa"),
          api.get("/tanggapan").catch(() => ({ data: { data: [] } })),
        ]);
        // Extract data from paginated response: { data: [...], pagination: {...} }
        const pelanggaran = pelRes.data?.data || pelRes.data || [];
        const tanggapan = tanggapanRes.data?.data || tanggapanRes.data || [];
        
        // Current month/year
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        // Pelanggaran bulan ini
        const pelanggaranBulanIni = pelanggaran.filter(p => {
          if (!p.tanggal_pelanggaran) return false;
          const tgl = new Date(p.tanggal_pelanggaran);
          return tgl.getMonth() + 1 === month && tgl.getFullYear() === year;
        }).length;

        // Laporan dibuat oleh guru ini
        const laporanDibuat = pelanggaran.filter(p => p.guruId === user?.id).length;
        
        // Tanggapan orang tua untuk pelanggaran yang dibuat oleh guru ini
        const tanggapanUntukGuruIni = Array.isArray(tanggapan)
          ? tanggapan.filter(t => t?.pelanggaran_siswa?.guruId === user?.id).length
          : 0;

        setStats({
          pelanggaranBulanIni,
          tanggapanOrangTua: tanggapanUntukGuruIni,
          laporanDibuat,
        });
        setLoading(false);
      } catch (err) {
        setError(formatAxiosError(err));
        // fallback: show zeroes
        setStats({
          pelanggaranBulanIni: 0,
          tanggapanOrangTua: 0,
          laporanDibuat: 0,
        });
        setLoading(false);
      }
    };
    fetchSummary();
  }, [user]);

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

  const actionCards = [
    {
      title: "Data Pelanggaran",
      icon: "fa-solid fa-triangle-exclamation",
      description: "Kelola data pelanggaran siswa (input, edit, hapus).",
      link: "/guru/data/pelanggaran-siswa",
    },
    {
      title: "Tanggapan Orang Tua",
      icon: "fa-solid fa-comments",
      description: "Lihat dan tindaklanjuti tanggapan orang tua/wali.",
      link: "/guru/data/tanggapan",
    },
    {
      title: "Laporan",
      icon: "fa-solid fa-file-export",
      description: "Hasilkan laporan pelanggaran untuk kepala sekolah.",
      link: "/guru/laporan",
    },
  ];

  return (
    <div className="container mt-5 mb-5 pb-4">
      {/* Welcome Card */}
      <div className="card border-0 shadow-sm mb-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
        <div className="card-body">
          <h3 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Selamat Datang, {user?.name || "Guru BK"}</h3>
          <p className="mt-1 mb-0" style={{ color: 'var(--text-secondary)' }}>Dashboard Guru Bimbingan Konseling - SMK Negeri 1 Kupang</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning mb-4" role="alert" style={{ borderRadius: '12px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <Loading label="Memuat ringkasan dashboard..." />
      ) : (
        <>
          {/* Top metrics - single responsive row */}
          <div className="dashboard-grid-top mb-4">
            <TopMetric title="Pelanggaran Bulan Ini" value={stats.pelanggaranBulanIni} color="#ef4444" />
            <TopMetric title="Tanggapan Orang Tua" value={stats.tanggapanOrangTua} color="#667eea" />
            <TopMetric title="Laporan Dibuat" value={stats.laporanDibuat} color="#10b981" />
          </div>

          {/* Action cards: guru-specific tools */}
          <h5 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}><i className="fa-solid fa-briefcase me-2"></i>Menu Aksi</h5>
          <div className="dashboard-grid-secondary mb-4">
            {actionCards.map((card, idx) => (
              <div key={idx} className="dashboard-card">
                <div className="d-flex align-items-start mb-2">
                  <i className={`${card.icon} me-2`} style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}></i>
                  <span className="label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{card.title}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{card.description}</p>
                <div className="d-flex justify-content-end">
                  <Link to={card.link} className="btn btn-sm btn-outline-secondary">Buka</Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
