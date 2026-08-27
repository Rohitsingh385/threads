import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

export function Layout(){
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar title="Threads"/>

            <main className="mx-auto max-w-2xl px-4 py-6">
                <Outlet />
            </main>
        </div>
    )
}