import { Navigate, Outlet } from "react-router-dom"
import { authStorage } from "../services"

export function ProtectedRoute() {
    const access = authStorage.getAccessToken()

    if (!access) {
        return <Navigate to="/login" replace />
    }
    return <Outlet />
}
