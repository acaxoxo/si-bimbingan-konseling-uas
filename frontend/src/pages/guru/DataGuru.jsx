import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import { formatAxiosError } from "../../lib/error";

export default function GuruList() {
  const [guruData, setGuruData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/guru");
        // Backend returns paginated response: { data: [...], pagination: {...} }
        const dataArray = res.data.data || res.data;
        setGuruData(Array.isArray(dataArray) ? dataArray : []);
      } catch (err) {
        setError(formatAxiosError(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      try {
        await api.delete(`/guru/${id}`);
        alert("Data guru berhasil dihapus!");
        setGuruData((prev) => prev.filter((g) => g.id_guru !== id));
      } catch (err) {
        console.error("Gagal hapus data:", err);
        alert(formatAxiosError(err, "Gagal menghapus data"));
      }
    }
  };

  const filteredData = guruData.filter(
    (guru) =>
      guru.nama_guru.toLowerCase().includes(search.toLowerCase()) ||
      guru.nik?.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = filteredData.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

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
            Data Guru
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="d-flex gap-2">
                <Link className="btn btn-warning" to="/admin/data/guru/add">
                  <i className="fa-solid fa-plus me-2"></i>Tambah Data
                </Link>
                <select className="form-select" style={{ width: 120 }} value={pageSize} onChange={(e)=> setPageSize(Number(e.target.value))}>
                  <option value={10}>10 / halaman</option>
                  <option value={20}>20 / halaman</option>
                  <option value={50}>50 / halaman</option>
                  <option value={100}>100 / halaman</option>
                </select>
              </div>
            </div>
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

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {loading ? (
        <Loading label="Memuat data guru..." />
      ) : (
        <>

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
                <th style={{width: '120px'}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((guru, i) => (
                <tr key={guru.id_guru}>
                  <td className="text-center">{startIndex + i + 1}</td>
                  <td>
                    <div className="fw-semibold">{guru.nama_guru}</div>
                    <small className="text-muted">{guru.nik}</small>
                  </td>
                  <td>{guru.nik}</td>
                  <td>{guru.pendidikan_terakhir}</td>
                  <td>{guru.jabatan}</td>
                  <td className="text-center">
                    <span
                      className={`badge ${
                        guru.status_aktif === "Aktif" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {guru.status_aktif}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="btn-group" role="group">
                      <Link
                        to={`/admin/data/guru/edit/${guru.id_guru}`}
                        className="btn btn-outline-warning btn-sm"
                        title="Edit"
                      >
                        <i className="fa-regular fa-pen-to-square"></i>
                      </Link>
                      <button
                        onClick={() => handleDelete(guru.id_guru)}
                        className="btn btn-outline-danger btn-sm"
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

      {filteredData.length > 0 && (
        <div className="card shadow-sm border-0 mt-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted small">
                Menampilkan {Math.min(totalItems, startIndex + 1)} - {Math.min(totalItems, startIndex + paginatedData.length)} dari {totalItems} data
              </div>
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
