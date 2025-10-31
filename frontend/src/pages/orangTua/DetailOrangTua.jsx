import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../lib/axios";

export default function DetailOrangTua() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/orang-tua/${id}`);
        setData(res.data);
      } catch {
        setError("Gagal mengambil detail orang tua");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;
  if (!data) return <div className="container mt-4">Data tidak ditemukan</div>;

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
            <Link to="/admin/data/orang-tua">Data Orang Tua</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Detail Orang Tua
          </li>
        </ol>
      </nav>
      <hr />
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white fw-bold">
          <i className="fa-solid fa-users me-2"></i>Detail Data Orang Tua
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <th className="w-50">Nama Ayah:</th>
                    <td>{data.nama_ayah || "-"}</td>
                  </tr>
                  <tr>
                    <th>Pekerjaan Ayah:</th>
                    <td>{data.pekerjaan_ayah || "-"}</td>
                  </tr>
                  <tr>
                    <th>NIK Ayah:</th>
                    <td>{data.nik_ayah || "-"}</td>
                  </tr>
                  <tr>
                    <th>No. Telepon Ayah:</th>
                    <td>{data.no_telepon_ayah || "-"}</td>
                  </tr>
                  <tr>
                    <th>Email Ayah:</th>
                    <td>{data.email_ayah || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <th className="w-50">Nama Ibu:</th>
                    <td>{data.nama_ibu || "-"}</td>
                  </tr>
                  <tr>
                    <th>Pekerjaan Ibu:</th>
                    <td>{data.pekerjaan_ibu || "-"}</td>
                  </tr>
                  <tr>
                    <th>NIK Ibu:</th>
                    <td>{data.nik_ibu || "-"}</td>
                  </tr>
                  <tr>
                    <th>No. Telepon Ibu:</th>
                    <td>{data.no_telepon_ibu || "-"}</td>
                  </tr>
                  <tr>
                    <th>Email Ibu:</th>
                    <td>{data.email_ibu || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Link to="/admin/data/orang-tua" className="btn btn-secondary">Kembali</Link>
    </div>
  );
}
