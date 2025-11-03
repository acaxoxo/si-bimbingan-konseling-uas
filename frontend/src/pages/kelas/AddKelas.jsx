import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/axios";

export default function AddKelas() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama_kelas: "",
    kelas_kejuruan: "",
    guruId: "",
  });

  const [guruList, setGuruList] = useState([]);

  useEffect(() => {
    
    api
      .get("/guru")
      .then((res) => {
        // API returns a paginated object { data: [...], pagination: {...} }
        // but some endpoints might return the array directly. Normalize to an array.
        const payload = res?.data;
        const list = Array.isArray(payload)
          ? payload
          : payload?.data ?? [];
        setGuruList(list);
      })
      .catch(() => setGuruList([]));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const payload = {
        nama_kelas: form.nama_kelas,
        kelas_kejuruan: form.kelas_kejuruan || null,
        guruId: form.guruId ? Number(form.guruId) : null,
      };
      await api.post("/kelas", payload);
      alert("Data kelas berhasil disimpan!");
      navigate("/admin/data/kelas");
    } catch (err) {
      console.error("Gagal tambah data:", err);
      alert("Gagal menyimpan data");
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
            <Link to="/admin/data/kelas">Data Kelas</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Tambah Kelas
          </li>
        </ol>
      </nav>

      <hr />

      <div className="d-flex justify-content-between mb-4">
        <Link className="btn btn-sm btn-warning" to="/admin/data/kelas">
          Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-lg-4">
            <label className="form-label fw-semibold">Nama Kelas</label>
            <input
              type="text"
              name="nama_kelas"
              className="form-control"
              placeholder="Contoh: XII TKJ 1"
              value={form.nama_kelas}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">Kelas Kejuruan</label>
            <input
              type="text"
              name="kelas_kejuruan"
              className="form-control"
              placeholder="Contoh: Teknik Komputer dan Jaringan"
              value={form.kelas_kejuruan}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">Wali Kelas (opsional)</label>
            <select
              name="guruId"
              className="form-select"
              value={form.guruId}
              onChange={handleChange}
            >
              <option value="">Pilih Guru</option>
              {guruList.map((g) => (
                <option key={g.id_guru} value={g.id_guru}>
                  {g.nama_guru}
                </option>
              ))}
            </select>
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
