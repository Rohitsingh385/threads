import { useState } from "react";
import { signup } from "../services/authService";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
export function Signup() {

    const [formdata, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })

    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (formdata.username.length < 3) {
            setError("username must be atleast 3 characters")
            return
        }
        if (formdata.password.length < 8) {
            setError("password must be atleast 8 characters")
            return
        }
        setLoading(true)
        try {
            const response = await signup(formdata)
            console.log(response)
            navigate('/login')
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || "signup failed")
            } else {
                setError("Something went wrong")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex justify-center pt-16">
            <div className="w-full max-w-md rounded-lg border bg-white p-6">
                <h1 className="mb-6 text-2xl font-bold text-center">Welcome Back</h1>


                <form onSubmit={handleSubmit} className="space-y-4">

                    <label className="mb-1 block text-sm font-medium">Username</label>

                    <input
                        className="w-full rounded border px-3 py-2"
                        value={formdata.username}
                        onChange={(e) => {
                            setFormData({
                                ...formdata,
                                username: e.target.value
                            })
                        }}

                    />
                    <label
                        className="mb-1 block text-sm font-medium">
                        email
                    </label>
                    <input
                        className="w-full rounded border px-3 py-2"
                        value={formdata.email}
                        onChange={(e) => {
                            setFormData({
                                ...formdata,
                                email: e.target.value
                            })
                        }}
                    />
                    <label className="mb-1 block text-sm font-medium">
                        password
                    </label>
                    <input
                        className="w-full rounded border px-3 py-2"
                        value={formdata.password}
                        onChange={(e) => {
                            setFormData({
                                ...formdata,
                                password: e.target.value
                            })
                        }}
                    />
                    <button className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50" type="submit" disabled={isLoading}>
                        {isLoading ? "Signing up...." : "Sign up"}
                    </button>
                    {error && <p>{error}</p>}
                </form>
                <p className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium underline">Login</Link>
                </p>
            </div>
        </main>
    )
}