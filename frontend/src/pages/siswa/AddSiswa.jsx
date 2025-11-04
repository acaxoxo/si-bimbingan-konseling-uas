import { useState, useEffect } from "react";
import { toast } from "react-toastify";
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
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingEmails, setExistingEmails] = useState(new Set());
  const [existingNIS, setExistingNIS] = useState(new Set());

  useEffect(() => {
    
    api.get("/orang-tua").then((res) => setOrangTuaData(res.data.data || res.data || []));
    api.get("/kelas").then((res) => setKelasData(res.data.data || res.data || []));
    
    // Fetch existing siswa data for duplicate checking
    let mounted = true;
    api.get("/siswa")
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        const emails = new Set(list.map((s) => (s.email_siswa || "").toLowerCase().trim()).filter(Boolean));
        const nisSet = new Set(list.map((s) => (s.nis || "").trim()).filter(Boolean));
        setExistingEmails(emails);
        setExistingNIS(nisSet);
      })
      .catch(() => {});
    return () => (mounted = false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Real-time duplicate check
    if (name === "email_siswa") {
      const normalized = value.toLowerCase().trim();
      if (normalized && existingEmails.has(normalized)) {
        setFormErrors((prev) => ({
          ...prev,
          email_siswa: "Email sudah terdaftar",
        }));
      } else {
        setFormErrors((prev) => {
          const copy = { ...prev };
          delete copy.email_siswa;
          return copy;
        });
      }
    }

    if (name === "nis") {
      const normalized = value.trim();
      if (normalized && existingNIS.has(normalized)) {
        setFormErrors((prev) => ({
          ...prev,
          nis: "NIS sudah terdaftar",
        }));
      } else {
        setFormErrors((prev) => {
          const copy = { ...prev };
          delete copy.nis;
          return copy;
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormErrors({});
    setIsSubmitting(true);
    
    try {
      
      const onlyDigits = (form.no_telepon || "").replace(/\D+/g, "");
      let normalizedPhone = onlyDigits;
      if (onlyDigits.startsWith("62")) {
        normalizedPhone = "0" + onlyDigits.slice(2);
      } else if (onlyDigits.startsWith("8")) {
        normalizedPhone = "0" + onlyDigits;
      }

      const payload = {
        nama_siswa: (form.nama_siswa || "").trim(),
        nis: form.nis,
        orangTuaId: form.orangTuaId ? Number(form.orangTuaId) : null,
        jenis_kelamin: form.jenis_kelamin,
        kelas_id: form.kelas_id ? Number(form.kelas_id) : null,
        tempat_lahir: (form.tempat_lahir || "").trim(),
        tanggal_lahir: form.tanggal_lahir,
        alamat: (form.alamat || "").trim() || null,
        no_telepon: normalizedPhone,
        email_siswa: (form.email_siswa || "").trim(),
      };

      // Only include password if it's provided
      if (form.password && form.password.trim()) {
        payload.password = form.password;
      }

      // Validation before sending
      if (!payload.nama_siswa) {
        setError("Nama siswa wajib diisi");
        setIsSubmitting(false);
        return;
      }
      if (!payload.nis) {
        setError("NIS wajib diisi");
        setIsSubmitting(false);
        return;
      }
      if (!payload.jenis_kelamin) {
        setError("Jenis kelamin wajib diisi");
        setIsSubmitting(false);
        return;
      }
      if (!payload.kelas_id) {
        setError("Kelas wajib diisi");
        setIsSubmitting(false);
        return;
      }
      if (!payload.tempat_lahir) {
        setError("Tempat lahir wajib diisi");
        setIsSubmitting(false);
        return;
      }
      if (!payload.tanggal_lahir) {
        setError("Tanggal lahir wajib diisi");
        setIsSubmitting(false);
        return;
      }
      if (!payload.no_telepon) {
        setError("Nomor telepon wajib diisi");
        setIsSubmitting(false);
        return;
      }
      if (!payload.email_siswa) {
        setError("Email wajib diisi");
        setIsSubmitting(false);
        return;
      }

      console.log("[AddSiswa] Submitting payload:", payload);

  await api.post("/siswa", payload);
  toast.success("Data siswa berhasil disimpan!");
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
      console.error("[AddSiswa] Error details:", err);
      console.error("[AddSiswa] Error response:", server);
      console.error("[AddSiswa] Error response FULL:", JSON.stringify(server, null, 2));
      console.error("[AddSiswa] Request payload was:", {
        ...form,
        orangTuaId: form.orangTuaId ? Number(form.orangTuaId) : null,
        kelas_id: form.kelas_id ? Number(form.kelas_id) : undefined,
      });
      
      // Handle field-level errors from server
      if (server?.fields && typeof server.fields === 'object') {
        setFormErrors(server.fields);
        const firstMsg = Object.values(server.fields)[0];
        setError(firstMsg);
        toast.error(`Gagal menyimpan data: ${firstMsg}`);
        return;
      }
      
      // Try to get more detailed error info
      let errorMsg = "Gagal menyimpan data siswa";
      
      if (server?.message) {
        errorMsg = server.message;
      }
      
      // Handle 409 Conflict (duplicate data)
      if (err.response?.status === 409) {
        errorMsg = server?.message || "Data sudah terdaftar";
        if (server?.field === 'email_siswa') {
          errorMsg = `Email sudah terdaftar. Gunakan email lain.`;
          setFormErrors((prev) => ({ ...prev, email_siswa: errorMsg }));
        } else if (server?.field === 'nis') {
          errorMsg = `NIS sudah terdaftar. Periksa kembali NIS yang dimasukkan.`;
          setFormErrors((prev) => ({ ...prev, nis: errorMsg }));
        }
      }
      
      // Check for Sequelize validation errors
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const errorDetails = err.response.data.errors.map(e => 
          typeof e === 'string' ? e : (e.message || JSON.stringify(e))
        ).join('\n');
        console.error("[AddSiswa] Detailed errors:", errorDetails);
        errorMsg += `\n${errorDetails}`;
      }
      
      setError(errorMsg);
      toast.error(`${errorMsg}`);
    } finally {
      setIsSubmitting(false);
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

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error!</strong> {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError("")}
            aria-label="Close"
          ></button>
        </div>
      )}

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
              className={`form-control ${formErrors.nis ? 'is-invalid' : ''}`}
              required
            />
            {formErrors.nis && (
              <div className="invalid-feedback d-block">
                {formErrors.nis}
              </div>
            )}
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
              className={`form-control ${formErrors.email_siswa ? 'is-invalid' : ''}`}
                required
            />
            {formErrors.email_siswa && (
              <div className="invalid-feedback d-block">
                {formErrors.email_siswa}
              </div>
            )}
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
          <button 
            type="submit" 
            className="btn btn-success" 
            disabled={isSubmitting || Boolean(formErrors.email_siswa) || Boolean(formErrors.nis)}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
