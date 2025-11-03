import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../lib/axios";
import notify from "../../lib/notify";

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
  const [formErrors, setFormErrors] = useState({});
  const [existingNames, setExistingNames] = useState(new Set());
  const [originalName, setOriginalName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

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
        setOriginalName((data.nama_jenis_pelanggaran || "").toLowerCase().trim());
        setLoading(false);
      } catch (err) {
        console.error("Gagal ambil data:", err);
        notify.error("Gagal memuat data");
        setLoading(false);
      }
    };

    fetchData();
    // fetch existing names for duplicate checking
    let mounted = true;
    api
      .get("/jenis-pelanggaran")
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        const names = new Set(list.map((j) => (j.nama_jenis_pelanggaran || "").toLowerCase().trim()));
        setExistingNames(names);
      })
      .catch(() => {});
    return () => (mounted = false);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "nama_jenis_pelanggaran") {
      const normalized = value.toLowerCase().trim();
      // consider it duplicate only if it's in existing names and not the original name
      if (normalized && existingNames.has(normalized) && normalized !== originalName) {
        setFormErrors((prev) => ({
          ...prev,
          nama_jenis_pelanggaran: "Nama jenis pelanggaran sudah terdaftar",
        }));
      } else {
        setFormErrors((prev) => {
          const copy = { ...prev };
          delete copy.nama_jenis_pelanggaran;
          return copy;
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setGeneralError("");
    try {
      const payload = {
        ...form,
        poin_pelanggaran: parseInt(form.poin_pelanggaran),
      };
      await api.put(`/jenis-pelanggaran/${id}`, payload);
  notify.success("Data jenis pelanggaran berhasil diperbarui!");
  // inform list to refresh
  try { window.dispatchEvent(new CustomEvent('jenis:updated', { detail: { id } })); } catch { /* ignore */ }
  navigate("/admin/data/jenis-pelanggaran");
    } catch (err) {
      console.error("Gagal update:", err);
      const resp = err.response?.data;

      if (resp?.fields && typeof resp.fields === 'object') {
        setFormErrors(resp.fields);
        const firstMsg = Object.values(resp.fields)[0];
        notify.error(`Gagal memperbarui data: ${firstMsg}`);
        return;
      }

      const status = err.response?.status;
      const msg = resp?.message || err.message;
      if (status === 409) {
        // If conflict but no fields, show general error and inline for name
        setFormErrors((prev) => ({ ...prev, nama_jenis_pelanggaran: msg }));
        notify.error(`Gagal memperbarui data: ${msg}`);
        setGeneralError(msg);
        return;
      }

      notify.error(`Gagal memperbarui data: ${msg}`);
      setGeneralError(msg);
    } finally {
      setIsSubmitting(false);
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
        {generalError && (
          <div className="alert alert-danger" role="alert">
            {generalError}
          </div>
        )}
        <div className="row g-3">
          <div className="col-lg-4">
            <label className="form-label fw-semibold">Nama Pelanggaran</label>
            <input
              type="text"
              name="nama_jenis_pelanggaran"
              className={`form-control ${formErrors.nama_jenis_pelanggaran ? 'is-invalid' : ''}`}
              value={form.nama_jenis_pelanggaran}
              onChange={handleChange}
              required
            />
            {formErrors.nama_jenis_pelanggaran && (
              <div className="invalid-feedback d-block">
                {formErrors.nama_jenis_pelanggaran}
              </div>
            )}
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
          <button type="submit" className="btn btn-success" disabled={isSubmitting || Boolean(formErrors.nama_jenis_pelanggaran)}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Memperbarui...
              </>
            ) : (
              <>
                <i className="fa-solid fa-save me-2"></i>Update Data
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
