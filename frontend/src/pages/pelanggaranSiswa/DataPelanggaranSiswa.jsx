import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

export default function PelanggaranSiswaList() {
  const [pelanggaranData, setPelanggaranData] = useState([]);
  const [search, setSearch] = useState("");
  const [kategoriList, setKategoriList] = useState([]);
  const [kategori, setKategori] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/pelanggaran-siswa");
        
        const dataArray = res.data.data || res.data;
        setPelanggaranData(Array.isArray(dataArray) ? dataArray : []);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Terjadi kesalahan. Coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    })();

    (async () => {
      try {
        const res = await api.get("/jenis-pelanggaran");
        const uniqueKategori = Array.from(new Set((res.data || []).map(j => j.kategori_pelanggaran).filter(Boolean)));
        setKategoriList(uniqueKategori);
      } catch { /* empty */ }
    })();
  }, []);

  const toMessage = (err) => err?.response?.data?.message || err?.message || "Terjadi kesalahan. Coba lagi nanti.";

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin hapus data ini?")) return;
    try {
      await api.delete(`/pelanggaran-siswa/${id}`);
      setPelanggaranData(prev => prev.filter(p => p.id_pelanggaran_siswa !== id));
      alert("Data berhasil dihapus!");
    } catch (err) {
      alert(toMessage(err));
    }
  };

  const filteredData = pelanggaranData.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || (
      p.siswa?.nama_siswa?.toLowerCase().includes(q) ||
      p.jenis_pelanggaran?.nama_jenis_pelanggaran?.toLowerCase().includes(q)
    );
    const matchKategori = !kategori || p.jenis_pelanggaran?.kategori_pelanggaran === kategori;
    const matchDate = (() => {
      if (!startDate && !endDate) return true;
      const t = p.tanggal_pelanggaran ? new Date(p.tanggal_pelanggaran) : null;
      if (!t) return false;
      const s = startDate ? new Date(startDate) : null;
      const e = endDate ? new Date(endDate) : null;
      if (s && t < s) return false;
      if (e) {
        const eEnd = new Date(e);
        eEnd.setHours(23, 59, 59, 999);
        if (t > eEnd) return false;
      }
      return true;
    })();
    return matchSearch && matchKategori && matchDate;
  });

  const totalItems = filteredData.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, kategori, startDate, endDate, pageSize]);

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/guru">
              <i className="fa-solid fa-house me-1"></i>Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Data Pelanggaran Siswa
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-auto">
              <Link className="btn btn-warning" to="/guru/data/pelanggaran-siswa/add">
                <i className="fa-solid fa-plus me-2"></i>Tambah Data
              </Link>
            </div>
            
            <div className="col-12 col-md">
              <div className="row g-2">
                <div className="col-12 col-lg-6">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Cari nama siswa atau pelanggaran..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="col-6 col-lg-3">
                  <select
                    className="form-select"
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                  >
                    <option value="">Semua Kategori</option>
                    {kategoriList.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6 col-lg-3">
                  <select
                    className="form-select"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row g-2 mt-2">
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label small mb-1">Tanggal Mulai</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label small mb-1">Tanggal Akhir</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {loading ? (
        <Loading label="Memuat data pelanggaran..." />
      ) : (
        <>
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              {filteredData.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center" style={{width: '60px'}}>No</th>
                        <th>Nama Siswa</th>
                        <th>Jenis Pelanggaran</th>
                        <th>Asal Kelas</th>
                        <th>Orang Tua</th>
                        <th className="text-center" style={{width: '160px'}}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((p, i) => (
                        <tr key={p.id_pelanggaran_siswa}>
                          <td className="text-center">{startIndex + i + 1}</td>
                          <td>
                            <div className="fw-semibold">{p.siswa?.nama_siswa || "-"}</div>
                            <small className="text-muted">NIS: {p.siswa?.nis || "-"}</small>
                          </td>
                          <td>
                            <div>{p.jenis_pelanggaran?.nama_jenis_pelanggaran || "-"}</div>
                            <small className="text-muted">
                              <span className={`badge ${
                                p.jenis_pelanggaran?.kategori_pelanggaran === 'Ringan' ? 'bg-success' :
                                p.jenis_pelanggaran?.kategori_pelanggaran === 'Sedang' ? 'bg-warning' :
                                'bg-danger'
                              }`}>
                                {p.jenis_pelanggaran?.kategori_pelanggaran || "-"}
                              </span>
                              {' '}• {p.jenis_pelanggaran?.poin_pelanggaran || 0} poin
                            </small>
                          </td>
                          <td>
                            <div>{p.siswa?.kela?.nama_kelas || "-"}</div>
                            {p.siswa?.kela?.kelas_kejuruan && (
                              <small className="text-muted">{p.siswa.kela.kelas_kejuruan}</small>
                            )}
                          </td>
                          <td>
                            {p.siswa?.orang_tua ? (
                              <>
                                <div className="small">{p.siswa.orang_tua.nama_ayah}</div>
                                <div className="small text-muted">{p.siswa.orang_tua.nama_ibu}</div>
                              </>
                            ) : "-"}
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm" role="group">
                              <Link
                                to={`/guru/data/pelanggaran-siswa/${p.id_pelanggaran_siswa}`}
                                className="btn btn-outline-primary"
                                title="Lihat"
                              >
                                <i className="fa-regular fa-eye"></i>
                              </Link>
                              <Link
                                to={`/guru/data/pelanggaran-siswa/edit/${p.id_pelanggaran_siswa}`}
                                className="btn btn-outline-warning"
                                title="Edit"
                              >
                                <i className="fa-regular fa-pen-to-square"></i>
                              </Link>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(p.id_pelanggaran_siswa)}
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
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fa-solid fa-inbox fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Data tidak ditemukan</p>
                </div>
              )}
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
