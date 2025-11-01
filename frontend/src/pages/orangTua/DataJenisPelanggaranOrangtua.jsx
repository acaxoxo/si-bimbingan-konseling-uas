import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

export default function DataJenisPelanggaranOrangtua() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalize = (row) => ({
    id: row?.id_jenis_pelanggaran ?? row?.id ?? row?.id_pelanggaran ?? Math.random(),
    nama: row?.nama_jenis_pelanggaran ?? row?.nama_pelanggaran ?? row?.nama ?? "",
    kategori: row?.kategori_pelanggaran ?? row?.kategori ?? "",
    poin: row?.poin_pelanggaran ?? row?.poin ?? 0,
    deskripsi: row?.deskripsi ?? "",
    tindakan_sekolah: row?.tindakan_sekolah ?? "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/jenis-pelanggaran");
      const list = Array.isArray(res.data) ? res.data.map(normalize) : [];
      setItems(list);
    } catch (err) {
      console.error("Gagal ambil data:", err);
      setError(err?.response?.data?.message || "Gagal memuat data jenis pelanggaran");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const filtered = items.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.nama || "").toLowerCase().includes(q) ||
      (p.kategori || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/orangtua">
              <i className="fa-solid fa-house me-1"></i>Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Jenis Pelanggaran
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center justify-content-end">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Cari nama atau kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-4">Memuat data...</div>
      ) : error ? (
        <div className="alert alert-danger text-center my-3">{error}</div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
          {filtered.length > 0 ? (
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-center">
                <tr>
                  <th style={{width: '60px'}}>No</th>
                  <th>Nama Pelanggaran</th>
                  <th>Kategori</th>
                  <th>Poin</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id}>
                    <td className="text-center">{i + 1}</td>
                    <td className="fw-semibold">{p.nama}</td>
                    <td className="text-center">
                      <span className={`badge ${
                        p.kategori === 'Ringan' ? 'bg-success' :
                        p.kategori === 'Sedang' ? 'bg-warning' :
                        'bg-danger'
                      }`}>
                        {p.kategori}
                      </span>
                    </td>
                    <td className="text-center">{p.poin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="fa-solid fa-inbox fa-3x mb-3 d-block"></i>
              <p>Data tidak ditemukan</p>
            </div>
          )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
