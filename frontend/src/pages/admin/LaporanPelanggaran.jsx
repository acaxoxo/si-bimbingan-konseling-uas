import { useEffect, useMemo, useState } from "react";
import api from "../../lib/axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Loading from "../../components/Loading";
import { formatAxiosError } from "../../lib/error";

export default function LaporanPelanggaran() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [periodeMode, setPeriodeMode] = useState("rentang"); // rentang | bulanan | semester | tahunan
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [kelasId, setKelasId] = useState("");
  const [kategori, setKategori] = useState("");

  // Dropdown data
  const [kelasList, setKelasList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    // preload kelas + kategori once
    (async () => {
      try {
        const [kelasRes, jenisRes] = await Promise.all([
          api.get("/kelas").catch(() => ({ data: [] })),
          api.get("/jenis-pelanggaran").catch(() => ({ data: [] })),
        ]);
        setKelasList(Array.isArray(kelasRes.data) ? kelasRes.data : []);
        const uniqueKategori = Array.from(
          new Set(((jenisRes.data || []).map(j => j.kategori_pelanggaran)).filter(Boolean))
        );
        setKategoriList(uniqueKategori);
      } catch {
        // ignore preload failures
      }
    })();
    // initial load
    handleFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (periodeMode !== "rentang") {
      params.set("periode", periodeMode);
    } else {
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
    }
    if (kelasId) params.set("kelasId", kelasId);
    if (kategori) params.set("kategori", kategori);
    return params.toString();
  };

  const handleFetch = async () => {
    try {
      setLoading(true);
      setError("");
      const qs = buildQuery();
      const url = qs ? `/laporan/pelanggaran?${qs}` : "/laporan/pelanggaran";
      const res = await api.get(url);
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(formatAxiosError(err));
    } finally {
      setLoading(false);
    }
  };

  const displayRows = useMemo(() => {
    return rows.map((p) => ({
      tanggal: p.tanggal_pelanggaran?.slice(0, 10) || "",
      siswa: p.siswa?.nama_siswa || "",
      nis: p.siswa?.nis || "",
      kelas: `${p.siswa?.kela?.nama_kelas || "-"} ${p.siswa?.kela?.kelas_kejuruan || ""}`.trim(),
      pelanggaran: p.jenis_pelanggaran?.nama_jenis_pelanggaran || "",
      kategori: p.jenis_pelanggaran?.kategori_pelanggaran || "",
      poin: p.jenis_pelanggaran?.poin_pelanggaran || 0,
      guru: p.guru?.nama_guru || "",
      catatan: p.catatan_konseling || "",
    }));
  }, [rows]);

  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(displayRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Laporan");
    XLSX.writeFile(wb, `laporan_pelanggaran_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const title = "Laporan Pelanggaran Siswa";
    doc.setFontSize(14);
    doc.text(title, 14, 14);
    const filterLine = `Filter: ${(periodeMode !== 'rentang' ? `Periode ${periodeMode}` : `${startDate || '-'} s.d. ${endDate || '-'}`)} | Kelas: ${kelasId || 'Semua'} | Kategori: ${kategori || 'Semua'}`;
    doc.setFontSize(10);
    doc.text(filterLine, 14, 22);

    const head = [["Tanggal", "NIS", "Nama Siswa", "Kelas", "Pelanggaran", "Kategori", "Poin", "Guru", "Catatan"]];
    const body = displayRows.map(r => [r.tanggal, r.nis, r.siswa, r.kelas, r.pelanggaran, r.kategori, r.poin, r.guru, r.catatan]);

    doc.autoTable({
      head,
      body,
      startY: 26,
      styles: { fontSize: 9, cellPadding: 2, overflow: 'linebreak' },
      headStyles: { fillColor: [13, 110, 253] },
      columnStyles: { 8: { cellWidth: 70 } },
    });

    doc.save(`laporan_pelanggaran_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Laporan Pelanggaran Siswa</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm" onClick={exportPDF} disabled={loading || !rows.length}>
            <i className="fa-regular fa-file-pdf me-1"></i> PDF
          </button>
          <button className="btn btn-success btn-sm" onClick={exportExcel} disabled={loading || !rows.length}>
            <i className="fa-regular fa-file-excel me-1"></i> Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Periode</label>
              <select className="form-select" value={periodeMode} onChange={(e)=> setPeriodeMode(e.target.value)}>
                <option value="rentang">Rentang Tanggal</option>
                <option value="bulanan">Bulanan (this month)</option>
                <option value="semester">Semester (current)</option>
                <option value="tahunan">Tahunan (this year)</option>
              </select>
            </div>
            {periodeMode === 'rentang' && (
              <>
                <div className="col-md-2">
                  <label className="form-label">Dari</label>
                  <input type="date" className="form-control" value={startDate} onChange={(e)=> setStartDate(e.target.value)} />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Sampai</label>
                  <input type="date" className="form-control" value={endDate} onChange={(e)=> setEndDate(e.target.value)} />
                </div>
              </>
            )}
            <div className="col-md-3">
              <label className="form-label">Kelas</label>
              <select className="form-select" value={kelasId} onChange={(e)=> setKelasId(e.target.value)}>
                <option value="">Semua Kelas</option>
                {kelasList.map(k => (
                  <option key={k.id_kelas} value={k.id_kelas}>{k.nama_kelas} {k.kelas_kejuruan || ""}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Kategori</label>
              <select className="form-select" value={kategori} onChange={(e)=> setKategori(e.target.value)}>
                <option value="">Semua</option>
                {kategoriList.map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2 text-end">
              <button className="btn btn-primary w-100" onClick={handleFetch}>
                <i className="fa-solid fa-filter me-1"></i> Terapkan
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {loading ? (
        <Loading label="Memuat laporan..." />
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
          {rows.length ? (
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-center">
                <tr>
                  <th style={{width: '60px'}}>No</th>
                  <th>Tanggal</th>
                  <th>NIS</th>
                  <th>Nama Siswa</th>
                  <th>Kelas</th>
                  <th>Pelanggaran</th>
                  <th>Kategori</th>
                  <th>Poin</th>
                  <th>Guru</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map((r, i) => (
                  <tr key={`${r.nis}-${r.tanggal}-${i}`}>
                    <td className="text-center">{i + 1}</td>
                    <td>{r.tanggal}</td>
                    <td>{r.nis}</td>
                    <td className="fw-semibold">{r.siswa}</td>
                    <td>{r.kelas}</td>
                    <td>{r.pelanggaran}</td>
                    <td className="text-center">
                      <span className={`badge ${
                        r.kategori === 'Ringan' ? 'bg-success' :
                        r.kategori === 'Sedang' ? 'bg-warning' :
                        'bg-danger'
                      }`}>
                        {r.kategori}
                      </span>
                    </td>
                    <td className="text-center">{r.poin}</td>
                    <td>{r.guru}</td>
                    <td>{r.catatan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="fa-solid fa-inbox fa-3x mb-3 d-block"></i>
              <p>Tidak ada data untuk filter saat ini</p>
            </div>
          )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
