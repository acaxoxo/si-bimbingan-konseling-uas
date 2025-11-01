import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

export default function DataGuruSiswa() {
  const [guruData, setGuruData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/guru");
      
      const dataArray = res.data?.data || res.data || [];
      setGuruData(Array.isArray(dataArray) ? dataArray : []);
    } catch (err) {
      console.error("Gagal ambil data guru:", err);
    }
  };

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
            <Link to="/siswa">
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
        {filteredData.length > 0 ? (
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
              {filteredData.map((guru, i) => (
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
            }
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
