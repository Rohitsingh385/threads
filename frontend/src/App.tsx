import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Signup } from "./pages/Signup";
import { logout} from "./services/authService";
import { useAuth } from "./context/AuthContext";
import { setApiAccessToken } from "./services/api";

export function App() {
  const {setAccessToken, setUser} = useAuth()
 

  const handleLogout = async () => {
   try{
    await logout()
   }finally{
    setAccessToken(null)
    setUser(null)
    setApiAccessToken(null)
   }
  }
  return (
    <Routes>
      <Route element={<Layout onLogout={handleLogout} />}>
        <Route path="/" element={
          <ProtectedRoute> <Home /> </ProtectedRoute>
        } />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Route>
    </Routes>
  )
}