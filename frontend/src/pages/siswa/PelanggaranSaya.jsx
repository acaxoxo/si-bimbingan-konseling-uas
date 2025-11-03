import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";

export default function PelanggaranSaya() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/pelanggaran-siswa");
        // Normalize response - handle paginated or direct array responses
        const payload = res?.data;
        const list = Array.isArray(payload) ? payload : payload?.data ?? [];
        setData(list);
      } catch (err) {
        console.error("Gagal ambil data pelanggaran:", err?.response?.data || err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const myData = useMemo(() => {
    const term = search.toLowerCase();
    return (data || [])
      .filter((p) => p?.siswa?.id_siswa === user?.id)
      .filter((p) => {
        const nama = p?.jenis_pelanggaran?.nama_jenis_pelanggaran || "";
        const kategori = p?.jenis_pelanggaran?.kategori_pelanggaran || "";
        const tindak = p?.tindak_lanjut || "";
        return (
          nama.toLowerCase().includes(term) ||
          kategori.toLowerCase().includes(term) ||
          tindak.toLowerCase().includes(term)
        );
      });
  }, [data, user?.id, search]);

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/siswa">
              <i className="fa-solid fa-house me-1"></i>Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Pelanggaran Saya
          </li>
        </ol>
      </nav>

      <hr />

      <div className="d-flex justify-content-end align-items-center mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Cari jenis/kategori/tindak lanjut..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive mt-4">
        {loading ? (
          <div className="text-center text-muted">Memuat data...</div>
        ) : myData.length > 0 ? (
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-primary text-center">
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Jenis Pelanggaran</th>
                <th>Kategori</th>
                <th>Poin</th>
                <th>Status Konseling</th>
                <th>Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody>
              {myData.map((p, i) => (
                <tr key={p.id_pelanggaran_siswa}>
                  <td className="text-center">{i + 1}</td>
                  <td className="text-center">{p.tanggal_pelanggaran || "-"}</td>
                  <td>{p.jenis_pelanggaran?.nama_jenis_pelanggaran || "-"}</td>
                  <td>{p.jenis_pelanggaran?.kategori_pelanggaran || "-"}</td>
                  <td className="text-center">{p.jenis_pelanggaran?.poin_pelanggaran ?? "-"}</td>
                  <td className="text-center">
                    <span
                      className={`badge ${
                        p.status_konseling === "Selesai"
                          ? "bg-success"
                          : p.status_konseling === "Sedang"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {p.status_konseling || "-"}
                    </span>
                  </td>
                  <td>{p.tindak_lanjut || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-danger rounded mt-3 text-center">
            Data tidak ditemukan {" "}
            <i className="mx-1 fs-5 fa-brands fa-searchengin fa-bounce"></i>
          </div>
        )}
      </div>
    </div>
  );
}
