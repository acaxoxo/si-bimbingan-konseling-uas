import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { validateEmail, validateRequired } from "../utils/validation";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [localError, setLocalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const formContainerRef = useRef(null);
  const handleSubmitRef = useRef(null);

  const handleSubmit = async () => {
    setLocalError("");
    setFieldErrors({});

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setFieldErrors({ email: emailValidation.error });
      setLocalError(emailValidation.error);
      return;
    }

    const passwordValidation = validateRequired(password, "Password");
    if (!passwordValidation.isValid) {
      setFieldErrors({ password: passwordValidation.error });
      setLocalError(passwordValidation.error);
      return;
    }

    setLoading(true);

    try {
      const decoded = await login(email, password, role);

      if (decoded) {
        setLoading(false);
        toast.success(`Selamat datang, ${decoded.email}!`);
        const userRole = decoded.role;
        if (userRole === "admin") navigate("/admin");
        else if (userRole === "guru") navigate("/guru");
        else if (userRole === "orangtua" || userRole === "ortu") navigate("/orangtua");
        else if (userRole === "siswa") navigate("/siswa");
        else navigate("/");
      } else {
        setLoading(false);
        const errorMsg = "Email atau password salah. Silakan coba lagi.";
        setLocalError(errorMsg);
        setFieldErrors({ email: true, password: true });
      }
    } catch (err) {
      setLoading(false);
      const errorMsg = err.response?.data?.message || err.message || "Email atau password salah. Silakan coba lagi.";
      setLocalError(errorMsg);
      setFieldErrors({ email: true, password: true });
    }
  };

  handleSubmitRef.current = handleSubmit;

  useEffect(() => {
    const container = formContainerRef.current;
    if (!container) return;

    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.keyCode === 13) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.returnValue !== undefined) {
          e.returnValue = false;
        }
        
        if (handleSubmitRef.current) {
          handleSubmitRef.current();
        }
        return false;
      }
    };

    container.addEventListener("keydown", handleKeyDown, { capture: true, passive: false });

    return () => {
      container.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, []); 

  return (
    <div
      className="auth-page d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'var(--bg-secondary)',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        <ThemeToggle />
      </div>

      <div
        ref={formContainerRef}
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          opacity: loading ? 0.8 : 1,
          transition: 'opacity 0.3s ease',
        }}
        className="auth-form p-4 rounded"
        onKeyDownCapture={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            if (e.nativeEvent) {
              e.nativeEvent.stopImmediatePropagation();
            }
            handleSubmit();
            return false;
          }
        }}
      >
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{
              width: '80px',
              height: '80px',
              background: 'var(--accent-primary)',
              boxShadow: '0 4px 12px var(--accent-light)'
            }}
          >
            <i className="fa-solid fa-graduation-cap text-white" style={{ fontSize: '2.5rem' }}></i>
          </div>
          <h2 className="mb-2 fw-bold" style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>
            Sign in to the System
          </h2>
          <p className="mb-0" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Counseling System of SMK 1 Kupang
          </p>
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label fw-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Role
          </label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            name="role"
            id="role"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '0.65rem 0.75rem',
              fontSize: '0.95rem',
            }}
          >
            <option value="admin">Admin</option>
            <option value="guru">Guru</option>
            <option value="siswa">Siswa</option>
            <option value="orangtua">Orang Tua</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            E-Mail
          </label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors({ ...fieldErrors, email: null });
              setLocalError("");
            }}
            name="email"
            id="email"
            autoComplete="email"
            placeholder="Enter your email"
            required
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: fieldErrors.email ? '2px solid var(--error)' : '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '0.65rem 0.75rem',
              fontSize: '0.95rem',
            }}
          />
          {fieldErrors.email && typeof fieldErrors.email === 'string' && (
            <small className="d-block mt-1" style={{ color: 'var(--error)', fontSize: '0.75rem' }}>
              <i className="fa-solid fa-circle-exclamation me-1"></i>
              {fieldErrors.email}
            </small>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label fw-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Password
          </label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors({ ...fieldErrors, password: null });
              setLocalError("");
            }}
            name="password"
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: fieldErrors.password ? '2px solid var(--error)' : '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '0.65rem 0.75rem',
              fontSize: '0.95rem',
            }}
          />
          {fieldErrors.password && typeof fieldErrors.password === 'string' && (
            <small className="d-block mt-1" style={{ color: 'var(--error)', fontSize: '0.75rem' }}>
              <i className="fa-solid fa-circle-exclamation me-1"></i>
              {fieldErrors.password}
            </small>
          )}
        </div>

        {localError && (
          <div
            className="alert d-flex align-items-center mb-3"
            role="alert"
            style={{
              fontSize: '0.875rem',
              borderRadius: '8px',
              background: 'var(--error-light)',
              color: 'var(--error)',
              border: '2px solid var(--error)',
              padding: '0.75rem 1rem',
              animation: 'shake 0.5s'
            }}
          >
            <i className="fa-solid fa-circle-exclamation me-2" style={{ fontSize: '1.2rem' }}></i>
            <div className="flex-grow-1">
              <strong className="d-block mb-1">Login Gagal</strong>
              {localError}
            </div>
          </div>
        )}

        {}
        <button
          type="button"
          onClick={handleSubmit}
          className="btn btn-primary w-100 fw-semibold"
          disabled={loading}
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '1rem',
            background: loading ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
            border: 'none',
            color: '#ffffff',
            boxShadow: loading ? 'none' : '0 4px 12px var(--accent-light)',
            transition: 'all 0.3s ease',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            <>
              <i className="fa-solid fa-right-to-bracket me-2"></i>
              Sign In
            </>
          )}
        </button>

        <div className="text-center mt-3">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 500 }}>Register</Link>
          </span>
        </div>

        <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
          <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            © 2025 SMK Negeri 1 Kupang. All rights reserved.
          </small>
        </div>
      </div>
    </div>
  );
}
