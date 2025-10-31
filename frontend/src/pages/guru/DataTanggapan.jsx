import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

export default function DataTanggapan() {
  const [tanggapanData, setTanggapanData] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTanggapan, setSelectedTanggapan] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/tanggapan");
      const raw = Array.isArray(res.data) ? res.data : [];
      const flat = raw.map((t) => {
        const orang = t.orang_tua || t.OrangTua || t.orangtua;
        const pel = t.pelanggaran_siswa || t.PelanggaranSiswa || t.pelanggaransiswa;
        const siswa = pel?.siswa || pel?.Siswa;
        return {
          id_tanggapan: t.id_tanggapan,
          nama_siswa: siswa?.nama_siswa || "-",
          nama_orang_tua: orang ? `${orang.nama_ayah || "-"} & ${orang.nama_ibu || "-"}` : "-",
          tanggal: t.tanggal_tanggapan || "-",
          isi_tanggapan: t.isi_tanggapan || "-",
          tindakan_rumah: t.tindakan_rumah || "-",
          status: t.status || "-",
        };
      });
      setTanggapanData(flat);
    } catch (err) {
      console.error("Gagal ambil data tanggapan:", err?.response?.data || err);
      setTanggapanData([]);
    }
  };

  const filteredData = tanggapanData.filter((item) => {
    const q = search.toLowerCase();
    return (
      (item.nama_orang_tua || "").toLowerCase().includes(q) ||
      (item.nama_siswa || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="container mt-4 mb-5">
      {/* Modal for viewing full tanggapan */}
      {showModal && selectedTanggapan && (
        <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fa-regular fa-message me-2"></i>
                  Detail Tanggapan Orang Tua
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)} 
                />
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-12">
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="text-muted small mb-1">Nama Siswa</label>
                            <div className="fw-semibold">{selectedTanggapan.nama_siswa}</div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="text-muted small mb-1">Orang Tua</label>
                            <div className="fw-semibold">{selectedTanggapan.nama_orang_tua}</div>
                          </div>
                          <div className="col-md-6">
                            <label className="text-muted small mb-1">Tanggal Tanggapan</label>
                            <div>
                              <i className="fa-regular fa-calendar me-1 text-primary"></i>
                              {selectedTanggapan.tanggal}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <label className="text-muted small mb-2">Isi Tanggapan</label>
                    <div className="card border-0 bg-light">
                      <div className="card-body" style={{ whiteSpace: "pre-wrap" }}>
                        {selectedTanggapan.isi_tanggapan}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <label className="text-muted small mb-2">Tindakan di Rumah</label>
                    <div className="card border-0 bg-light">
                      <div className="card-body" style={{ whiteSpace: "pre-wrap" }}>
                        {selectedTanggapan.tindakan_rumah}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  <i className="fa-solid fa-times me-1"></i>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/guru">
              <i className="fa-solid fa-house me-1"></i>Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Data Tanggapan Orang Tua
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-6">
              <h5 className="fw-semibold mb-0">Daftar Tanggapan</h5>
            </div>
            <div className="col-12 col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Cari nama siswa atau orang tua..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {filteredData.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="text-center" style={{width: '60px'}}>No</th>
                    <th>Nama Siswa</th>
                    <th>Orang Tua</th>
                    <th style={{width: '150px'}}>Tanggal</th>
                    <th className="text-center" style={{width: '100px'}}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, i) => (
                    <tr key={item.id_tanggapan}>
                      <td className="text-center">{i + 1}</td>
                      <td>
                        <div className="fw-semibold">{item.nama_siswa}</div>
                      </td>
                      <td>
                        <div className="small">{item.nama_orang_tua}</div>
                      </td>
                      <td>
                        <small className="text-muted">
                          <i className="fa-regular fa-calendar me-1"></i>
                          {item.tanggal}
                        </small>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          title="Lihat Detail"
                          onClick={() => {
                            setSelectedTanggapan(item);
                            setShowModal(true);
                          }}
                        >
                          <i className="fa-regular fa-eye me-1"></i>
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fa-solid fa-inbox fa-3x text-muted mb-3"></i>
              <p className="text-muted">Tidak ada data tanggapan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
