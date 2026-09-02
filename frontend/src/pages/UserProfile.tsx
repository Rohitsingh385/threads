import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProfile, type UserProfile as UserProfileData } from "../services/profileService";
import { ProfileHeader } from "../components/ProfileHeader";
import { getUserThread, type Thread } from "../services/threadService";
import { ThreadCard } from "../components/ThreadCard";

export function UserProfile() {
    const { username } = useParams<{ username: string }>()

    const [profile, setProfile] = useState<UserProfileData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [threads, setThreads] = useState<Thread[]>([])
    const [isThreadsLoading, setIsThreadsLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) return

            try {
                setIsLoading(true)
                setError("")

                const result = await getProfile(username)
                setProfile(result.data)

                const threadsResult = await getUserThread(username)
                setThreads(threadsResult.data.data)
            } catch (error) {
                setError("Unable to load profile picture")
            } finally {
                setIsLoading(false)
                setIsThreadsLoading(false)
            }
        }
        fetchProfile()
    }, [username])
    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return (
            <main className="mx-auto max-w-2xl px-4 py-6">
                <p className="text-red-500">
                    {error}
                </p>
            </main>
        )
    }
    if (!profile) {
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
            <section className="mt-8">
                <h2 className="mb-4 text-xl font-semibold">
                    Threads
                </h2>
                {isThreadsLoading ? (
                    <p>Loading threads...</p>
                ) : threads.length === 0 ? (
                    <p className="text-gray-500">
                        No threads yet
                    </p>
                ) : (
                    <div className="space-y-4">
                        {threads.map((thread) => (
                            <ThreadCard
                                key={thread.id}
                                thread={thread}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    )

}