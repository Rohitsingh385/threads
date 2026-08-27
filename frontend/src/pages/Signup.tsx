import { useState } from "react";
import { signup } from "../services/authService";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
        <form onSubmit={handleSubmit}>
            <label htmlFor="">Username</label><input
                className="border-b"
                value={formdata.username}
                onChange={(e) => {
                    setFormData({
                        ...formdata,
                        username: e.target.value
                    })
                }}

            />
            <label htmlFor="">email</label><input
                className="border-b"
                value={formdata.email}
                onChange={(e) => {
                    setFormData({
                        ...formdata,
                        email: e.target.value
                    })
                }}
            />
            <label htmlFor="">password</label> <input
                className="border-b"
                value={formdata.password}
                onChange={(e) => {
                    setFormData({
                        ...formdata,
                        password: e.target.value
                    })
                }}
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Signing up...." : "Sign up"}
            </button>
            {error && <p>{error}</p>}
        </form>
    )
}