import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/axios";
import notify from "../../lib/notify";

export default function AddJenisPelanggaran() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama_jenis_pelanggaran: "",
    kategori_pelanggaran: "",
    deskripsi: "",
    tindakan_sekolah: "",
    poin_pelanggaran: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [existingNames, setExistingNames] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Real-time duplicate check for nama_jenis_pelanggaran
    if (name === "nama_jenis_pelanggaran") {
      const normalized = value.toLowerCase().trim();
      if (normalized && existingNames.has(normalized)) {
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

  useEffect(() => {
    // Fetch existing jenis pelanggaran names once to prevent duplicates client-side
    let mounted = true;
    api
      .get("/jenis-pelanggaran")
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        const names = new Set(list.map((j) => (j.nama_jenis_pelanggaran || "").toLowerCase().trim()));
        setExistingNames(names);
      })
      .catch(() => {
        // ignore errors; server validation still protects uniqueness
      });
    return () => (mounted = false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  if (isSubmitting) return; // prevent double submit
  setIsSubmitting(true);
  setGeneralError("");
    try {
      const payload = {
        ...form,
        poin_pelanggaran: parseInt(form.poin_pelanggaran),
      };
      // clear previous errors
      setFormErrors({});
      console.log("Sending payload:", payload);
      const response = await api.post("/jenis-pelanggaran", payload);
      console.log("Response:", response);
      // add newly created name to existingNames to keep client-side list fresh
      const createdName = (payload.nama_jenis_pelanggaran || "").toLowerCase().trim();
      if (createdName) {
        setExistingNames((prev) => new Set([...prev, createdName]));
      }
      // notify and inform list to refresh
      notify.success("Data jenis pelanggaran berhasil disimpan!");
      try {
        const created = response?.data?.data;
        console.log('[AddJenisPelanggaran] Dispatching jenis:created event', created);
        window.dispatchEvent(new CustomEvent('jenis:created', { detail: { created } }));
      } catch (e) {
        console.error('[AddJenisPelanggaran] Failed to dispatch event', e);
      }
      // Small delay to ensure event is processed before navigation
      setTimeout(() => navigate("/admin/data/jenis-pelanggaran"), 100);
    } catch (err) {
      console.error("Gagal menambah data:", err);
      console.error("Error response:", err.response?.data);
      const resp = err.response?.data;

      // If server returned field-level error object, show inline
      if (resp?.fields && typeof resp.fields === 'object') {
        setFormErrors(resp.fields);
        // also show a short toast (but prefer inline)
        const firstMsg = Object.values(resp.fields)[0];
        notify.error(`Gagal menambahkan data: ${firstMsg}`);
        return;
      }

      // If server responded with a 409 conflict but didn't include fields,
      // set a generic inline error for the nama field so user can fix it.
      const status = err.response?.status;
      if (status === 409) {
        const msg = resp?.message || 'Nama jenis pelanggaran sudah terdaftar';
        setFormErrors((prev) => ({ ...prev, nama_jenis_pelanggaran: msg }));
        notify.error(`Gagal menambahkan data: ${msg}`);
        setGeneralError(msg);
        return;
      }

      let msg = resp?.message || err.message;
      // Prefer structured errors array if provided by the server
      if (Array.isArray(resp?.errors) && resp.errors.length) {
        msg = resp.errors.join("; ");
      }
      // Some endpoints return { message: '...', errors: { field: msg } }
      else if (resp?.errors && typeof resp.errors === "object") {
        const vals = [].concat(...Object.values(resp.errors));
        msg = vals.join("; ");
      }

      notify.error(`Gagal menambahkan data: ${msg}`);
      setGeneralError(msg);
    } finally {
      setIsSubmitting(false);
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
            <Link to="/admin/data/jenis-pelanggaran">
              Data Jenis Pelanggaran
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Tambah Data
          </li>
        </ol>
      </nav>

      <hr />

      <div className="d-flex justify-content-between mb-3">
        <Link
          className="btn btn-sm btn-warning"
          to="/admin/data/jenis-pelanggaran"
        >
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
            <input
              type="text"
              name="deskripsi"
              className="form-control"
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
              placeholder="Tuliskan tindakan sekolah yang akan diberikan untuk pelanggaran ini"
              value={form.tindakan_sekolah}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4">
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting || Boolean(formErrors.nama_jenis_pelanggaran)}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk me-2"></i> Simpan Data
                </>
              )}
            </button>
          </div>
      </form>
    </div>
  );
}
