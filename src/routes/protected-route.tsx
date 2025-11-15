import { Navigate, Outlet } from "react-router-dom"
import { authStorage, isTokenValid } from "../services"

export function ProtectedRoute() {
    const access = authStorage.getAccessToken()

    if (!access || !isTokenValid(access)) {
        return <Navigate to="/login" replace />
    }
    
    return <Outlet />
}
