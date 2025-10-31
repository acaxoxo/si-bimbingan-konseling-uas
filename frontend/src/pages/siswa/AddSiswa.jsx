import { useState, useEffect } from "react";
import api from "../../lib/axios";

export default function AddSiswa() {
  const [form, setForm] = useState({
    nama_siswa: "",
    nis: "",
    orangTuaId: "",
    jenis_kelamin: "",
    kelas_id: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    alamat: "",
    no_telepon: "",
    email_siswa: "",
    password: "",
  });

  const [orangTuaData, setOrangTuaData] = useState([]);
  const [kelasData, setKelasData] = useState([]);

  useEffect(() => {
    // Backend returns paginated response: { data: [...], pagination: {...} }
    api.get("/orang-tua").then((res) => setOrangTuaData(res.data.data || res.data || []));
    api.get("/kelas").then((res) => setKelasData(res.data.data || res.data || []));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // sanitize phone number to pass backend validation (id-ID)
      const onlyDigits = (form.no_telepon || "").replace(/\D+/g, "");
      let normalizedPhone = onlyDigits;
      if (onlyDigits.startsWith("62")) {
        normalizedPhone = "0" + onlyDigits.slice(2);
      } else if (onlyDigits.startsWith("8")) {
        normalizedPhone = "0" + onlyDigits;
      }

      const payload = {
        ...form,
        orangTuaId: form.orangTuaId ? Number(form.orangTuaId) : null,
        kelas_id: form.kelas_id ? Number(form.kelas_id) : undefined,
        no_telepon: normalizedPhone,
        email_siswa: (form.email_siswa || "").trim(),
        nama_siswa: (form.nama_siswa || "").trim(),
        tempat_lahir: (form.tempat_lahir || "").trim(),
        alamat: (form.alamat || "").trim(),
      };

      await api.post("/siswa", payload);
      alert("Data siswa berhasil disimpan!");
      setForm({
        nama_siswa: "",
        nis: "",
        orangTuaId: "",
        jenis_kelamin: "",
        kelas_id: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        alamat: "",
        no_telepon: "",
        email_siswa: "",
        password: "",
      });
    } catch (err) {
      const server = err.response?.data;
      console.error("Error details:", err);
      console.error("Error response:", server);
      const details = Array.isArray(server?.errors)
        ? "\n- " + server.errors.map((e) => `${e.field}: ${e.message}`).join("\n- ")
        : "";
      const errorMsg = server?.message || err.message || "Gagal menyimpan data siswa";
      alert(`Gagal menyimpan data siswa: ${errorMsg}${details}`);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/admin">
              <i className="fa-solid fa-house me-1"></i>Dashboard
            </a>
          </li>
          <li className="breadcrumb-item">
            <a href="/admin/data/siswa">Data Siswa</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Tambah Siswa
          </li>
        </ol>
      </nav>

      <hr />

      <div className="d-flex justify-content-between mb-4">
        <a className="btn btn-sm btn-warning" href="/admin/data/siswa">
          Kembali
        </a>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-lg-4">
            <label className="form-label fw-semibold">Nama Siswa</label>
            <input
              type="text"
              name="nama_siswa"
              value={form.nama_siswa}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">NIS</label>
            <input
              type="text"
              name="nis"
              value={form.nis}
              maxLength="10"
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">Orang Tua Siswa</label>
            <select
              name="orangTuaId"
              value={form.orangTuaId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Pilih Orang Tua</option>
              {orangTuaData.map((orangTua) => (
                <option key={orangTua.id_orang_tua} value={orangTua.id_orang_tua}>
                  {`${orangTua.nama_ayah || "-"} & ${orangTua.nama_ibu || "-"}`}
                </option>
              ))}
            </select>
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
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">Kelas Siswa</label>
            <select
              name="kelas_id"
              value={form.kelas_id}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Pilih Kelas</option>
              {kelasData.map((kelas) => (
                <option key={kelas.id_kelas} value={kelas.id_kelas}>
                  {kelas.nama_kelas} | {kelas.kelas_kejuruan}
                </option>
              ))}
            </select>
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">Tempat Lahir</label>
            <input
              type="text"
              name="tempat_lahir"
              value={form.tempat_lahir}
              onChange={handleChange}
              className="form-control"
              required
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
              required
            />
          </div>

          <div className="col-lg-12">
            <label className="form-label fw-semibold">Alamat</label>
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="Masukkan alamat lengkap siswa"
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">No. Telepon</label>
            <input
              type="text"
              name="no_telepon"
              value={form.no_telepon}
              onChange={handleChange}
              className="form-control"
                required
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">E-Mail</label>
            <input
              type="email"
              name="email_siswa"
              value={form.email_siswa}
              onChange={handleChange}
              className="form-control"
                required
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
            />
            <small className="text-muted">Minimal 6 karakter (opsional)</small>
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
