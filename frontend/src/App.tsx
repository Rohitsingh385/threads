import { Routes, Route, useNavigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Signup } from "./pages/Signup";
import { logout } from "./services/authService";
import { useAuth } from "./context/AuthContext";
import { setApiAccessToken } from "./services/api";
import { EditProfile } from "./pages/EditProfile";
import { UserProfile } from "./pages/UserProfile";
import { CreateThread } from "./pages/CreateThread";
import { Thread } from "./pages/Thread";

export function App() {
  const { setAccessToken, setUser } = useAuth()

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      setAccessToken(null)
      setUser(null)
      setApiAccessToken(null)
      navigate("/login")
    }
  }
  return (
    <Routes>
      <Route element={<Layout onLogout={handleLogout} />}>
        <Route path="/" element={
          <ProtectedRoute> <Home /> </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>} />
        <Route
          path="/profile/:username"
          element={
            <UserProfile />
          }
        />
        <Route
          path="/threads/create"
          element={
            <ProtectedRoute>
              <CreateThread />
            </ProtectedRoute>
          }
        />
        <Route path="/threads/:id" element={<Thread/>} />
      </Route>
    </Routes>
  )
}