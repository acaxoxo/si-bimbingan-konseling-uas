import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../lib/axios";

export default function DetailKelas() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/kelas/${id}`);
        setData(res.data);
      } catch {
        setError("Gagal mengambil detail kelas");
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
            <Link to="/admin/data/kelas">Data Kelas</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Detail Kelas
          </li>
        </ol>
      </nav>
      <hr />
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white fw-bold">
          <i className="fa-solid fa-school me-2"></i>Detail Data Kelas
        </div>
        <div className="card-body">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <th className="w-25">Nama Kelas:</th>
                <td>{data.nama_kelas || "-"}</td>
              </tr>
              <tr>
                <th>Kelas Kejuruan:</th>
                <td>{data.kelas_kejuruan || "-"}</td>
              </tr>
              <tr>
                <th>Nama Wali Kelas:</th>
                <td>{data.guru?.nama_guru || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Link to="/admin/data/kelas" className="btn btn-secondary">Kembali</Link>
    </div>
  );
}
