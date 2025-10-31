import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../lib/axios";

export default function DetailTanggapan() {
  const { id } = useParams();
  const [tanggapan, setTanggapan] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/tanggapan/${id}`);
      setTanggapan(res.data);
    } catch (err) {
      console.error("Gagal ambil detail tanggapan:", err);
    }
  };

  if (!tanggapan) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Memuat data tanggapan...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/guru">
              <i className="fa-solid fa-house me-1"></i>Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/guru/tanggapan">Data Tanggapan</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Detail
          </li>
        </ol>
      </nav>

      <hr />

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="card-title fw-semibold mb-3">Detail Tanggapan</h5>
          <p>
            <strong>Nama Siswa:</strong> {tanggapan.nama_siswa}
          </p>
          <p>
            <strong>Orang Tua:</strong> {tanggapan.nama_orang_tua}
          </p>
          <p>
            <strong>Tanggal:</strong> {tanggapan.tanggal}
          </p>
          <p>
            <strong>Status:</strong> {tanggapan.status}
          </p>
          <p className="mt-3">
            <strong>Isi Tanggapan:</strong>
          </p>
          <div className="p-3 border rounded bg-light">
            {tanggapan.isi_tanggapan}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link to="/guru/tanggapan" className="btn btn-warning">
          <i className="fa-solid fa-arrow-left me-2"></i>Kembali
        </Link>
      </div>
    </div>
  );
}
