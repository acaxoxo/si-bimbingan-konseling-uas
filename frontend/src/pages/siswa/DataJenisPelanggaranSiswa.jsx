import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

export default function DataJenisPelanggaranSiswa() {
  const [pelanggaranData, setPelanggaranData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/jenis-pelanggaran");
      setPelanggaranData(res.data);
    } catch (err) {
      console.error("Gagal ambil data jenis pelanggaran:", err);
    }
  };

  const filteredData = pelanggaranData.filter((p) => {
    const nama = (p.nama_jenis_pelanggaran || p.nama_pelanggaran || "").toLowerCase();
    const kategori = (p.kategori_pelanggaran || p.kategori || "").toLowerCase();
    return nama.includes(search.toLowerCase()) || kategori.includes(search.toLowerCase());
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

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
        {filteredData.length > 0 ? (
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-center">
              <tr>
                <th style={{width: '60px'}}>No</th>
                <th>Nama Pelanggaran</th>
                <th>Kategori</th>
                <th>Poin</th>
                <th>Keterangan</th>
                <th>Tindakan Sekolah</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((p, i) => (
                <tr key={p.id_jenis_pelanggaran}>
                  <td className="text-center">{i + 1}</td>
                  <td className="fw-semibold">{p.nama_jenis_pelanggaran || p.nama_pelanggaran}</td>
                  <td className="text-center">
                    <span className={`badge ${
                      (p.kategori_pelanggaran || p.kategori) === 'Ringan' ? 'bg-success' :
                      (p.kategori_pelanggaran || p.kategori) === 'Sedang' ? 'bg-warning' :
                      'bg-danger'
                    }`}>
                      {p.kategori_pelanggaran || p.kategori}
                    </span>
                  </td>
                  <td className="text-center">{p.poin_pelanggaran ?? p.poin}</td>
                  <td>{p.deskripsi || p.keterangan || "-"}</td>
                  <td>{p.tindakan_sekolah || "-"}</td>
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
