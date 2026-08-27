import { useState } from "react"
import { login, me, type MeResponse } from "../services/authService"
import axios from "axios"
import { useNavigate } from "react-router-dom"
interface LoginProps {
    setAccessToken: (token: string) => void
    setUser: (user: MeResponse["data"]) => void
}
export function Login({ setAccessToken, setUser }: LoginProps) {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()
        setError("")

        if (formData.password.length < 8) {
            setError("password must be atleast 8 characters")
            return
        }
        setIsLoading(true)

        try {
            const result = await login(formData)
            setAccessToken(result.data.accessToken)
            const meResult = await me()
            setUser(meResult.data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Login Failed')
            } else {
                setError('Something went wrong')
            }
        } finally {
            setIsLoading(false)
        }

    }
    return (
        <form onSubmit={handleSubmit} >
            <input
                className="border-b"
                value={formData.email}
                onChange={(e) => {
                    setFormData({
                        ...formData,
                        email: e.target.value
                    })
                }}
            />
            <input
                className="border-b"
                value={formData.password}
                onChange={(e) => {
                    setFormData({
                        ...formData,
                        password: e.target.value
                    })
                }}
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging...' : 'Login'}
            </button>
            {error && <p>{error}</p>}
        </form>
    )

}