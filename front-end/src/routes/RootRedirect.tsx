import { Navigate } from "react-router-dom";
import { authStorage } from "../services/api";

export function RootRedirect() {
  const hasToken = authStorage.getAccessToken();

  if (hasToken) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/login" replace />;
}
