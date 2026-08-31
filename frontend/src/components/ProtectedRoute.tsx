import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface ProtectedRouteTypes {
    children: React.ReactNode,
}
export function ProtectedRoute({ children }: ProtectedRouteTypes) {
    const { accessToken, isAuthLoading} = useAuth()
    if(isAuthLoading){
        return <div>Loading...</div>
    }

    if(!accessToken){
        return <Navigate to="/login" replace />
    }
    return children
}