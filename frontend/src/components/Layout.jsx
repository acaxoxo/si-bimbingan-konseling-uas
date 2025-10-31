import Header from "./partials/header";
import Footer from "./partials/footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, width: '100%', backgroundColor: 'var(--bg-secondary)' }}>
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}
