import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export function Home(){
    const { user } = useAuth()
    return (
        <div>
            <h1>Home</h1>
            <Link to="/login">Login</Link>
            <Link to={`/profile/${user?.username}`}>Profile</Link>
        </div>
    )
}