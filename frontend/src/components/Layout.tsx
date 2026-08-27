import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

interface LayoutProps {
    onLogout: () => void
}
export function Layout({ onLogout }: LayoutProps){
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar title="Threads" onLogout={onLogout}/>

            <main className="mx-auto max-w-2xl px-4 py-6">
                <Outlet />
            </main>
        </div>
    )
}