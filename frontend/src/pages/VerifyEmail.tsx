import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { me, VerifyOtp, resendOtp } from "../services/authService"

export function VerifyEmail() {

    const { setUser } = useAuth()
    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [isResending, setIsResending] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        if (resendCooldown === 0) {
            return
        }
        const timer = setInterval(() => {
            setResendCooldown((current) => current - 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [resendCooldown])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (otp.length !== 6) {
            setError("OTP must be 6 digit")
            return
        }
        setIsLoading(true)
        try {

            await VerifyOtp(otp)
            const userResult = await me()
            setUser(userResult.data)
            if (userResult.data.emailVerified) {
                navigate("/")
            } else {
                navigate("/verify-email")
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message || "Email verification failed"
                )
            } else {
                setError("something went wrong")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handlResend = async() => {
        setError("")
        setIsResending(true)

        try{
            await resendOtp()
            setResendCooldown(30)
        }catch(error){
            if(axios.isAxiosError(error)){
                setError(
                    error.response?.data?.message || "Failed to resend OTP"
                )
            }else{
                setError("something went wrong")
            }
        }finally{
            setIsResending(false)
        }
    }
    return (
        <main className="flex justify-center pt-16">
            <div className="w-full max-w-md rounded-lg border bg-white p-6">
                <h1 className="mb-2 text-2xl font-bold text-center">
                    Verfiy your email
                </h1>
                <p className="mb-6 text-center text-sm text-gray-600">
                    Enter the 6-digit OTP sent to your email.
                </p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full rounded border px-3 py-2 text-center tracking-widest"
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black px-4 py-2 text-white disabled:opacity-50"
                    >
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </button>
                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}
                    <button 
                    type="button"
                    onClick={handlResend}
                    disabled={isResending || resendCooldown > 0}
                    className="w-full rounded border px-4 py-2 disabled:opacity-50">
                        {isResending 
                            ? "Sending..."
                            : resendCooldown > 0 
                                ? `Resend OTP in ${resendCooldown}s`
                                : "Resend OTP"}
                    </button>
                </form>
            </div>
        </main>
    )
}