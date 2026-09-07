import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getUnreadCount } from "../services/NotificationService"
import { useAuth } from "../context/AuthContext"
interface NavbarProps {
    title: string
    onLogout: () => void
}

function Navbar({ title, onLogout }: NavbarProps) {
    const { user, isAuthLoading } = useAuth()

    const [unreadCount, setUnreadCount] = useState(0)
    const [error, setError] = useState("")
    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (isAuthLoading || !user) return
            try {
                const result = await getUnreadCount()
                setUnreadCount(result.data)
            } catch (error) {
                setError("unable to fetch notifications")
            }
        }
        fetchUnreadCount()
    }, [user, isAuthLoading])
    return (
        <header className="border-b bg-white">
            <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
                <Link to="/" className="text-xl font-bold">
                    {title}
                </Link>
                <nav className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link to="/">
                                Home
                            </Link>
                            <Link to="/search">
                                Search
                            </Link>
                            <Link to="/notifications">
                                Notifications ({unreadCount})
                            </Link>
                            <button onClick={onLogout}>
                                Logout
                            </button>
                        </>
                    ): (
                        <>
                        <Link to="/login">
                            Login
                        </Link>
                        <Link to="/signup">
                            Sign up
                        </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar