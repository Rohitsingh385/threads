import { ProfileHeader } from "../components/ProfileHeader";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
export function Profile() {

    const { user } = useAuth()
    if (!user) {
        return <div>Loading....</div>
    }
    return (
        <>
            <ProfileHeader
                username={user.username}
                email={user.email}
                bio={user.bio}
                avatarUrl={user.avatarUrl}
                threadsCount={user.threadsCount}
                followersCount={user.followersCount}
                followingCount={user.followingCount}
            />
            <Link to="/profile/edit" 
                className="mt-4 inline-block rounded border px-4 py-2"
            >
                Edit Profile
            </Link>
            </>
    )
}