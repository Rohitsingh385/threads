import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProfile, type UserProfile as UserProfileData } from "../services/profileService";
import { ProfileHeader } from "../components/ProfileHeader";

export function UserProfile(){
    const {username} = useParams<{username: string}>()

    const [profile, setProfile] = useState<UserProfileData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    useEffect(()=> {
        const fetchProfile = async() => {
            if(!username) return

            try{
                setIsLoading(true)
                setError("")

                const result = await getProfile(username)
                setProfile(result.data)
            }catch(error){
                setError("Unable to load profile picture")
            }finally{
                setIsLoading(false)
            }
        }
        fetchProfile()
    },[username])
    if(isLoading){
        return <div>Loading...</div>
    }

    if(error){
        return (
            <main className="mx-auto max-w-2xl px-4 py-6">
                <p className="text-red-500">
                    {error}
                </p>
            </main>
        )
    }
    if(!profile){
        return <div>User not found</div>
    }

    return (
        <main className="mx-auto max-w-2xl px-4 py-6">
            <ProfileHeader
                username={profile.username}
                email={profile.email}
                bio={profile.bio}
                avatarUrl={profile.avatarUrl}
                threadsCount={profile.threadsCount}
                followersCount={profile.followersCount}
                followingCount={profile.followingCount}
            />

        </main>
    )

}