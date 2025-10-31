import { Link } from "react-router-dom";

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {items.map((item, i) => (
          <li
            key={i}
            className={`breadcrumb-item ${item.active ? "active" : ""}`}
            aria-current={item.active ? "page" : undefined}
          >
            {item.active ? (
              item.label
            ) : (
              <Link to={item.path}>
                {item.icon && <i className={`${item.icon} me-1`}></i>}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
