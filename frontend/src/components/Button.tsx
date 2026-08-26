
interface ButtonTypes {
    children: React.ReactNode,
    onClick: () => void
}
export function Button({ children, onClick }: ButtonTypes) {
    return (
        <button className="px-2 py-1 rounded-sm bg-blue-400" onClick={onClick}>
            {children}
        </button>
    )
}