import React from "react";

export default function Footer() {
  return (
    <footer 
      className="mt-auto py-3 border-top" 
      style={{ 
        background: 'var(--bg-card)', 
        borderColor: 'var(--border-light)' 
      }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              © 2025 SMK Negeri 1 Kupang - Sistem Bimbingan Konseling
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
              Version 1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
