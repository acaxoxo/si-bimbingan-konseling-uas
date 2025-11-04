import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../lib/axios";

export default function EditAdmin() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nama_admin: "",
    email_admin: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await api.get(`/admin/${id}`);
        setForm({
          nama_admin: res.data.nama_admin || "",
          email_admin: res.data.email_admin || "",
          password: "", 
        });
        setLoading(false);
      } catch (err) {
        console.error("Gagal load data admin:", err);
        toast.error("Gagal memuat data administrator");
        navigate("/admin/data/admin");
      }
    };
    fetchAdmin();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const payload = { ...form };
      if (!payload.password) {
        delete payload.password;
      }
      
      await api.put(`/admin/${id}`, payload);
      toast.success("Data administrator berhasil diperbarui!");
      navigate("/admin/data/admin");
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui data administrator");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Loading...</p>
      </div>
    );
  }

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
            Edit Administrator
          </li>
        </ol>
      </nav>

      <hr />

      {}
      <div className="d-flex justify-content-between mb-4">
        <Link className="btn btn-sm btn-warning" to="/admin/data/admin">
          Kembali
        </Link>
      </div>

      {}
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
              placeholder="Kosongkan jika tidak ingin mengubah password"
              minLength="6"
            />
            <small className="text-muted">
              Minimal 6 karakter. Kosongkan jika tidak ingin mengubah password
            </small>
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-success">
            <i className="fa-solid fa-floppy-disk me-2"></i> Update Data
          </button>
        </div>
      </form>
    </div>
  );
}
