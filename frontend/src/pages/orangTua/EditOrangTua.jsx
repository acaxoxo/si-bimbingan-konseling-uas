import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../lib/axios";

export default function EditOrangTua() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nama_ayah: "",
    nama_ibu: "",
    nik_ayah: "",
    nik_ibu: "",
    email_ayah: "",
    email_ibu: "",
    no_telepon_ayah: "",
    no_telepon_ibu: "",
    pekerjaan_ayah: "",
    pekerjaan_ibu: "",
    alamat_ayah: "",
    alamat_ibu: "",
    pendidikan_ayah: "",
    pendidikan_ibu: "",
    penghasilan_ayah: "",
    penghasilan_ibu: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrangTua = async () => {
      try {
        const response = await api.get(`/orang-tua/${id}`);
        const data = response.data;
        setForm({
          nama_ayah: data.nama_ayah || "",
          nama_ibu: data.nama_ibu || "",
          nik_ayah: data.nik_ayah || "",
          nik_ibu: data.nik_ibu || "",
          email_ayah: data.email_ayah || "",
          email_ibu: data.email_ibu || "",
          no_telepon_ayah: data.no_telepon_ayah || "",
          no_telepon_ibu: data.no_telepon_ibu || "",
          pekerjaan_ayah: data.pekerjaan_ayah || "",
          pekerjaan_ibu: data.pekerjaan_ibu || "",
          alamat_ayah: data.alamat_ayah || "",
          alamat_ibu: data.alamat_ibu || "",
          pendidikan_ayah: data.pendidikan_ayah || "",
          pendidikan_ibu: data.pendidikan_ibu || "",
          penghasilan_ayah: data.penghasilan_ayah || "",
          penghasilan_ibu: data.penghasilan_ibu || "",
          password: "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat data:", err);
          toast.error("Gagal memuat data orang tua");
          navigate("/admin/data/orang-tua");
      }
    };

    fetchOrangTua();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const payload = { ...form };
      if (!payload.password) {
        delete payload.password;
      }
      
      await api.put(`/orang-tua/${id}`, payload);
      toast.success("Data orang tua berhasil diperbarui!");
      navigate("/admin/data/orang-tua");
    } catch (err) {
      console.error("Gagal update data:", err);
      toast.error("Gagal memperbarui data");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Memuat data...</p>
        </div>
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
            <Link to="/admin/data/orang-tua">Data Orang Tua</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Edit Data
          </li>
        </ol>
      </nav>

      <hr />

      <div className="d-flex justify-content-between mb-4">
        <Link className="btn btn-sm btn-warning" to="/admin/data/orang-tua">
          Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        {}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0"><i className="fa-solid fa-user me-2"></i>Data Ayah</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-lg-6">
                <label className="form-label fw-semibold">Nama Ayah <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="nama_ayah"
                  className="form-control"
                  value={form.nama_ayah}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-lg-6">
                <label className="form-label fw-semibold">NIK Ayah</label>
                <input
                  type="text"
                  name="nik_ayah"
                  maxLength="16"
                  className="form-control"
                  value={form.nik_ayah}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6">
                <label className="form-label fw-semibold">Email Ayah</label>
                <input
                  type="email"
                  name="email_ayah"
                  className="form-control"
                  value={form.email_ayah}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6">
                <label className="form-label fw-semibold">No. Telepon Ayah</label>
                <input
                  type="text"
                  name="no_telepon_ayah"
                  className="form-control"
                  value={form.no_telepon_ayah}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-12">
                <label className="form-label fw-semibold">Alamat Ayah</label>
                <textarea
                  name="alamat_ayah"
                  className="form-control"
                  rows="2"
                  value={form.alamat_ayah}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-lg-4">
                <label className="form-label fw-semibold">Pendidikan Ayah</label>
                <select
                  name="pendidikan_ayah"
                  className="form-select"
                  value={form.pendidikan_ayah}
                  onChange={handleChange}
                >
                  <option value="">Pilih Pendidikan</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA/SMK">SMA / SMK</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Sarjana">Sarjana (S1)</option>
                  <option value="Magister">Magister (S2)</option>
                  <option value="Doktor">Doktor (S3)</option>
                </select>
              </div>

              <div className="col-lg-4">
                <label className="form-label fw-semibold">Pekerjaan Ayah</label>
                <input
                  type="text"
                  name="pekerjaan_ayah"
                  className="form-control"
                  value={form.pekerjaan_ayah}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-4">
                <label className="form-label fw-semibold">Penghasilan Ayah</label>
                <input
                  type="number"
                  name="penghasilan_ayah"
                  className="form-control"
                  value={form.penghasilan_ayah}
                  onChange={handleChange}
                  placeholder="Contoh: 5000000"
                />
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="card mb-4">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0"><i className="fa-solid fa-user me-2"></i>Data Ibu</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-lg-6">
                <label className="form-label fw-semibold">Nama Ibu <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="nama_ibu"
                  className="form-control"
                  value={form.nama_ibu}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-lg-6">
                <label className="form-label fw-semibold">NIK Ibu</label>
                <input
                  type="text"
                  name="nik_ibu"
                  maxLength="16"
                  className="form-control"
                  value={form.nik_ibu}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6">
                <label className="form-label fw-semibold">Email Ibu</label>
                <input
                  type="email"
                  name="email_ibu"
                  className="form-control"
                  value={form.email_ibu}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6">
                <label className="form-label fw-semibold">No. Telepon Ibu</label>
                <input
                  type="text"
                  name="no_telepon_ibu"
                  className="form-control"
                  value={form.no_telepon_ibu}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-12">
                <label className="form-label fw-semibold">Alamat Ibu</label>
                <textarea
                  name="alamat_ibu"
                  className="form-control"
                  rows="2"
                  value={form.alamat_ibu}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-lg-4">
                <label className="form-label fw-semibold">Pendidikan Ibu</label>
                <select
                  name="pendidikan_ibu"
                  className="form-select"
                  value={form.pendidikan_ibu}
                  onChange={handleChange}
                >
                  <option value="">Pilih Pendidikan</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA/SMK">SMA / SMK</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Sarjana">Sarjana (S1)</option>
                  <option value="Magister">Magister (S2)</option>
                  <option value="Doktor">Doktor (S3)</option>
                </select>
              </div>

              <div className="col-lg-4">
                <label className="form-label fw-semibold">Pekerjaan Ibu</label>
                <input
                  type="text"
                  name="pekerjaan_ibu"
                  className="form-control"
                  value={form.pekerjaan_ibu}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-4">
                <label className="form-label fw-semibold">Penghasilan Ibu</label>
                <input
                  type="number"
                  name="penghasilan_ibu"
                  className="form-control"
                  value={form.penghasilan_ibu}
                  onChange={handleChange}
                  placeholder="Contoh: 3000000"
                />
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">
            <h5 className="mb-0"><i className="fa-solid fa-lock me-2"></i>Akun Login</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-lg-6">
                <label className="form-label fw-semibold">Password Baru (Optional)</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                  minLength="6"
                  placeholder="Kosongkan jika tidak ingin mengubah password"
                />
                <small className="text-muted">Isi hanya jika ingin mengubah password</small>
              </div>
            </div>
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
