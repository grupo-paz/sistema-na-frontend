import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/perfil", { replace: true });
  }, [navigate]);

  return null;
}
