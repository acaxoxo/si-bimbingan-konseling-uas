import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import api from "../../lib/axios";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import { formatAxiosError } from "../../lib/error";

export default function JenisPelanggaranList() {
  const [pelanggaranData, setPelanggaranData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      console.log('[DataJenisPelanggaran] Fetching data...');
      // Add cache-busting to force fresh data from server
      const res = await api.get(`/jenis-pelanggaran?_t=${Date.now()}`);

      console.log('[DataJenisPelanggaran] Raw response:', res.data);
      const dataArray = res.data.data || res.data;
      console.log('[DataJenisPelanggaran] Parsed array:', dataArray);
      console.log('[DataJenisPelanggaran] Received data:', Array.isArray(dataArray) ? dataArray.length : 'NOT AN ARRAY', 'items');
      
      if (Array.isArray(dataArray)) {
        console.log('[DataJenisPelanggaran] First 3 items:', dataArray.slice(0, 3));
        setPelanggaranData(dataArray);
      } else {
        console.error('[DataJenisPelanggaran] Data is not an array!');
        setPelanggaranData([]);
      }
    } catch (err) {
      console.error('[DataJenisPelanggaran] Fetch error:', err);
      setError(formatAxiosError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const onCreated = (e) => {
      console.log('[DataJenisPelanggaran] jenis:created event received', e.detail);
      setCurrentPage(1); // Reset to page 1 to show new item
      fetchData();
    };
    const onUpdated = (e) => {
      console.log('[DataJenisPelanggaran] jenis:updated event received', e.detail);
      fetchData();
    };
    
    window.addEventListener('jenis:created', onCreated);
    window.addEventListener('jenis:updated', onUpdated);
    console.log('[DataJenisPelanggaran] Event listeners registered');

    return () => {
      console.log('[DataJenisPelanggaran] Cleanup: removing event listeners');
      window.removeEventListener('jenis:created', onCreated);
      window.removeEventListener('jenis:updated', onUpdated);
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await api.delete(`/jenis-pelanggaran/${id}`);
      toast.success("Data berhasil dihapus!");
      setPelanggaranData((prev) => prev.filter((p) => p.id_jenis_pelanggaran !== id));
    } catch (err) {
      console.error("Gagal hapus data:", err);
      toast.error(formatAxiosError(err, "Gagal menghapus data"));
    }
  };

  const filteredData = pelanggaranData.filter((p) =>
    p.nama_jenis_pelanggaran?.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = filteredData.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  return (
    <div className="container mt-4 mb-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/admin">
              <i className="fa-solid fa-house me-1"></i>Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Data Jenis Pelanggaran
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="d-flex gap-2">
                <Link className="btn btn-warning" to="/admin/data/jenis-pelanggaran/add">
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
                placeholder="Cari pelanggaran..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {loading ? (
        <Loading label="Memuat data jenis pelanggaran..." />
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
                    <th>Nama Pelanggaran</th>
                    <th>Kategori</th>
                    <th>Poin</th>
                    <th style={{width: '120px'}}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((p, i) => (
                    <tr key={p.id_jenis_pelanggaran}>
                      <td className="text-center">{startIndex + i + 1}</td>
                      <td className="fw-semibold">{p.nama_jenis_pelanggaran}</td>
                      <td>
                        <span className={`badge ${
                          p.kategori_pelanggaran === 'Ringan' ? 'bg-success' :
                          p.kategori_pelanggaran === 'Sedang' ? 'bg-warning' :
                          'bg-danger'
                        }`}>
                          {p.kategori_pelanggaran}
                        </span>
                      </td>
                      <td className="text-center">{p.poin_pelanggaran}</td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          <Link to={`/admin/data/jenis-pelanggaran/${p.id_jenis_pelanggaran}`} className="btn btn-outline-primary btn-sm">
                            <i className="fa-regular fa-eye"></i>
                          </Link>
                          <Link to={`/admin/data/jenis-pelanggaran/edit/${p.id_jenis_pelanggaran}`} className="btn btn-outline-warning btn-sm">
                            <i className="fa-regular fa-pen-to-square"></i>
                          </Link>
                          <button onClick={() => handleDelete(p.id_jenis_pelanggaran)} className="btn btn-outline-danger btn-sm">
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
