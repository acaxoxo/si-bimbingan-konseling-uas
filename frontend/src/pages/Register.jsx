import { useState } from "react";
import api from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validateEmail, validatePassword } from "../utils/validation";
import ThemeToggle from "../components/ThemeToggle";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({ isValid: true, errors: [] });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      const validation = validatePassword(value);
      setPasswordStrength(validation);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const emailValidation = validateEmail(form.email);
    if (!emailValidation.isValid) {
      toast.error(emailValidation.error);
      setError(emailValidation.error);
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(form.password);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.errors.join(", "));
      setError(passwordValidation.errors.join(", "));
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak sama");
      setError("Password dan konfirmasi password tidak sama");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", {
        email: form.email,
        password: form.password,
        role: form.role
      });
      toast.success("Registrasi berhasil! Silakan login.");
      setSuccess("Registrasi berhasil! Silakan login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Gagal mendaftar";
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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
      {}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        <ThemeToggle />
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="auth-form p-4 rounded"
        style={{ 
          width: '100%',
          maxWidth: '400px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
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
            <i className="fa-solid fa-user-plus text-white" style={{ fontSize: '2.5rem' }}></i>
          </div>
          <h2 className="mb-2 fw-bold" style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>
            Create New Account
          </h2>
          <p className="mb-0" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Counseling System of SMK 1 Kupang
          </p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '0.65rem 0.75rem',
              fontSize: '0.95rem',
            }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '0.65rem 0.75rem',
              fontSize: '0.95rem',
            }}
          />
          {!passwordStrength.isValid && form.password && (
            <div className="small mt-1" style={{ color: 'var(--error)', fontSize: '0.8rem' }}>
              {passwordStrength.errors.map((err, i) => (
                <div key={i}>• {err}</div>
              ))}
            </div>
          )}
          <small className="d-block mt-1" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            Minimum 8 characters, combination of letters and numbers
          </small>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '0.65rem 0.75rem',
              fontSize: '0.95rem',
            }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Role
          </label>
          <select
            name="role"
            className="form-select"
            value={form.role}
            onChange={handleChange}
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

        {error && (
          <div 
            className="alert py-2 mb-3" 
            style={{ 
              fontSize: '0.875rem', 
              borderRadius: '8px',
              background: 'var(--error-light)',
              color: 'var(--error)',
              border: '1px solid var(--error)'
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div 
            className="alert py-2 mb-3" 
            style={{ 
              fontSize: '0.875rem', 
              borderRadius: '8px',
              background: 'var(--success-light)',
              color: 'var(--success)',
              border: '1px solid var(--success)'
            }}
          >
            {success}
          </div>
        )}

        <button 
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
              <i className="fa-solid fa-user-plus me-2"></i>
              Register
            </>
          )}
        </button>

        <div className="text-center mt-3">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
          </span>
        </div>

        <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
          <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            © 2025 SMK Negeri 1 Kupang. All rights reserved.
          </small>
        </div>
      </form>
    </div>
  );
}
