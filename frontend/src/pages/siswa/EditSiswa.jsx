import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../lib/axios";

export default function EditSiswa() {
  const navigate = useNavigate();
  const { id } = useParams();

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siswaRes, orangTuaRes, kelasRes] = await Promise.all([
          api.get(`/siswa/${id}`),
          api.get("/orang-tua"),
          api.get("/kelas"),
        ]);

        const siswa = siswaRes.data;
        setForm({
          nama_siswa: siswa.nama_siswa || "",
          nis: siswa.nis || "",
          orangTuaId: siswa.orangTuaId || "",
          jenis_kelamin: siswa.jenis_kelamin || "",
          kelas_id: siswa.kelas_id || "",
          tempat_lahir: siswa.tempat_lahir || "",
          tanggal_lahir: siswa.tanggal_lahir || "",
          alamat: siswa.alamat || "",
          no_telepon: siswa.no_telepon || "",
          email_siswa: siswa.email_siswa || "",
          password: "", 
        });

        // Ensure we're setting arrays, handle different response structures
        const orangTuaArray = Array.isArray(orangTuaRes.data) 
          ? orangTuaRes.data 
          : (orangTuaRes.data?.data || []);
        const kelasArray = Array.isArray(kelasRes.data) 
          ? kelasRes.data 
          : (kelasRes.data?.data || []);

        console.log("[EditSiswa] Orang Tua data:", orangTuaArray);
        console.log("[EditSiswa] Kelas data:", kelasArray);

        setOrangTuaData(orangTuaArray);
        setKelasData(kelasArray);
        setLoading(false);
      } catch (err) {
        console.error("Gagal ambil data:", err);
        alert("Gagal memuat data siswa");
        setLoading(false);
      }
    };

    fetchData();
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

      await api.put(`/siswa/${id}`, payload);
      alert("Data siswa berhasil diperbarui!");
      navigate("/admin/data/siswa");
    } catch (err) {
      console.error("Gagal update data:", err);
      alert("Gagal memperbarui data siswa");
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
            <Link to="/admin/data/siswa">Data Siswa</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Edit Siswa
          </li>
        </ol>
      </nav>

      <hr />

      <div className="d-flex justify-content-between mb-4">
        <Link className="btn btn-sm btn-warning" to="/admin/data/siswa">
          Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-lg-4">
            <label className="form-label fw-semibold">Nama Lengkap Siswa</label>
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
              {Array.isArray(orangTuaData) && orangTuaData.map((orangTua) => (
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
              {Array.isArray(kelasData) && kelasData.map((kelas) => (
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
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">Password Baru (opsional)</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              minLength="6"
              placeholder="Kosongkan jika tidak ingin mengubah"
            />
            <small className="text-muted">Minimal 6 karakter</small>
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-success">
            <i className="fa-solid fa-floppy-disk me-2"></i> Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
