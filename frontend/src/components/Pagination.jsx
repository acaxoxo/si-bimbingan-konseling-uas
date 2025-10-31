import React from "react";

export default function Pagination({ currentPage, totalItems, pageSize = 10, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return null;

  const go = (p) => {
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
  };

  const pages = [];
  const maxButtons = 5; // show up to 5 page buttons
  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav aria-label="Pagination">
      <ul className="pagination justify-content-end mb-0">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => go(1)} aria-label="First">«</button>
        </li>
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => go(currentPage - 1)} aria-label="Previous">‹</button>
        </li>
        {pages[0] > 1 && (
          <li className="page-item disabled"><span className="page-link">...</span></li>
        )}
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
            <button className="page-link" onClick={() => go(p)}>{p}</button>
          </li>
        ))}
        {pages[pages.length - 1] < totalPages && (
          <li className="page-item disabled"><span className="page-link">...</span></li>
        )}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => go(currentPage + 1)} aria-label="Next">›</button>
        </li>
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => go(totalPages)} aria-label="Last">»</button>
        </li>
      </ul>
    </nav>
  );
}
