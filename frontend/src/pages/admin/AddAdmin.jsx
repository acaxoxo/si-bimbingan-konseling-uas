import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/axios";

export default function AddAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama_admin: "",
    email_admin: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin", form);
      alert("Data administrator berhasil disimpan!");
      navigate("/admin/data/admin");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data administrator");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/admin">
              <i className="fa-solid fa-house me-1"></i>Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/admin/data/admin">Data Administrator</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Tambah Administrator
          </li>
        </ol>
      </nav>

      <hr />

      {/* Tombol Kembali */}
      <div className="d-flex justify-content-between mb-4">
        <Link className="btn btn-sm btn-warning" to="/admin/data/admin">
          Kembali
        </Link>
      </div>

      {/* Form Input */}
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-lg-6">
            <label className="form-label fw-semibold">Nama Administrator</label>
            <input
              type="text"
              name="nama_admin"
              value={form.nama_admin}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-lg-6">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email_admin"
              value={form.email_admin}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-lg-6">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              required
              minLength="6"
            />
            <small className="text-muted">Minimal 6 karakter</small>
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-success">
            <i className="fa-solid fa-floppy-disk me-2"></i> Simpan Data
          </button>
        </div>
      </form>
    </div>
  );
}
