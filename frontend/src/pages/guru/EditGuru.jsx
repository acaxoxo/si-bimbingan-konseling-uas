import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../lib/axios";

export default function EditGuru() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    nama_guru: "",
    nik: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    pendidikan_terakhir: "",
    jurusan: "",
    jabatan: "",
    status_aktif: "",
    no_telepon: "",
    email_guru: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const res = await api.get(`/guru/${id}`);
        const data = res.data;
        setForm({
          nama_guru: data.nama_guru || "",
          nik: data.nik || "",
          tempat_lahir: data.tempat_lahir || "",
          tanggal_lahir: data.tanggal_lahir || "",
          jenis_kelamin: data.jenis_kelamin || "",
          pendidikan_terakhir: data.pendidikan_terakhir || "",
          jurusan: data.jurusan || "",
          jabatan: data.jabatan || "",
          status_aktif: data.status_aktif || "",
          no_telepon: data.no_telepon || "",
          email_guru: data.email_guru || "",
          password: "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Gagal ambil data:", err);
        alert("Gagal memuat data");
        setLoading(false);
      }
    };

    fetchGuru();
  }, [id]);

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
      await api.put(`/guru/${id}`, payload);
      alert("Data guru berhasil diperbarui!");
      navigate("/admin/data/guru");
    } catch (err) {
      console.error("Gagal update:", err);
      alert(`Gagal update data: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/admin">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/admin/data/guru">Data Guru</Link>
          </li>
          <li className="breadcrumb-item active">Edit Data</li>
        </ol>
      </nav>

      <hr />

      <div className="d-flex justify-content-between mb-3">
        <h4 className="fw-semibold">Edit Data Guru</h4>
        <Link className="btn btn-sm btn-warning" to="/admin/data/guru">
          Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="card shadow-sm p-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nama Guru</label>
            <input
              type="text"
              name="nama_guru"
              className="form-control"
              value={form.nama_guru}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">NIK</label>
            <input
              type="text"
              name="nik"
              className="form-control"
              value={form.nik}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Tempat Lahir</label>
            <input
              type="text"
              name="tempat_lahir"
              className="form-control"
              value={form.tempat_lahir}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Tanggal Lahir</label>
            <input
              type="date"
              name="tanggal_lahir"
              className="form-control"
              value={form.tanggal_lahir}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Jenis Kelamin</label>
            <select
              name="jenis_kelamin"
              className="form-select"
              value={form.jenis_kelamin}
              onChange={handleChange}
            >
              <option value="">Pilih</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Pendidikan Terakhir</label>
            <input
              type="text"
              name="pendidikan_terakhir"
              className="form-control"
              value={form.pendidikan_terakhir}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Jurusan</label>
            <input
              type="text"
              name="jurusan"
              className="form-control"
              value={form.jurusan}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Jabatan</label>
            <input
              type="text"
              name="jabatan"
              className="form-control"
              value={form.jabatan}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Status Aktif</label>
            <select
              name="status_aktif"
              className="form-select"
              value={form.status_aktif}
              onChange={handleChange}
            >
              <option value="">Pilih Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">No Telepon</label>
            <input
              type="text"
              name="no_telepon"
              className="form-control"
              value={form.no_telepon}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email_guru"
              className="form-control"
              value={form.email_guru}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Password Baru (opsional)</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              placeholder="Kosongkan jika tidak ingin mengubah"
            />
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-primary">
            <i className="fa-solid fa-save me-2"></i>Update Data
          </button>
        </div>
      </form>
    </div>
  );
}
