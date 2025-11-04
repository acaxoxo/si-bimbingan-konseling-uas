import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

export default function SiswaList() {
  const [siswaData, setSiswaData] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/siswa");
      
      setSiswaData(res.data.data || []);
    } catch (err) {
      console.error("Gagal fetch data siswa:", err);
      setSiswaData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin hapus data ini?")) return;
    try {
      await api.delete(`/siswa/${id}`);
      setSiswaData(siswaData.filter((s) => s.id_siswa !== id));
      toast.success("Data berhasil dihapus!");
    } catch (err) {
      console.error("Gagal hapus siswa:", err);
      toast.error("Gagal hapus data");
    }
  };

  const filteredData = siswaData.filter(
    (s) =>
      s.nama_siswa.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.toLowerCase().includes(search.toLowerCase())
  );

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
            Data Siswa
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <Link className="btn btn-warning" to="/admin/data/siswa/add">
                <i className="fa-solid fa-plus me-2"></i>Tambah Data
              </Link>
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                type="text"
                placeholder="Cari nama atau NIS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
        {filteredData.length > 0 ? (
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-center">
              <tr>
                <th style={{width: '60px'}}>No</th>
                <th>Nama Siswa</th>
                <th>NIS</th>
                <th>Orang Tua</th>
                <th>Jenis Kelamin</th>
                <th>Kelas</th>
                <th>Tempat Lahir</th>
                <th>Tanggal Lahir</th>
                <th>No. Telepon</th>
                <th>Email</th>
                <th style={{width: '180px'}}>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((siswa, i) => (
                <tr key={siswa.id_siswa}>
                  <td className="text-center">{i + 1}</td>
                  <td>
                    <div className="fw-semibold">{siswa.nama_siswa}</div>
                    <small className="text-muted">{siswa.nis}</small>
                  </td>
                  <td>{siswa.nis}</td>
                  <td>
                    {siswa.orang_tua 
                      ? <div>
                          <div><i className="fa-solid fa-mars me-1 text-primary"></i>{siswa.orang_tua.nama_ayah || "-"}</div>
                          <div><i className="fa-solid fa-venus me-1 text-danger"></i>{siswa.orang_tua.nama_ibu || "-"}</div>
                        </div>
                      : "-"}
                  </td>
                  <td>{siswa.jenis_kelamin}</td>
                  <td>{siswa.kela?.nama_kelas || "-"}</td>
                  <td>{siswa.tempat_lahir}</td>
                  <td>{siswa.tanggal_lahir}</td>
                  <td>{siswa.no_telepon || "-"}</td>
                  <td>{siswa.email_siswa || "-"}</td>
                  <td className="text-center">
                    <div className="btn-group" role="group">
                      <Link
                        to={`/admin/data/siswa/${siswa.id_siswa}`}
                        className="btn btn-outline-primary btn-sm"
                        title="Lihat Detail"
                      >
                        <i className="fa-regular fa-eye"></i>
                      </Link>

                      <Link
                        to={`/admin/data/siswa/edit/${siswa.id_siswa}`}
                        className="btn btn-outline-warning btn-sm"
                        title="Edit"
                      >
                        <i className="fa-regular fa-pen-to-square"></i>
                      </Link>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Hapus"
                        onClick={() => handleDelete(siswa.id_siswa)}
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
    </div>
  );
}
