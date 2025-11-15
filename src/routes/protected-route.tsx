import { Navigate, Outlet } from "react-router-dom"
import { authStorage, isTokenValid } from "../services" 

export function ProtectedRoute() {
    const access = authStorage.getAccessToken()

    if (!access) {
        return <Navigate to="/login" replace />
    }
    
    if (!isTokenValid(access)) {

        authStorage.clearTokens(); 
        
        return <Navigate to="/login" replace />
    }
    return <Outlet />
}
