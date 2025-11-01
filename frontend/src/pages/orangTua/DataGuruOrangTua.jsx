import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

export default function DataGuruOrangTua() {
  const [guruData, setGuruData] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/guru");
      
      const dataArray = res.data?.data || res.data || [];
      setGuruData(Array.isArray(dataArray) ? dataArray : []);
    } catch (err) {
      console.error("Gagal ambil data guru:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = guruData.filter(
    (guru) =>
      guru.nama_guru.toLowerCase().includes(search.toLowerCase()) ||
      guru.nik?.toLowerCase().includes(search.toLowerCase())
  );

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
            Data Guru BK
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
                placeholder="Cari nama atau NIK..."
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
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light text-center">
            <tr>
            <th style={{width: '60px'}}>No</th>
            <th>Nama Guru</th>
            <th>NIK</th>
            <th>Pendidikan Terakhir</th>
            <th>Jabatan</th>
            <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((guru, i) => (
                <tr key={guru.id_guru}>
                  <td className="text-center">{i + 1}</td>
                  <td className="fw-semibold">{guru.nama_guru}</td>
                  <td>{guru.nik}</td>
                  <td>{guru.pendidikan_terakhir}</td>
                  <td>{guru.jabatan}</td>
                  <td className="text-center">
                    <span
                      className={`badge ${
                        guru.status_aktif === "Aktif"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {guru.status_aktif}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5 text-muted">
                  <i className="fa-solid fa-inbox fa-3x mb-3 d-block"></i>
                  <p className="mb-0">Data tidak ditemukan</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
          </div>
        </div>
      </div>
    </div>
  );
}