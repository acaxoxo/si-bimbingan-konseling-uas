import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/axios";

export default function AddGuru() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama_guru: "",
    nik: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    pendidikan_terakhir: "",
    jurusan: "",
    jabatan: "",
    status_aktif: "Aktif",
    no_telepon: "",
    email_guru: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/guru", form);
      alert("Data guru berhasil disimpan!");
      navigate("/admin/data/guru");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data guru");
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
            <Link to="/admin/data/guru">Data Guru</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Tambah Guru
          </li>
        </ol>
      </nav>

      <hr />

      {/* Tombol Kembali */}
      <div className="d-flex justify-content-between mb-4">
        <Link className="btn btn-sm btn-warning" to="/admin/data/guru">
          Kembali
        </Link>
      </div>

      {/* Form Input */}
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-lg-4">
            <label className="form-label fw-semibold">Nama Guru</label>
            <input
              type="text"
              name="nama_guru"
              value={form.nama_guru}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">NIK</label>
            <input
              type="text"
              name="nik"
              value={form.nik}
              maxLength="16"
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">Tempat Lahir</label>
            <input
              type="text"
              name="tempat_lahir"
              value={form.tempat_lahir}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">Tanggal Lahir</label>
            <input
              type="date"
              name="tanggal_lahir"
              value={form.tanggal_lahir}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">Jenis Kelamin</label>
            <select
              name="jenis_kelamin"
              value={form.jenis_kelamin}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">
              Pendidikan Terakhir
            </label>
            <select
              name="pendidikan_terakhir"
              value={form.pendidikan_terakhir}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Pilih Pendidikan</option>
              <option value="SMA/SMK">SMA/SMK</option>
              <option value="D3">D3</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">Jurusan</label>
            <input
              type="text"
              name="jurusan"
              value={form.jurusan}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">Jabatan</label>
            <input
              type="text"
              name="jabatan"
              value={form.jabatan}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">Status Keaktifan</label>
            <select
              name="status_aktif"
              value={form.status_aktif}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Pilih Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">No. Telepon</label>
            <input
              type="text"
              name="no_telepon"
              value={form.no_telepon}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">E-Mail</label>
            <input
              type="email"
              name="email_guru"
              value={form.email_guru}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              minLength="6"
              placeholder="Minimal 6 karakter"
            />
            <small className="text-muted">Password untuk login guru</small>
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
