import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

export default function TindakanSiswa() {
  const [jenisData, setJenisData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchJenis();
  }, []);

  const fetchJenis = async () => {
    try {
      const res = await api.get("/jenis-pelanggaran");
      setJenisData(res.data || []);
    } catch (err) {
      console.error("Gagal ambil data jenis pelanggaran:", err?.response?.data || err);
      setJenisData([]);
    }
  };

  const filteredData = jenisData.filter((item) => {
    const nama = (item.nama_jenis_pelanggaran || "").toLowerCase();
    const tindakan = (item.tindakan_sekolah || "").toLowerCase();
    return (
      nama.includes(search.toLowerCase()) ||
      tindakan.includes(search.toLowerCase())
    );
  });

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/siswa">
              <i className="fa-solid fa-house me-1"></i>Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Tindakan Sekolah
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
                placeholder="Cari pelanggaran..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
        {filteredData.length > 0 ? (
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-center">
              <tr>
                <th style={{width: '60px'}}>No</th>
                <th>Jenis Pelanggaran</th>
                <th>Kategori</th>
                <th>Poin</th>
                <th>Tindakan Sekolah</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, i) => (
                <tr key={item.id_jenis_pelanggaran}>
                  <td className="text-center">{i + 1}</td>
                  <td className="fw-semibold">{item.nama_jenis_pelanggaran}</td>
                  <td className="text-center">
                    <span className={`badge ${
                      item.kategori_pelanggaran === 'Ringan' ? 'bg-success' :
                      item.kategori_pelanggaran === 'Sedang' ? 'bg-warning' :
                      'bg-danger'
                    }`}>
                      {item.kategori_pelanggaran}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="badge bg-warning">{item.poin_pelanggaran}</span>
                  </td>
                  <td>{item.tindakan_sekolah || "-"}</td>
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
    </div>
  );
}
