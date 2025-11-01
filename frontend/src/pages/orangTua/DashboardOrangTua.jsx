import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../lib/axios";

export default function DashboardOrangtua() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pelanggaranAnak: 0,
    guruMengajar: 0,
    kelasAktif: 0,
    tanggapanDiberikan: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      const [lapRes, guruRes, kelasRes, tanggapanRes] = await Promise.all([
        api.get("/laporan/anak").catch(() => ({ data: { data: [] } })),
        api.get("/guru").catch(() => ({ data: { data: [] } })),
        api.get("/kelas").catch(() => ({ data: { data: [] } })),
        api.get("/tanggapan").catch(() => ({ data: { data: [] } })),
      ]);

      const lap = Array.isArray(lapRes.data?.data) ? lapRes.data.data : (Array.isArray(lapRes.data) ? lapRes.data : []);
      const gurus = Array.isArray(guruRes.data?.data) ? guruRes.data.data : (Array.isArray(guruRes.data) ? guruRes.data : []);
      const kelass = Array.isArray(kelasRes.data?.data) ? kelasRes.data.data : (Array.isArray(kelasRes.data) ? kelasRes.data : []);
      const tanggapans = Array.isArray(tanggapanRes.data?.data) ? tanggapanRes.data.data : (Array.isArray(tanggapanRes.data) ? tanggapanRes.data : []);

      const pelanggaranAnak = lap.length;
      const guruMengajar = gurus.length; 
      const kelasAktif = kelass.filter((k) => Number(k.guruId) > 0).length;
      const tanggapanDiberikan = tanggapans.filter((t) => Number(t.orangTuaId) === Number(user?.id)).length;

      setStats({ pelanggaranAnak, guruMengajar, kelasAktif, tanggapanDiberikan });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setStats({ pelanggaranAnak: 0, guruMengajar: 0, kelasAktif: 0, tanggapanDiberikan: 0 });
    }
  }, [user?.id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const TopMetric = ({ title, value, color }) => (
    <div className="dashboard-card">
      <div className="card-label">{title}</div>
      <div className="card-value" style={{ color }}>
        {value}
      </div>
    </div>
  );

  return (
    <div className="container mt-4 mb-5 pb-4">
      {}
      <div className="dashboard-card mb-4" style={{ background: "var(--bg-card)", borderRadius: "12px", padding: "24px" }}>
        <h2 style={{ color: "var(--text-primary)", marginBottom: "8px", fontSize: "1.75rem", fontWeight: 600 }}>
          Dashboard Orang Tua
        </h2>
        <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.95rem" }}>
          Selamat datang, <strong>{user?.name || "Orang Tua/Wali"}</strong>. Berikut ringkasan perkembangan anak Anda di sekolah.
        </p>
      </div>

      {}
      <div className="dashboard-grid-top mb-4">
        <TopMetric title="Pelanggaran Anak" value={stats.pelanggaranAnak} color="#dc3545" />
        <TopMetric title="Guru Mengajar" value={stats.guruMengajar} color="#007bff" />
        <TopMetric title="Kelas Aktif" value={stats.kelasAktif} color="#28a745" />
        <TopMetric title="Tanggapan Diberikan" value={stats.tanggapanDiberikan} color="#ffc107" />
      </div>

      {}
      <h5 style={{ color: "var(--text-primary)", marginBottom: "16px", fontWeight: 600 }}>
        Akses Cepat
      </h5>
      <div className="dashboard-grid-secondary">
        <div className="dashboard-card">
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>👨‍🏫</div>
          <h5 style={{ color: "var(--text-primary)", marginBottom: "8px" }}>Data Guru</h5>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "16px" }}>
            Lihat daftar guru pembimbing di sekolah
          </p>
          <Link to="/orangtua/data/guru" className="btn btn-outline-secondary btn-sm">
            Lihat Data
          </Link>
        </div>

        <div className="dashboard-card">
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🏫</div>
          <h5 style={{ color: "var(--text-primary)", marginBottom: "8px" }}>Data Kelas</h5>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "16px" }}>
            Informasi kelas anak di sekolah
          </p>
          <Link to="/orangtua/data/kelas" className="btn btn-outline-secondary btn-sm">
            Lihat Data
          </Link>
        </div>

        <div className="dashboard-card">
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⚠️</div>
          <h5 style={{ color: "var(--text-primary)", marginBottom: "8px" }}>Jenis Pelanggaran</h5>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "16px" }}>
            Kenali aturan & pelanggaran yang berlaku
          </p>
          <Link to="/orangtua/data/jenis-pelanggaran" className="btn btn-outline-secondary btn-sm">
            Lihat Data
          </Link>
        </div>

        <div className="dashboard-card">
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>📋</div>
          <h5 style={{ color: "var(--text-primary)", marginBottom: "8px" }}>Laporan Anak Saya</h5>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "16px" }}>
            Lihat laporan pelanggaran & beri tanggapan
          </p>
          <Link to="/orangtua/laporan-anak" className="btn btn-outline-secondary btn-sm">
            Lihat Data
          </Link>
        </div>
      </div>
    </div>
  );
}
