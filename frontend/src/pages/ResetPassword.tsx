import axios from "axios";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

export function ResetPassword() {

    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if(!token){
            setError("Invalid or missing reset token")
        }
        if(password.length < 8){
            setError("Password must be at least 9 characters")
            return
        }
        if(password !== confirmPassword){
            setError("Passwords do not match")
            return 
        }

        setIsLoading(true)

        try{
            await resetPassword(token, password)
            setSuccess(true)
        }catch(error){
            if(axios.isAxiosError(error)){
                setError(error.response?.data?.message || "Password reset failed")
            }else{
                setError("something went wrong")
            }
        }finally{
            setIsLoading(false)
        }
    }
    if(success){
        return(
            <main className="flex justify-center pt-16">
                <div className="w-full max-w-md rounded-lg border bg-white p-6">
                    <h1 className="mb-4 text-2xl font-bold text-center">
                        Password reset successful
                    </h1>
                    <button
                    onClick={() => navigate("/login")}
                    className="w-full rounded bg-black px-4 py-2 text-white">Go to Login</button>
                </div>
            </main>
        )
    }
    return (
        <main className="flex justify-center pt-16">
            <div className="w-full max-wd-md rounded-lg border bg-white p-6">
                <h1 className="mb-2 text-2xl font-bold text-center">
                    Reset password
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">New Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border px-3 py-2" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Confirm Password</label>
                        <input type="password" id="Confirmpassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded border px-3 py-2" />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full rounded bg-black px-4 py-2 text-white">
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                </form>
                <p className="mt-4 text-center text-sm">
                    <Link to="/login" className="font-medium underline">Back to Login</Link>
                </p>
            </div>
        </main>
    )
}