import Header from "./partials/header";
import Footer from "./partials/footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
  // Root: using Bootstrap utilities (d-flex, flex-column, min-vh-100)
  // so footer can be pushed to bottom when content is short.
  <div className="d-flex flex-column min-vh-100">
      <Header />

      {/*
        Main should take remaining space. Use an inner flex container so that
        if a page renders a sidebar + content, they can live inside this area
        and the footer will still stay below.
      */}
      <main className="flex-fill pb-4" style={{ backgroundColor: 'var(--bg-secondary)' }} role="main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
