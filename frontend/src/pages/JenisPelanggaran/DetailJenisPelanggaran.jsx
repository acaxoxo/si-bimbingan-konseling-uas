import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../lib/axios";

export default function DetailJenisPelanggaran() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/jenis-pelanggaran/${id}`);
        if (!mounted) return;
        console.log("[DetailJenisPelanggaran] API response:", res.data);
        console.log("[DetailJenisPelanggaran] tindakan_sekolah value:", res.data.tindakan_sekolah);
        setData(res.data);
      } catch (err) {
        console.error("[DetailJenisPelanggaran] fetch error:", err);
        setError(err?.response?.data?.message || err.message || "Gagal memuat detail");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    return () => { mounted = false; };
  }, [id]);

  const Badge = ({ children }) => (
    <span className={`badge ${children === 'Ringan' ? 'bg-success' : children === 'Sedang' ? 'bg-warning' : 'bg-danger'}`}>{children}</span>
  );

  return (
    <div className="container mt-5 mb-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
          <li className="breadcrumb-item"><Link to="/admin/data/jenis-pelanggaran">Data Jenis Pelanggaran</Link></li>
          <li className="breadcrumb-item active">Detail</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold m-0">Detail Jenis Pelanggaran</h4>
        <Link className="btn btn-sm btn-warning" to="/admin/data/jenis-pelanggaran">Kembali</Link>
      </div>

      {loading ? (
        <div className="text-center py-5">Memuat detail...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : !data ? (
        <div className="alert alert-warning">Data tidak ditemukan</div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="mb-2"><small className="text-muted">Nama Pelanggaran</small></div>
                <div className="fw-semibold fs-5">{data.nama_jenis_pelanggaran}</div>
              </div>
              <div className="col-md-3">
                <div className="mb-2"><small className="text-muted">Kategori</small></div>
                <div><Badge>{data.kategori_pelanggaran}</Badge></div>
              </div>
              <div className="col-md-3">
                <div className="mb-2"><small className="text-muted">Poin Pelanggaran</small></div>
                <div className="fw-semibold">{data.poin_pelanggaran}</div>
              </div>

              <div className="col-12">
                <hr />
              </div>

              <div className="col-12">
                <div className="mb-2"><small className="text-muted">Deskripsi</small></div>
                <div className="text-break">{data.deskripsi || '-'}</div>
              </div>

              <div className="col-12">
                <div className="mb-2"><small className="text-muted">Tindakan Sekolah</small></div>
                <div className="text-break">{data.tindakan_sekolah || '-'}</div>
              </div>

              <div className="col-12">
                <hr />
              </div>

              <div className="col-md-6">
                <div className="mb-2"><small className="text-muted">Dibuat Oleh</small></div>
                <div>{data.admin ? `${data.admin.nama_admin} (${data.admin.email_admin})` : '-'}</div>
              </div>
              <div className="col-md-6">
                <div className="mb-2"><small className="text-muted">Dibuat Pada</small></div>
                <div>{data.createdAt ? new Date(data.createdAt).toLocaleString() : '-'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
