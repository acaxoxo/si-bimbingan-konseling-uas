import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../lib/axios";

export default function EditKelas() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    nama_kelas: "",
    kelas_kejuruan: "",
    guruId: "",
  });
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await api.get(`/kelas/${id}`);
        const data = res.data;
        setForm({
          nama_kelas: data.nama_kelas || "",
          kelas_kejuruan: data.kelas_kejuruan || "",
          guruId: data.guruId || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Gagal ambil data:", err);
          toast.error("Gagal memuat data");
          setLoading(false);
      }
    };

    const fetchGuru = async () => {
      try {
        const res = await api.get("/guru");
        const payload = res?.data;
        const list = Array.isArray(payload) ? payload : payload?.data ?? [];
        setGuruList(list);
      } catch (err) {
        console.error("Gagal ambil data guru:", err);
      }
    };

    fetchKelas();
    fetchGuru();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nama_kelas: form.nama_kelas,
        kelas_kejuruan: form.kelas_kejuruan || null,
        guruId: form.guruId ? parseInt(form.guruId) : null,
      };
      await api.put(`/kelas/${id}`, payload);
      toast.success("Data kelas berhasil diperbarui!");
      navigate("/admin/data/kelas");
    } catch (err) {
      console.error("Gagal update:", err);
      toast.error(`Gagal update data: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <div className="container mt-5 mb-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/admin">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/admin/data/kelas">Data Kelas</Link>
          </li>
          <li className="breadcrumb-item active">Edit Data</li>
        </ol>
      </nav>

      <hr />

      <div className="d-flex justify-content-between mb-3">
        <h4 className="fw-semibold">Edit Data Kelas</h4>
        <Link className="btn btn-sm btn-warning" to="/admin/data/kelas">
          Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Nama Kelas</label>
            <input
              type="text"
              name="nama_kelas"
              className="form-control"
              value={form.nama_kelas}
              onChange={handleChange}
              placeholder="Contoh: X TKJ 1"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Jurusan / Kejuruan</label>
            <input
              type="text"
              name="kelas_kejuruan"
              className="form-control"
              value={form.kelas_kejuruan}
              onChange={handleChange}
              placeholder="Contoh: Teknik Komputer dan Jaringan"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Wali Kelas (opsional)</label>
            <select
              name="guruId"
              className="form-select"
              value={form.guruId}
              onChange={handleChange}
            >
              <option value="">Pilih Wali Kelas</option>
              {guruList.map((guru) => (
                <option key={guru.id_guru} value={guru.id_guru}>
                  {guru.nama_guru}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-success">
            <i className="fa-solid fa-save me-2"></i>Update Data
          </button>
        </div>
      </form>
    </div>
  );
}
