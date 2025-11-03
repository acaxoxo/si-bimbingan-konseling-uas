import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardSiswa() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pelanggaran: 0,
    kelasLabel: "-",
    guruAktif: 0,
    peringatan: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        
        const [pelRes, sisRes, guruRes, tindRes] = await Promise.all([
          api.get("/pelanggaran-siswa"),
          api.get(`/siswa/${user?.id}`),
          api.get("/guru").catch(() => ({ data: { data: [] } })),
          api.get("/tindakan/tindakan").catch(() => ({ data: { data: [] } })),
        ]);

        const pel = pelRes.data?.data || pelRes.data || [];
        const myPelanggaran = pel.filter((p) => p.siswaId === user?.id);
        const siswa = sisRes.data || {};
        const kelas = siswa?.kela || siswa?.kelas || null;
        const kelasLabel = kelas ? `${kelas.nama_kelas ?? ""}${kelas.kelas_kejuruan ? ` ${kelas.kelas_kejuruan}` : ""}` : "-";
        const guru = guruRes.data?.data || guruRes.data || [];
        const guruAktif = (guru || []).filter((g) => g.status_aktif === "Aktif").length || (guru || []).length || 0;

        const tind = tindRes.data?.data || tindRes.data || [];
        
        const tindSiswa = (tind || []).filter((t) => {
          const pel = t?.pelanggaran_siswa || t?.PelanggaranSiswa;
          const siswa = pel?.siswa || pel?.Siswa;
          return siswa?.id_siswa === user?.id || pel?.siswaId === user?.id;
        });
        
        // Hitung total tindakan yang diterima siswa
        const totalTindakan = tindSiswa.length;

        setStats({
          pelanggaran: myPelanggaran.length,
          kelasLabel,
          guruAktif,
          peringatan: totalTindakan,
        });
      } catch {
        setStats({ pelanggaran: 0, kelasLabel: "-", guruAktif: 0, peringatan: 0 });
      }
    };
    if (user?.id) load();
  }, [user]);

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
          Dashboard Siswa
        </h2>
        <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.95rem" }}>
          Selamat datang, <strong>{user?.name || "Siswa"}</strong>. Berikut ringkasan informasi penting untuk Anda.
        </p>
      </div>

      {}
      <div className="dashboard-grid-top mb-4">
        <TopMetric title="Pelanggaran Saya" value={stats.pelanggaran} color="#dc3545" />
        <TopMetric title="Kelas Aktif" value={stats.kelasLabel} color="#28a745" />
        <TopMetric title="Guru Mengajar" value={stats.guruAktif} color="#007bff" />
        <TopMetric title="Total Tindakan" value={stats.peringatan} color="#ffc107" />
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
            Lihat daftar guru pengajar
          </p>
          <Link to="/siswa/data/guru" className="btn btn-outline-secondary btn-sm">
            Lihat Data
          </Link>
        </div>

        <div className="dashboard-card">
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🏫</div>
          <h5 style={{ color: "var(--text-primary)", marginBottom: "8px" }}>Data Kelas</h5>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "16px" }}>
            Informasi tentang kelas Anda
          </p>
          <Link to="/siswa/data/kelas" className="btn btn-outline-secondary btn-sm">
            Lihat Data
          </Link>
        </div>

        <div className="dashboard-card">
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⚠️</div>
          <h5 style={{ color: "var(--text-primary)", marginBottom: "8px" }}>Jenis Pelanggaran</h5>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "16px" }}>
            Daftar kategori pelanggaran
          </p>
          <Link to="/siswa/data/jenis-pelanggaran" className="btn btn-outline-secondary btn-sm">
            Lihat Data
          </Link>
        </div>

        <div className="dashboard-card">
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🛡️</div>
          <h5 style={{ color: "var(--text-primary)", marginBottom: "8px" }}>Tindakan Sekolah</h5>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "16px" }}>
            Lihat tindakan yang diberikan
          </p>
          <Link to="/siswa/tindakan" className="btn btn-outline-secondary btn-sm">
            Lihat Data
          </Link>
        </div>
      </div>
    </div>
  );
}
