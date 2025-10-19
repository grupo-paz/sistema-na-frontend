import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute, RootRedirect } from "./routes";
import { AdminAdministrators, Admin, AdminProfile, AdminDefinePassword, LoginPage, ChangePasswordPage } from "./pages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/define-password" element={<AdminDefinePassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/admin/perfil" element={<AdminProfile />} />
          <Route path="/admin/perfil/alterar-senha" element={<ChangePasswordPage />} />
          <Route path="/admin/administradores" element={<AdminAdministrators />} />
        </Route>
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
