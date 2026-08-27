import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={true}> <Home /> </ProtectedRoute>
          } />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Route>
    </Routes>
  )
}