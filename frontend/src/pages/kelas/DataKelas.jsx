import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

export default function KelasList() {
  const [kelasData, setKelasData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/kelas");
      
      setKelasData(res.data.data || res.data || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
      setKelasData([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin hapus data kelas ini?")) return;
    try {
      await api.delete(`/kelas/${id}`);
      setKelasData(kelasData.filter((k) => k.id_kelas !== id));
      toast.success("Data berhasil dihapus!");
    } catch (err) {
      console.error("Gagal hapus data:", err);
      toast.error("Gagal hapus data");
    }
  };

  const filteredData = kelasData.filter((k) => {
    const s = search.toLowerCase();
    return (
      (k.nama_kelas || "").toLowerCase().includes(s) ||
      (k.kelas_kejuruan || "").toLowerCase().includes(s)
    );
  });

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/admin">
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
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <Link className="btn btn-warning" to="/admin/data/kelas/add">
                <i className="fa-solid fa-plus me-2"></i>Tambah Data
              </Link>
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                type="text"
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
                <th style={{width: '180px'}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((k, i) => (
                <tr key={k.id_kelas}>
                  <td className="text-center">{i + 1}</td>
                  <td className="fw-semibold">{k.nama_kelas}</td>
                  <td>{k.kelas_kejuruan || "-"}</td>
                  <td className="text-center">
                    <div className="btn-group" role="group">
                      <Link
                        to={`/admin/data/kelas/${k.id_kelas}`}
                        className="btn btn-outline-primary btn-sm"
                        title="Lihat"
                      >
                        <i className="fa-regular fa-eye"></i>
                      </Link>
                      <Link
                        to={`/admin/data/kelas/edit/${k.id_kelas}`}
                        className="btn btn-outline-warning btn-sm"
                        title="Edit"
                      >
                        <i className="fa-regular fa-pen-to-square"></i>
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(k.id_kelas)}
                        title="Hapus"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
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