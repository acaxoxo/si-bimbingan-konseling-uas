import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import api from "../../lib/axios";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

export default function OrangTuaList() {
  const [orangTuaData, setOrangTuaData] = useState([]);
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
        const res = await api.get("/orang-tua");
        
        const dataArray = res.data.data || res.data;
        setOrangTuaData(Array.isArray(dataArray) ? dataArray : []);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Terjadi kesalahan. Coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin hapus data ini?")) return;
    try {
      await api.delete(`/orang-tua/${id}`);
      setOrangTuaData(orangTuaData.filter((o) => o.id_orang_tua !== id));
      toast.success("Data berhasil dihapus!");
    } catch (err) {
      console.error("Gagal hapus data:", err);
      toast.error(err?.response?.data?.message || err?.message || "Gagal hapus data");
    }
  };

  const filteredData = orangTuaData.filter((o) =>
    o.nama_ayah?.toLowerCase().includes(search.toLowerCase()) ||
    o.nama_ibu?.toLowerCase().includes(search.toLowerCase()) ||
    o.email_ayah?.toLowerCase().includes(search.toLowerCase()) ||
    o.email_ibu?.toLowerCase().includes(search.toLowerCase())
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
            Data Orang Tua
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="d-flex gap-2">
                <Link className="btn btn-warning" to="/admin/data/orang-tua/add">
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
                className="form-control"
                type="text"
                placeholder="Cari nama orang tua atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {loading ? (
        <Loading label="Memuat data orang tua..." />
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
                      <th>Nama Ayah</th>
                      <th>Nama Ibu</th>
                      <th>NIK Ayah</th>
                      <th>NIK Ibu</th>
                      <th>No. Telepon Ayah</th>
                      <th>No. Telepon Ibu</th>
                      <th>Email Ayah</th>
                      <th>Email Ibu</th>
                      <th style={{width: '180px'}}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                  {paginatedData.map((o, i) => (
                      <tr key={o.id_orang_tua}>
                      <td className="text-center">{startIndex + i + 1}</td>
                        <td>{o.nama_ayah || "-"}</td>
                        <td>{o.nama_ibu || "-"}</td>
                        <td>{o.nik_ayah || "-"}</td>
                        <td>{o.nik_ibu || "-"}</td>
                        <td>{o.no_telepon_ayah || "-"}</td>
                        <td>{o.no_telepon_ibu || "-"}</td>
                        <td>{o.email_ayah || "-"}</td>
                        <td>{o.email_ibu || "-"}</td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          <Link
                            to={`/admin/data/orang-tua/${o.id_orang_tua}`}
                            className="btn btn-outline-primary btn-sm"
                            title="Lihat"
                          >
                            <i className="fa-regular fa-eye"></i>
                          </Link>
                          <Link
                            to={`/admin/data/orang-tua/edit/${o.id_orang_tua}`}
                            className="btn btn-outline-warning btn-sm"
                            title="Edit"
                          >
                            <i className="fa-regular fa-pen-to-square"></i>
                          </Link>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            title="Hapus"
                            onClick={() => handleDelete(o.id_orang_tua)}
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
