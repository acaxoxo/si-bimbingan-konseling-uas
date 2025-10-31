import React from "react";

export default function Loading({ label = "Memuat data..." }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="mt-2 text-muted small">{label}</div>
    </div>
  );
}
