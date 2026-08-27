interface NavbarProps {
    title: string
    onLogout: () => void
}

function Navbar({ title, onLogout }: NavbarProps) {
    return (
        <header className="border-b bg-white">
            <div className="mx-auto max-w-2xl px-4 py-4">
                <h1 className="text-xl font-bold">{title}</h1>
                <button onClick={onLogout}>Logout</button>
            </div>
        </header>
    )
}

export default Navbar