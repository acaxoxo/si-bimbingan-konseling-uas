import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

export default function DataKelasSiswa() {
  const [kelasData, setKelasData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      
      const res = await api.get("/kelas/with-guru");
      setKelasData(res.data);
    } catch (err) {
      console.error("Gagal ambil data kelas:", err);
    }
  };

  const filteredData = kelasData.filter(
    (k) =>
      k.nama_kelas.toLowerCase().includes(search.toLowerCase()) ||
      k.kelas_kejuruan.toLowerCase().includes(search.toLowerCase())
  );

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
            Data Kelas
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
                placeholder="Cari nama kelas..."
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
                <th>Nama Kelas</th>
                <th>Kejuruan</th>
                <th>Wali Kelas</th>
                <th>Jumlah Siswa</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((k, i) => (
                <tr key={k.id_kelas}>
                  <td className="text-center">{i + 1}</td>
                  <td className="fw-semibold">{k.nama_kelas}</td>
                  <td>{k.kelas_kejuruan}</td>
                  <td>{k.guru?.nama_guru || "Belum ditentukan"}</td>
                  <td className="text-center">{k.jumlah_siswa ?? "-"}</td>
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
