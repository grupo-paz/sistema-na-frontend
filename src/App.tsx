import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginPage } from "./pages/Login"
import { AdminDashboard } from "./pages/AdminDashboard"
import { ChangePasswordPage } from "./pages/ChangePassword"
import { ProtectedRoute } from "./routes/ProtectedRoute"
import "./App.css"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/alterar-senha" element={<ChangePasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<></>} />
      </Routes>
    </BrowserRouter>
  )
}
