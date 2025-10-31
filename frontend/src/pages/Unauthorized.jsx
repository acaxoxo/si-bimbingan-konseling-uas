import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="container text-center mt-5">
      <h2>Akses Ditolak.</h2>
      <p>Kamu tidak punya izin untuk mengakses halaman ini.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
