import { createContext, useContext, useState, type ReactNode } from "react";
import { useEffect } from "react";
import { me, refreshAccessToken } from "../services/authService";
import { setApiAccessToken } from "../services/api";

interface User {
    username: string
    email: string
    role: string
    emailVerified: boolean
    bio: string | null
    avatarUrl: string | null
    avatarPublicId: string | null
}

interface AuthContextType {
    accessToken: string | null
    user: User | null
    isAuthLoading: boolean
    setAccessToken: (token: string | null) => void
    setUser: (user: User | null) => void
    setIsAuthLoading: (loading: boolean) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [isAuthLoading, setIsAuthLoading] = useState(true)

    useEffect(() => {
        const initializeAuth = async () => {
            try {

                const result = await refreshAccessToken()

                const token = result.data.accessToken 

                setAccessToken(token)
                setApiAccessToken(token)

                const userResult = await me()
                setUser(userResult.data)
            } catch (error) {
                setAccessToken(null)
                setUser(null)
            } finally {
                setIsAuthLoading(false)
            }
        }
        initializeAuth()
    }, [])
    return (
        <AuthContext.Provider
            value={{
                accessToken,
                user,
                isAuthLoading,
                setAccessToken,
                setUser,
                setIsAuthLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("UseAuth must be used within AuthProvider")
    }

    return context
}