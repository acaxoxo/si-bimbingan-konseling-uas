import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import api from "../../lib/axios";

export default function DetailSiswa() {
  const { id } = useParams();
  const [siswa, setSiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiswaDetail = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/siswa/${id}`);
        setSiswa(res.data);
      } catch (err) {
        console.error("Gagal fetch detail siswa:", err);
        toast.error("Gagal memuat data siswa");
      } finally {
        setLoading(false);
      }
    };

    fetchSiswaDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!siswa) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Data siswa tidak ditemukan</div>
        <Link to="/admin/data/siswa" className="btn btn-secondary">
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/admin">
              <i className="fa-solid fa-house me-1"></i>Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/admin/data/siswa">Data Siswa</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Detail Siswa
          </li>
        </ol>
      </nav>

      <hr />

      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            <i className="fa-solid fa-user-graduate me-2"></i>
            Detail Data Siswa
          </h5>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="fw-bold text-muted small">Nama Siswa:</label>
                <p className="mb-0">{siswa.nama_siswa}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="fw-bold text-muted small">NIS:</label>
                <p className="mb-0">{siswa.nis}</p>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="fw-bold text-muted small">Jenis Kelamin:</label>
                <p className="mb-0">{siswa.jenis_kelamin}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="fw-bold text-muted small">Kelas:</label>
                <p className="mb-0">{siswa.kela?.nama_kelas || "-"}</p>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="fw-bold text-muted small">Tempat Lahir:</label>
                <p className="mb-0">{siswa.tempat_lahir}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="fw-bold text-muted small">Tanggal Lahir:</label>
                <p className="mb-0">{siswa.tanggal_lahir}</p>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="fw-bold text-muted small">Alamat:</label>
                <p className="mb-0">{siswa.alamat || "-"}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="fw-bold text-muted small">No. Telepon:</label>
                <p className="mb-0">{siswa.no_telepon || "-"}</p>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="fw-bold text-muted small">Email:</label>
                <p className="mb-0">{siswa.email_siswa || "-"}</p>
              </div>
            </div>
          </div>

          <hr />

          <h6 className="fw-bold text-primary mb-3">Informasi Orang Tua / Wali</h6>

          {siswa.orang_tua ? (
            <>
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="fw-bold text-muted small">Nama Ayah:</label>
                    <p className="mb-0">{siswa.orang_tua.nama_ayah || "-"}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="fw-bold text-muted small">Nama Ibu:</label>
                    <p className="mb-0">{siswa.orang_tua.nama_ibu || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="fw-bold text-muted small">Pekerjaan Ayah:</label>
                    <p className="mb-0">{siswa.orang_tua.pekerjaan_ayah || "-"}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="fw-bold text-muted small">Pekerjaan Ibu:</label>
                    <p className="mb-0">{siswa.orang_tua.pekerjaan_ibu || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="fw-bold text-muted small">No. Telepon Ayah:</label>
                    <p className="mb-0">{siswa.orang_tua.no_telepon_ayah || "-"}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="fw-bold text-muted small">No. Telepon Ibu:</label>
                    <p className="mb-0">{siswa.orang_tua.no_telepon_ibu || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="fw-bold text-muted small">Email Ayah:</label>
                    <p className="mb-0">{siswa.orang_tua.email_ayah || "-"}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="fw-bold text-muted small">Email Ibu:</label>
                    <p className="mb-0">{siswa.orang_tua.email_ibu || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="fw-bold text-muted small">Alamat Ayah:</label>
                    <p className="mb-0">{siswa.orang_tua.alamat_ayah || "-"}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="fw-bold text-muted small">Alamat Ibu:</label>
                    <p className="mb-0">{siswa.orang_tua.alamat_ibu || "-"}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="alert alert-info">
              Data orang tua / wali belum tersedia
            </div>
          )}
        </div>
        <div className="card-footer bg-light">
          <Link to="/admin/data/siswa" className="btn btn-secondary">
            <i className="fa-solid fa-arrow-left me-2"></i>
            Kembali
          </Link>
          <Link
            to={`/admin/data/siswa/edit/${siswa.id_siswa}`}
            className="btn btn-primary ms-2"
          >
            <i className="fa-solid fa-edit me-2"></i>
            Edit Data
          </Link>
        </div>
      </div>
    </div>
  );
}
