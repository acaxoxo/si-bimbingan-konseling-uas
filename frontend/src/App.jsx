import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DashboardGuru from "./pages/guru/DashboardGuru";
import DashboardOrangTua from "./pages/orangTua/DashboardOrangTua";
import DashboardSiswa from "./pages/siswa/DashboardSiswa";
import Unauthorized from "./pages/Unauthorized";
import Register from "./pages/Register";
import DataAdmin from "./pages/admin/DataAdmin";
import LaporanPelanggaran from "./pages/admin/LaporanPelanggaran";
import DataSiswa from "./pages/siswa/DataSiswa";
import DetailSiswa from "./pages/siswa/DetailSiswa";
import DataGuru from "./pages/guru/DataGuru";
import DataOrangTua from "./pages/orangTua/DataOrangTua";
import DetailOrangTua from "./pages/orangTua/DetailOrangTua";
import DataKelas from "./pages/kelas/DataKelas";
import DetailKelas from "./pages/kelas/DetailKelas";
import DataJenisPelanggaran from "./pages/JenisPelanggaran/DataJenisPelanggaran";
import DetailJenisPelanggaran from "./pages/JenisPelanggaran/DetailJenisPelanggaran";
import AddAdmin from "./pages/admin/AddAdmin";
import EditAdmin from "./pages/admin/EditAdmin";
import AddSiswa from "./pages/siswa/AddSiswa";
import EditSiswa from "./pages/siswa/EditSiswa";
import AddGuru from "./pages/guru/AddGuru";
import EditGuru from "./pages/guru/EditGuru";
import AddOrangTua from "./pages/orangTua/AddOrangTua";
import EditOrangTua from "./pages/orangTua/EditOrangTua";
import AddKelas from "./pages/kelas/AddKelas";
import EditKelas from "./pages/kelas/EditKelas";
import AddJenisPelanggaran from "./pages/JenisPelanggaran/AddJenisPelanggaran";
import EditJenisPelanggaran from "./pages/JenisPelanggaran/EditJenisPelanggaran";
import DataPelanggaranSiswa from "./pages/pelanggaranSiswa/DataPelanggaranSiswa";
import AddPelanggaranSiswa from "./pages/pelanggaranSiswa/AddPelanggaranSiswa";
import EditPelanggaranSiswa from "./pages/pelanggaranSiswa/EditPelanggaranSiswa";
import DetailPelanggaranSiswa from "./pages/pelanggaranSiswa/DetailPelanggaranSiswa";
import DataTanggapan from "./pages/guru/DataTanggapan";
import LaporanGuru from "./pages/guru/LaporanGuru";
import DataGuruOrangTua from "./pages/orangTua/DataGuruOrangTua";
import DataKelasOrangTua from "./pages/orangTua/DataKelasOrangTua";
import DataJenisPelanggaranOrangtua from "./pages/orangTua/DataJenisPelanggaranOrangtua";
import LaporanAnakSaya from "./pages/orangTua/LaporanAnakSaya";
import DataGuruSiswa from "./pages/siswa/DataGuruSiswa";
import DataKelasSiswa from "./pages/siswa/DataKelasSiswa";
import DataJenisPelanggaranSiswa from "./pages/siswa/DataJenisPelanggaranSiswa";
import TindakanSiswa from "./pages/siswa/TindakanSiswa";
import PelanggaranSaya from "./pages/siswa/PelanggaranSaya";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Routes>
          {}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {}
          <Route element={<Layout />}>
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <DashboardAdmin />
                </ProtectedRoute>
              }
            />

            {}
            <Route
              path="/admin/laporan"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <LaporanPelanggaran />
                </ProtectedRoute>
              }
            />

            {}
            <Route
              path="/admin/data/siswa"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <DataSiswa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/siswa/:id"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <DetailSiswa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/guru"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <DataGuru />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/orang-tua"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <DataOrangTua />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/orang-tua/:id"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <DetailOrangTua />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/kelas"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <DataKelas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/kelas/:id"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <DetailKelas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/jenis-pelanggaran"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <DataJenisPelanggaran />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/jenis-pelanggaran/:id"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <DetailJenisPelanggaran />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <DataAdmin />
                </ProtectedRoute>
              }
            />

            {}
            <Route
              path="/admin/data/admin/add"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AddAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/admin/edit/:id"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <EditAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/siswa/add"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AddSiswa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/siswa/edit/:id"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <EditSiswa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/guru/add"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AddGuru />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/guru/edit/:id"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <EditGuru />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/orang-tua/add"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AddOrangTua />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/orang-tua/edit/:id"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <EditOrangTua />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/kelas/add"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AddKelas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/kelas/edit/:id"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <EditKelas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data/jenis-pelanggaran/add"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AddJenisPelanggaran />
                </ProtectedRoute>
              }
            />
              <Route
                path="/admin/data/jenis-pelanggaran/edit/:id"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <EditJenisPelanggaran />
                  </ProtectedRoute>
                }
              />

            <Route
              path="/guru"
              element={
                <ProtectedRoute roles={["guru"]}>
                  <DashboardGuru />
                </ProtectedRoute>
              }
            />

            {}
            <Route
              path="/guru/data/pelanggaran-siswa"
              element={
                <ProtectedRoute roles={["guru"]}>
                  <DataPelanggaranSiswa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guru/data/pelanggaran-siswa/add"
              element={
                <ProtectedRoute roles={["guru"]}>
                  <AddPelanggaranSiswa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guru/data/pelanggaran-siswa/:id"
              element={
                <ProtectedRoute roles={["guru"]}>
                  <DetailPelanggaranSiswa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guru/data/pelanggaran-siswa/edit/:id"
              element={
                <ProtectedRoute roles={["guru"]}>
                  <EditPelanggaranSiswa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guru/data/tanggapan"
              element={
                <ProtectedRoute roles={["guru"]}>
                  <DataTanggapan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guru/laporan"
              element={
                <ProtectedRoute roles={["guru"]}>
                  <LaporanGuru />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orangtua"
              element={
                <ProtectedRoute roles={["orangtua"]}>
                  <DashboardOrangTua />
                </ProtectedRoute>
              }
            />

            {}
            <Route
              path="/orangtua/data/guru"
              element={
                <ProtectedRoute roles={["orangtua"]}>
                  <DataGuruOrangTua />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orangtua/data/kelas"
              element={
                <ProtectedRoute roles={["orangtua"]}>
                  <DataKelasOrangTua />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orangtua/data/jenis-pelanggaran"
              element={
                <ProtectedRoute roles={["orangtua"]}>
                  <DataJenisPelanggaranOrangtua />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orangtua/laporan-anak"
              element={
                <ProtectedRoute roles={["orangtua"]}>
                  <LaporanAnakSaya />
                </ProtectedRoute>
              }
            />

            <Route
              path="/siswa"
              element={
                <ProtectedRoute roles={["siswa"]}>
                  <DashboardSiswa />
                </ProtectedRoute>
              }
            />

            {}
            <Route
              path="/siswa/data/guru"
              element={
                <ProtectedRoute roles={["siswa"]}>
                  <DataGuruSiswa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/siswa/data/kelas"
              element={
                <ProtectedRoute roles={["siswa"]}>
                  <DataKelasSiswa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/siswa/data/jenis-pelanggaran"
              element={
                <ProtectedRoute roles={["siswa"]}>
                  <DataJenisPelanggaranSiswa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/siswa/tindakan"
              element={
                <ProtectedRoute roles={["siswa"]}>
                  <TindakanSiswa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/siswa/pelanggaran"
              element={
                <ProtectedRoute roles={["siswa"]}>
                  <PelanggaranSaya />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
