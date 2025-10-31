import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function LaporanGuru() {
  const [laporan, setLaporan] = useState([]);
  const [filterBulan, setFilterBulan] = useState("");
  const [filterTahun, setFilterTahun] = useState("");

  const fetchLaporan = async () => {
    try {
      // Ambil data langsung dari daftar pelanggaran siswa agar sesuai dengan kolom tabel
      const res = await api.get("/pelanggaran-siswa");
      // Extract data from paginated response
      const dataArray = res.data?.data || res.data || [];
      setLaporan(Array.isArray(dataArray) ? dataArray : []);
    } catch (err) {
      console.error("Gagal mengambil data laporan:", err?.response?.data || err);
      setLaporan([]);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const handleExport = () => {
    // Format data for Excel export
    const headerRows = [
      ["LAPORAN PELANGGARAN SISWA"],
      ["SMK Negeri 1 Kupang"],
      ["Tanggal Export: ", new Date().toLocaleDateString("id-ID")],
      [],
    ];
    const columns = [
      "No",
      "Nama Siswa",
      "Kelas",
      "Jenis Pelanggaran",
      "Kategori",
      "Poin",
      "Tanggal",
      "Tindakan Sekolah"
    ];
    const dataRows = filteredLaporan.map((item, i) => [
      i + 1,
      item?.siswa?.nama_siswa || "-",
      (item?.siswa?.kela?.nama_kelas || "-") + (item?.siswa?.kela?.kelas_kejuruan ? ` ${item.siswa.kela.kelas_kejuruan}` : ""),
      item?.jenis_pelanggaran?.nama_jenis_pelanggaran || "-",
      item?.jenis_pelanggaran?.kategori_pelanggaran || "-",
      item?.jenis_pelanggaran?.poin_pelanggaran || 0,
      item?.tanggal_pelanggaran ? new Date(item.tanggal_pelanggaran).toLocaleDateString("id-ID") : "-",
      item?.tindak_lanjut || "-"
    ]);
    const worksheet = XLSX.utils.aoa_to_sheet([
      ...headerRows,
      columns,
      ...dataRows
    ]);
    // Style header rows (bold)
    worksheet["A1"].s = { font: { bold: true, sz: 16 } };
    worksheet["A2"].s = { font: { bold: true, sz: 14 } };
    worksheet["A3"].s = { font: { italic: true, sz: 12 } };
    // Set column widths
    worksheet['!cols'] = [
      { wch: 5 },   // No
      { wch: 25 },  // Nama Siswa
      { wch: 20 },  // Kelas
      { wch: 20 },  // Jenis Pelanggaran
      { wch: 12 },  // Kategori
      { wch: 8 },   // Poin
      { wch: 14 },  // Tanggal
      { wch: 20 }   // Tindakan
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Pelanggaran");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Laporan_Pelanggaran_Siswa.xlsx");
  };

  const filteredLaporan = laporan.filter((item) => {
    const tanggal = new Date(item.tanggal_pelanggaran);
    const bulan = tanggal.getMonth() + 1;
    const tahun = tanggal.getFullYear();

    return (
      (!filterBulan || bulan === parseInt(filterBulan)) &&
      (!filterTahun || tahun === parseInt(filterTahun))
    );
  });

  return (
    <div className="container mt-4">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/guru">
              <i className="fa-solid fa-house me-1"></i>Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Laporan Pelanggaran
          </li>
        </ol>
      </nav>
      <hr />

      <h2 className="mb-4">Laporan Pelanggaran Siswa</h2>
      <p className="text-muted">Data rekap pelanggaran dan tindakan sekolah.</p>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Filter Bulan</label>
              <select
                className="form-select"
                value={filterBulan}
                onChange={(e) => setFilterBulan(e.target.value)}
              >
                <option value="">Semua Bulan</option>
                <option value="1">Januari</option>
                <option value="2">Februari</option>
                <option value="3">Maret</option>
                <option value="4">April</option>
                <option value="5">Mei</option>
                <option value="6">Juni</option>
                <option value="7">Juli</option>
                <option value="8">Agustus</option>
                <option value="9">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Filter Tahun</label>
              <input
                type="number"
                className="form-control"
                placeholder="Mis. 2025"
                value={filterTahun}
                onChange={(e) => setFilterTahun(e.target.value)}
              />
            </div>

            <div className="col-md-3 align-self-end">
              <button
                className="btn btn-success w-100"
                onClick={handleExport}
              >
                <i className="fa-solid fa-file-export me-2"></i> Export ke Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light text-center">
            <tr>
            <th style={{width: '60px'}}>No</th>
            <th>Nama Siswa</th>
            <th>Kelas</th>
            <th>Jenis Pelanggaran</th>
            <th>Tanggal</th>
            <th>Tindakan Sekolah</th>
            </tr>
          </thead>
          <tbody>
            {filteredLaporan.length > 0 ? (
              filteredLaporan.map((item, i) => (
                <tr key={item.id_pelanggaran_siswa}>
                  <td className="text-center">{i + 1}</td>
                  <td className="fw-semibold">{item?.siswa?.nama_siswa || "-"}</td>
                  <td>
                    {item?.siswa?.kela?.nama_kelas || "-"} {item?.siswa?.kela?.kelas_kejuruan || ""}
                  </td>
                  <td>
                    {item?.jenis_pelanggaran?.nama_jenis_pelanggaran || "-"}
                    {item?.jenis_pelanggaran?.kategori_pelanggaran || item?.jenis_pelanggaran?.poin_pelanggaran ? (
                      <><br /><small>
                        <span className={`badge ${
                          item?.jenis_pelanggaran?.kategori_pelanggaran === 'Ringan' ? 'bg-success' :
                          item?.jenis_pelanggaran?.kategori_pelanggaran === 'Sedang' ? 'bg-warning' :
                          'bg-danger'
                        }`}>
                          {item?.jenis_pelanggaran?.kategori_pelanggaran || "-"}
                        </span>
                        <span className="text-muted ms-1">- {item?.jenis_pelanggaran?.poin_pelanggaran || 0} poin</span>
                      </small></>
                    ) : null}
                  </td>
                  <td className="text-center">
                    <i className="fa-regular fa-calendar me-1"></i>
                    {item?.tanggal_pelanggaran ? new Date(item.tanggal_pelanggaran).toLocaleDateString("id-ID") : "-"}
                  </td>
                  <td>{item?.tindak_lanjut || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5 text-muted">
                  <i className="fa-solid fa-inbox fa-3x mb-3 d-block"></i>
                  <p className="mb-0">Tidak ada data laporan untuk filter ini</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
          </div>
        </div>
      </div>
    </div>
  );
}
