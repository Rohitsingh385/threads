import { useParams } from "react-router-dom"

export function Profile() {
    const { username } = useParams()
    return (
        <div>
            <h1>Profile: {username}</h1>
        </div>
    )
}