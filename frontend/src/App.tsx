import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Signup } from "./pages/Signup";
import { useState } from "react";
import { logout, type MeResponse } from "./services/authService";

export function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const isAuthenticated = accessToken !== null
  const [user, setUser] = useState<MeResponse["data"] | null>(null)

  const handleLogout = async () => {
    await logout()

    setAccessToken(null)
    setUser(null)
  }
  return (
    <Routes>
      <Route element={<Layout onLogout={handleLogout} />}>
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}> <Home /> </ProtectedRoute>
        } />
        <Route path="/login" element={<Login setAccessToken={setAccessToken} setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Route>
    </Routes>
  )
}