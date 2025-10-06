import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminProfile } from "./pages/AdminProfile";
import { AdminAdministrators } from "./pages/AdminAdministrators";
import { DefinePasswordPage } from "./pages/DefinePasswordPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { RootRedirect } from "./routes/RootRedirect";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/define-password" element={<DefinePasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/perfil" element={<AdminProfile />} />
          <Route path="/admin/administradores" element={<AdminAdministrators />} />
        </Route>
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
