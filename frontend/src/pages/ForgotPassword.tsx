import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"
import { forgotPassword } from "../services/authService"

export function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess(false)

        if (!email) {
            setError("Email is required")
            return
        }

        setIsLoading(true)
        try {
            await forgotPassword(email)
            setSuccess(true)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || "Something went wrong")
            } else {
                setError("Something went wrong")
            }
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <main className="flex justify-center pt-16">
            <div className="w-full max-w-md rounded-lg border bg-white p-6">

            <p className="mb-6 text-center text-sm text-gray-600">Enter your email and we will send you a password reset link.</p>
            {success ? (
                <div className="space-y-4">
                    <p className="text-sm text-center text-gray-600">If an account exists with this email, a password reset link has been sent.</p>
                    <Link
                        to="/login"
                        className="block w-full rounded bg-black pc-4 py-2">
                        Back to Login
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium" >
                            Email
                        </label>
                        <input id="email" type="email" value={email} className="w-full rounded border px-3 py-2" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                    >
                        {isLoading ? "Sending..." : "Send reset link"}
                    </button>
                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                </form>
            )}
            {!success && (
                <p className="mt-4 text-center text-sm">

                    Remember your password?{" "}
                    <Link className="font-medium underline" to="/login"> Login </Link>

                </p>
            )}
        </div>
        </main >
    )
}