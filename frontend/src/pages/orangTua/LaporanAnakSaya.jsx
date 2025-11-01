import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import api from "../../lib/axios";

export default function LaporanAnakSaya() {
  const [laporanData, setLaporanData] = useState([]);
  const [search, setSearch] = useState("");
  
  const [showForm, setShowForm] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [isi, setIsi] = useState("");
  const [tindakanRumah, setTindakanRumah] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      
      const res = await api.get("/laporan/anak");
      const data = Array.isArray(res.data) ? res.data : [];
      setLaporanData(data);
    } catch (err) {
      console.error("Gagal ambil data laporan:", err?.response?.data || err);
      setLaporanData([]);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = laporanData.filter((l) =>
    l.jenis_pelanggaran?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPelanggaran = filteredData.length;
  const totalPoin = filteredData.reduce((sum, l) => sum + (l.poin || 0), 0);
  const latestRow = filteredData[0] || laporanData[0] || null;
  const terakhirUpdate = latestRow?.tanggal_pelanggaran || "-";
  const statusTerakhir = latestRow?.status_konseling || "-";

  const openForm = (row) => {
    setCurrentRow(row);
    setIsi("");
    setTindakanRumah("");
    setSubmitError("");
    setShowForm(true);
  };

  const submitTanggapan = async (e) => {
    e?.preventDefault?.();
    if (!currentRow) return;
    if (!isi || isi.trim().length < 5) {
      setSubmitError("Isi tanggapan minimal 5 karakter");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      await api.post("/tanggapan", {
        pelanggaranSiswaId: currentRow.id_laporan,
        isi_tanggapan: isi.trim(),
        tindakan_rumah: tindakanRumah?.trim() || undefined,
      });
      setShowForm(false);
      setCurrentRow(null);
      setIsi("");
      setTindakanRumah("");
      await fetchData();
    } catch (err) {
      console.error("Gagal kirim tanggapan:", err?.response?.data || err);
      setSubmitError(err?.response?.data?.message || "Gagal mengirim tanggapan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      {}
      <TanggapanModal
        show={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={submitTanggapan}
        isi={isi}
        setIsi={setIsi}
        tindakanRumah={tindakanRumah}
        setTindakanRumah={setTindakanRumah}
        submitting={submitting}
        error={submitError}
      />
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/orangtua">
              <i className="fa-solid fa-house me-1"></i>Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Laporan Anak Saya
          </li>
        </ol>
      </nav>

      <hr />

      <div className="row text-center mb-4">
        <div className="col-md-3">
          <div className="p-3 border rounded bg-light shadow-sm">
            <h4 className="text-danger">{totalPelanggaran}</h4>
            <p>Pelanggaran</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 border rounded bg-light shadow-sm">
            <h4 className="text-warning">{totalPoin}</h4>
            <p>Total Poin</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 border rounded bg-light shadow-sm">
            <h4
              className={
                statusTerakhir === "selesai"
                  ? "text-success"
                  : statusTerakhir === "sedang"
                  ? "text-warning"
                  : "text-danger"
              }
            >
              {statusTerakhir.charAt(0).toUpperCase() + statusTerakhir.slice(1)}
            </h4>
            <p>Status Konseling</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 border rounded bg-light shadow-sm">
            <h4 className="text-muted">
              {terakhirUpdate ? terakhirUpdate : "-"}
            </h4>
            <p>Terakhir Update</p>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center justify-content-end">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Cari pelanggaran..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
        {filteredData.length > 0 ? (
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-center">
              <tr>
                <th style={{width: '60px'}}>No</th>
                <th>Jenis Pelanggaran</th>
                <th>Poin</th>
                <th>Tanggal</th>
                <th>Catatan Konseling</th>
                <th>Status</th>
                <th>Tindak Lanjut</th>
                <th style={{width: '200px'}}>Tanggapan Orang Tua</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((l, i) => (
                <tr key={l.id_laporan || i}>
                  <td className="text-center">{i + 1}</td>
                  <td className="fw-semibold">{l.jenis_pelanggaran}</td>
                  <td className="text-center">
                    <span className="badge bg-warning">{l.poin}</span>
                  </td>
                  <td className="text-center">
                    <i className="fa-regular fa-calendar me-1"></i>
                    {l.tanggal_pelanggaran}
                  </td>
                  <td>{l.catatan_konseling}</td>
                  <td className="text-center">
                    <span
                      className={`badge ${
                        l.status_konseling === "selesai"
                          ? "bg-success"
                          : l.status_konseling === "sedang"
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                    >
                      {l.status_konseling}
                    </span>
                  </td>
                  <td>{l.tindak_lanjut}</td>
                  <td className="text-center">
                    {l.tanggapan_orangtua ? (
                      <small className="text-muted">{l.tanggapan_orangtua}</small>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openForm(l)}
                      >
                        <i className="fa-solid fa-comment-dots me-1"></i>
                        Beri Tanggapan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-5 text-muted">
            <i className="fa-solid fa-inbox fa-3x mb-3 d-block"></i>
            <p>Data laporan tidak ditemukan</p>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TanggapanModal({ show, onClose, onSubmit, isi, setIsi, tindakanRumah, setTindakanRumah, submitting, error }) {
  if (!show) return null;
  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <form onSubmit={onSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Beri Tanggapan Orang Tua</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
              <div className="mb-3">
                <label className="form-label">Isi Tanggapan</label>
                <textarea className="form-control" rows={4} value={isi} onChange={(e) => setIsi(e.target.value)} placeholder="Tuliskan tanggapan Anda..." required />
                <small className="text-muted">Minimal 5 karakter</small>
              </div>
              <div className="mb-3">
                <label className="form-label">Tindakan di Rumah (opsional)</label>
                <input className="form-control" value={tindakanRumah} onChange={(e) => setTindakanRumah(e.target.value)} placeholder="Contoh: Pembinaan, pembatasan gadget, dll." />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Mengirim..." : "Kirim"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
