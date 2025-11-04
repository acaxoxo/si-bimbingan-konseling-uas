import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import api from "../../lib/axios";

export default function DetailPelanggaranSiswa() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/pelanggaran-siswa/${id}`);
        console.log("Detail data:", res.data);
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal ambil data:", err);
        toast.error("Gagal memuat data");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  if (!data) {
    return <div className="container mt-5 text-center">Data tidak ditemukan</div>;
  }

  return (
    <div className="container mt-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/guru">
              <i className="fa-solid fa-house me-1"></i>Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/guru/data/pelanggaran-siswa">
              Data Pelanggaran Siswa
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Detail Data
          </li>
        </ol>
      </nav>

      <hr />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold mb-0">
          <i className="fa-solid fa-eye text-info me-2"></i>
          Detail Pelanggaran Siswa
        </h4>
        <Link
          className="btn btn-sm btn-warning"
          to="/guru/data/pelanggaran-siswa"
        >
          <i className="fa-solid fa-arrow-left me-1"></i> Kembali
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Informasi Pelanggaran</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th width="40%">Nama Siswa</th>
                    <td>: {data.siswa?.nama_siswa || "-"}</td>
                  </tr>
                  <tr>
                    <th>NIS</th>
                    <td>: {data.siswa?.nis || "-"}</td>
                  </tr>
                  <tr>
                    <th>Kelas</th>
                    <td>: {data.siswa?.kela?.nama_kelas || "-"} {data.siswa?.kela?.kelas_kejuruan || ""}</td>
                  </tr>
                  <tr>
                    <th>Orang Tua</th>
                    <td>
                      : {data.siswa?.orang_tua ? 
                        `${data.siswa.orang_tua.nama_ayah} & ${data.siswa.orang_tua.nama_ibu}` 
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th width="40%">Jenis Pelanggaran</th>
                    <td>: {data.jenis_pelanggaran?.nama_jenis_pelanggaran || "-"}</td>
                  </tr>
                  <tr>
                    <th>Kategori</th>
                    <td>
                      : <span className={`badge bg-${
                        data.jenis_pelanggaran?.kategori_pelanggaran === "Ringan" 
                          ? "success" 
                          : data.jenis_pelanggaran?.kategori_pelanggaran === "Sedang" 
                          ? "warning" 
                          : "danger"
                      }`}>
                        {data.jenis_pelanggaran?.kategori_pelanggaran || "-"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Poin Pelanggaran</th>
                    <td>: {data.jenis_pelanggaran?.poin_pelanggaran || 0} poin</td>
                  </tr>
                  <tr>
                    <th>Tanggal Pelanggaran</th>
                    <td>: {new Date(data.tanggal_pelanggaran).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long', 
                      year: 'numeric'
                    })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col-12">
              <h6 className="text-primary fw-semibold mb-3">Detail Konseling</h6>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th width="20%">Status Konseling</th>
                    <td>
                      : <span className={`badge bg-${
                        data.status_konseling === "Selesai" 
                          ? "success" 
                          : data.status_konseling === "Sedang" 
                          ? "warning" 
                          : "secondary"
                      }`}>
                        {data.status_konseling || "-"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Guru Pelapor</th>
                    <td>: {data.guru?.nama_guru || "-"}</td>
                  </tr>
                  <tr>
                    <th>Catatan Konseling</th>
                    <td>: {data.catatan_konseling || "-"}</td>
                  </tr>
                  <tr>
                    <th>Tindak Lanjut</th>
                    <td>: {data.tindak_lanjut || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="card-footer text-end">
          <Link
            to={`/guru/data/pelanggaran-siswa/edit/${id}`}
            className="btn btn-primary btn-sm"
          >
            <i className="fa-solid fa-pen-to-square me-2"></i>
            Edit Data
          </Link>
        </div>
      </div>
    </div>
  );
}
