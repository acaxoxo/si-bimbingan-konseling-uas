import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

export default function DataAdmin() {
  const [adminData, setAdminData] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/admin");
      // Backend returns paginated response: { data: [...], pagination: {...} }
      setAdminData(res.data.data || res.data || []);
    } catch (err) {
      console.error("Gagal fetch data admin:", err);
      setAdminData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin hapus data ini?")) return;
    try {
      await api.delete(`/admin/${id}`);
      setAdminData(adminData.filter((a) => a.id_admin !== id));
      alert("Data berhasil dihapus!");
    } catch (err) {
      console.error("Gagal hapus admin:", err);
      alert("Gagal hapus data");
    }
  };

  const filteredData = adminData.filter(
    (a) =>
      a.nama_admin?.toLowerCase().includes(search.toLowerCase()) ||
      a.email_admin?.toLowerCase().includes(search.toLowerCase())
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
            Data Administrator
          </li>
        </ol>
      </nav>

      <hr />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link className="btn btn-sm btn-warning" to="/admin/data/admin/add">
          Tambah Data
        </Link>

        <input
          className="form-control w-25"
          type="text"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive mt-4">
        {filteredData.length > 0 ? (
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-primary text-center">
              <tr>
                <th>No</th>
                <th>Nama Administrator</th>
                <th>Email</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((admin, i) => (
                <tr key={admin.id_admin}>
                  <td className="text-center">{i + 1}</td>
                  <td>{admin.nama_admin}</td>
                  <td>{admin.email_admin}</td>
                  <td className="text-center">
                    <Link
                      to={`/admin/data/admin/edit/${admin.id_admin}`}
                      className="btn btn-light btn-sm"
                      title="Edit"
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </Link>

                    <button
                      className="btn btn-light btn-sm ms-2"
                      title="Hapus"
                      onClick={() => handleDelete(admin.id_admin)}
                    >
                      <i className="fa-solid fa-trash-can text-danger"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-danger rounded mt-3 text-center">
            Data tidak ditemukan{" "}
            <i className="mx-1 fs-5 fa-brands fa-searchengin fa-bounce"></i>
          </div>
        )}
      </div>
    </div>
  );
}
