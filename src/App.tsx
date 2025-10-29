import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute, RootRedirect } from "./routes";
import { AdminAdministrators, Admin, AdminProfile, AdminMeetings, DefinePassword, LoginPage, AdminChangePassword, AdminSecretary, ForgotPassword, AdminEvents } from "./pages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/define-password" element={<DefinePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/admin/perfil" element={<AdminProfile />} />
          <Route path="/admin/perfil/alterar-senha" element={<AdminChangePassword />} />
          <Route path="/admin/administradores" element={<AdminAdministrators />} />
          <Route path="/admin/secretaria" element={<AdminSecretary />} />
          <Route path="/admin/eventos" element={<AdminEvents />} />
          <Route path="/admin/reunioes" element={<AdminMeetings />} />
        </Route>
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
