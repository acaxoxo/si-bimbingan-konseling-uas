import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../lib/axios";

export default function EditJenisPelanggaran() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    nama_jenis_pelanggaran: "",
    kategori_pelanggaran: "",
    deskripsi: "",
    tindakan_sekolah: "",
    poin_pelanggaran: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/jenis-pelanggaran/${id}`);
        const data = res.data;
        setForm({
          nama_jenis_pelanggaran: data.nama_jenis_pelanggaran || "",
          kategori_pelanggaran: data.kategori_pelanggaran || "",
          deskripsi: data.deskripsi || "",
          tindakan_sekolah: data.tindakan_sekolah || "",
          poin_pelanggaran: data.poin_pelanggaran || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Gagal ambil data:", err);
        alert("Gagal memuat data");
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
      const payload = {
        ...form,
        poin_pelanggaran: parseInt(form.poin_pelanggaran),
      };
      await api.put(`/jenis-pelanggaran/${id}`, payload);
      alert("Data jenis pelanggaran berhasil diperbarui!");
      navigate("/admin/data/jenis-pelanggaran");
    } catch (err) {
      console.error("Gagal update:", err);
      alert(`Gagal update data: ${err.response?.data?.message || err.message}`);
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
            <Link to="/admin/data/jenis-pelanggaran">Data Jenis Pelanggaran</Link>
          </li>
          <li className="breadcrumb-item active">Edit Data</li>
        </ol>
      </nav>

      <hr />

      <div className="d-flex justify-content-between mb-3">
        <h4 className="fw-semibold">Edit Jenis Pelanggaran</h4>
        <Link className="btn btn-sm btn-warning" to="/admin/data/jenis-pelanggaran">
          Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-lg-4">
            <label className="form-label fw-semibold">Nama Pelanggaran</label>
            <input
              type="text"
              name="nama_jenis_pelanggaran"
              className="form-control"
              value={form.nama_jenis_pelanggaran}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">Kategori</label>
            <select
              name="kategori_pelanggaran"
              className="form-select"
              value={form.kategori_pelanggaran}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Kategori</option>
              <option value="Ringan">Ringan</option>
              <option value="Sedang">Sedang</option>
              <option value="Berat">Berat</option>
            </select>
          </div>

          <div className="col-lg-4">
            <label className="form-label fw-semibold">Poin Pelanggaran</label>
            <input
              type="number"
              name="poin_pelanggaran"
              className="form-control"
              min="1"
              value={form.poin_pelanggaran}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Deskripsi</label>
            <textarea
              name="deskripsi"
              className="form-control"
              rows="3"
              placeholder="Tuliskan deskripsi singkat pelanggaran"
              value={form.deskripsi}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Tindakan Sekolah</label>
            <textarea
              name="tindakan_sekolah"
              className="form-control"
              rows="3"
              placeholder="Tuliskan tindakan sekolah yang akan diambil"
              value={form.tindakan_sekolah}
              onChange={handleChange}
            />
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
