import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../ThemeToggle";

export default function Header() {
  const { user, logout } = useAuth(); 

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent border-bottom">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="fa-solid fa-graduation-cap me-2"></i>
          SI Konseling SMK 1 Kupang
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul
            className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
            style={{ "--bs-scroll-height": "100px" }}
          >
            {user?.role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link active" to="/admin">
                    <i className="fa-solid fa-house me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa-solid fa-database me-1"></i>
                    Data Master
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/admin/data/admin">
                      <i className="fa-solid fa-user-shield me-2 text-primary"></i>Administrator
                    </Link></li>
                    <li><Link className="dropdown-item" to="/admin/data/guru">
                      <i className="fa-solid fa-chalkboard-user me-2 text-dark"></i>Guru BK
                    </Link></li>
                    <li><Link className="dropdown-item" to="/admin/data/siswa">
                      <i className="fa-solid fa-user-graduate me-2 text-warning"></i>Siswa
                    </Link></li>
                    <li><Link className="dropdown-item" to="/admin/data/orang-tua">
                      <i className="fa-solid fa-users me-2 text-success"></i>Orang Tua
                    </Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="/admin/data/kelas">
                      <i className="fa-solid fa-door-open me-2 text-info"></i>Kelas
                    </Link></li>
                    <li><Link className="dropdown-item" to="/admin/data/jenis-pelanggaran">
                      <i className="fa-solid fa-triangle-exclamation me-2 text-danger"></i>Jenis Pelanggaran
                    </Link></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/laporan">
                    <i className="fa-solid fa-file-lines me-1"></i>
                    Laporan
                  </Link>
                </li>
              </>
            )}

            {user?.role === "guru" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link active" to="/guru">
                    <i className="fa-solid fa-house me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/guru/data/pelanggaran-siswa/add">
                    <i className="fa-solid fa-triangle-exclamation me-1"></i>
                    Input Pelanggaran
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/guru/laporan">
                    <i className="fa-solid fa-file-lines me-1"></i>
                    Laporan
                  </Link>
                </li>
              </>
            )}

            {user?.role === "siswa" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link active" to="/siswa">
                    <i className="fa-solid fa-house me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/siswa/pelanggaran">
                    <i className="fa-solid fa-clipboard-list me-1"></i>
                    Pelanggaran Saya
                  </Link>
                </li>
              </>
            )}

            {user?.role === "orangtua" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link active" to="/orangtua">
                    <i className="fa-solid fa-house me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/orangtua/laporan-anak">
                    <i className="fa-solid fa-comments me-1"></i>
                    Laporan & Tanggapan
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {}
            <ThemeToggle />
            
            {user ? (
              <>
                <span className="navbar-text me-3">
                  <i className="fa-solid fa-user-circle me-1"></i>
                  <strong>{user.name || user.email}</strong>
                  <span className="badge bg-light text-primary ms-2">{user.role}</span>
                </span>
                <button
                  className="btn btn-outline-dark btn-sm"
                  onClick={logout}
                >
                  <i className="fa-solid fa-right-from-bracket me-1"></i>
                  Logout
                </button>
              </>
            ) : (
              <Link className="btn btn-light btn-sm" to="/login">
                <i className="fa-solid fa-right-to-bracket me-1"></i>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
