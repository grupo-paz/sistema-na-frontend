import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./routes"; 
import { AdminAdministrators, Admin, AdminProfile, AdminMeetings, DefinePassword, Home, LoginPage, AdminChangePassword, AdminSecretary, ForgotPassword, SecretaryPage, EventsPage, MeetingsPage } from "./pages";

const DomainChecker = () => {
    const hostname = window.location.hostname;

    if (hostname.includes('admin')) {
        return <Navigate to="/login" replace />;
    }
    
    return <Home />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {}
        <Route path="/" element={<DomainChecker />} />
        
        {/* Rotas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/define-password" element={<DefinePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/secretaria" element={<SecretaryPage />} />
        <Route path="/eventos" element={<EventsPage />} />
        <Route path="/reunioes" element={<MeetingsPage />} />
        
        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/admin/perfil" element={<AdminProfile />} />
          <Route path="/admin/perfil/alterar-senha" element={<AdminChangePassword />} />
          <Route path="/admin/administradores" element={<AdminAdministrators />} />
          <Route path="/admin/secretaria" element={<AdminSecretary />} />
          <Route path="/admin/eventos" element={<AdminEvents />} />
          <Route path="/admin/reunioes" element={<AdminMeetings />} />
        </Route>
        
        {/* Rota Catch-all (qualquer outra rota inválida, volta para a Home) */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}