import { Navigate } from "react-router-dom"

interface ProtectedRouteTypes {
    children: React.ReactNode,
    isAuthenticated: Boolean
}
export function ProtectedRoute({ children, isAuthenticated }: ProtectedRouteTypes) {
    return (
        isAuthenticated ? children : <Navigate to="/login" />
    )
}