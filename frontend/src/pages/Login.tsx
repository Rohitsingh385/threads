import { useState } from "react"
import { login, me } from "../services/authService"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { setApiAccessToken } from "../services/api"
import { useAuth } from "../context/AuthContext"

export function Login() {

    const { setAccessToken, setUser } = useAuth()

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
            setApiAccessToken(result.data.accessToken)
            const meResult = await me()
            setUser(meResult.data)
            if(meResult.data.emailVerified){
                navigate("/")
            }else{
                navigate("/verify-email")
            }
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
        <main className="flex justify-center pt-16">
            <div className="w-full max-w-md rounded-lg border bg-white p-6">

                <h1 className="mb-6 text-2xl font-bold text-center">
                    Welcome back
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label
                            className="mb-1 block text-sm font-medium"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    email: e.target.value
                                })
                            }}
                            className="w-full rounded border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor=""
                            className="mb-1 block text-sm font-medium"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    password: e.target.value
                                })
                            }}
                            className="w-full rounded border px-3 py-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                    >
                        {isLoading ? "Logging..." : "Login"}
                    </button>

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                </form>

                <p className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <Link to="/signup" className="font-medium underline">
                        Sign up
                    </Link>
                </p>

            </div>
        </main>
    )

}