import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";

export default function AddPelanggaranSiswa() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [siswaData, setSiswaData] = useState([]);
  const [jenisPelanggaranData, setJenisPelanggaranData] = useState([]);
  const [form, setForm] = useState({
    siswaId: "",
    jenisPelanggaranId: "",
    catatan_konseling: "",
    tanggal_pelanggaran: "",
    status_konseling: "Belum",
    tindak_lanjut: "",
    guruId: "",
  });

  useEffect(() => {
    fetchSiswa();
    fetchJenisPelanggaran();
  }, []);

  const fetchSiswa = async () => {
    try {
      const res = await api.get("/siswa");
      
      setSiswaData(res.data.data || res.data || []);
    } catch (err) {
      console.error("Gagal ambil data siswa:", err);
      setSiswaData([]);
    }
  };

  const fetchJenisPelanggaran = async () => {
    try {
      const res = await api.get("/jenis-pelanggaran");
      console.log("Jenis Pelanggaran data:", res.data);
      
      setJenisPelanggaranData(res.data.data || res.data || []);
    } catch (err) {
      console.error("Gagal ambil data jenis pelanggaran:", err);
      setJenisPelanggaranData([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const payload = {
        siswaId: parseInt(form.siswaId),
        jenisPelanggaranId: parseInt(form.jenisPelanggaranId),
        tanggal_pelanggaran: form.tanggal_pelanggaran,
        catatan_konseling: form.catatan_konseling || null,
        status_konseling: form.status_konseling,
        tindak_lanjut: form.tindak_lanjut || null,
        guruId: user?.id || null, 
      };
      
      console.log("Submitting form data:", payload);
      const response = await api.post("/pelanggaran-siswa", payload);
      console.log("Response:", response);
      alert("Data berhasil ditambahkan!");
      navigate("/guru/data/pelanggaran-siswa");
    } catch (err) {
      console.error("Gagal submit:", err);
      console.error("Error response:", err.response?.data);
      alert(`Gagal tambah data: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/guru">
              <i className="fa-solid fa-house me-1"></i>Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/guru/data/pelanggaran-siswa">
              Data Pelanggaran Siswa
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Tambah Data
          </li>
        </ol>
      </nav>

      <hr />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold mb-0">
          <i className="fa-solid fa-triangle-exclamation text-danger me-2"></i>
          Tambah Data Pelanggaran
        </h4>
        <Link
          className="btn btn-sm btn-warning"
          to="/guru/data/pelanggaran-siswa"
        >
          <i className="fa-solid fa-arrow-left me-1"></i> Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="card shadow-sm border-0 p-4">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="siswaId" className="form-label">
                Nama Siswa
              </label>
              <select
                className="form-select"
                id="siswaId"
                name="siswaId"
                value={form.siswaId}
                onChange={handleChange}
                required
              >
                <option value="">Pilih siswa yang melakukan pelanggaran</option>
                {siswaData.map((siswa) => (
                  <option key={siswa.id_siswa} value={siswa.id_siswa}>
                    {siswa.nama_siswa}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="jenisPelanggaranId" className="form-label">
                Jenis Pelanggaran
              </label>
              <select
                className="form-select"
                id="jenisPelanggaranId"
                name="jenisPelanggaranId"
                value={form.jenisPelanggaranId}
                onChange={handleChange}
                required
              >
                <option value="">Pilih jenis pelanggaran</option>
                {jenisPelanggaranData.map((jenis) => (
                  <option
                    key={jenis.id_jenis_pelanggaran}
                    value={jenis.id_jenis_pelanggaran}
                  >
                    {jenis.nama_jenis_pelanggaran} - {jenis.kategori_pelanggaran} ({jenis.poin_pelanggaran} poin)
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="tanggalPelanggaran" className="form-label">
                Tanggal Pelanggaran
              </label>
              <input
                type="date"
                className="form-control"
                id="tanggalPelanggaran"
                name="tanggal_pelanggaran"
                value={form.tanggal_pelanggaran}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="catatanKonseling" className="form-label">
                Catatan Konseling (opsional)
              </label>
              <input
                type="text"
                className="form-control"
                id="catatanKonseling"
                name="catatan_konseling"
                value={form.catatan_konseling}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="statusKonseling" className="form-label">
                Status Konseling
              </label>
              <select
                className="form-select"
                id="statusKonseling"
                name="status_konseling"
                value={form.status_konseling}
                onChange={handleChange}
                required
              >
                <option value="Belum">Belum</option>
                <option value="Sedang">Sedang</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="tindakLanjut" className="form-label">
                Tindak Lanjut
              </label>
              <input
                type="text"
                className="form-control"
                id="tindakLanjut"
                name="tindak_lanjut"
                value={form.tindak_lanjut}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="guruId" className="form-label">
                Guru Pelapor (opsional)
              </label>
              <input
                type="number"
                className="form-control"
                id="guruId"
                name="guruId"
                value={form.guruId}
                onChange={handleChange}
                placeholder="ID Guru"
              />
            </div>
          </div>
        </div>

        <div className="text-end mt-4">
          <button className="btn btn-primary px-4" type="submit">
            <i className="fa-solid fa-check me-2"></i> Simpan Data
          </button>
        </div>
      </form>
    </div>
  );
}
