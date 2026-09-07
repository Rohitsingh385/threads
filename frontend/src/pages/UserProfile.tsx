import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProfile, type UserProfile as UserProfileData } from "../services/profileService";
import { ProfileHeader } from "../components/ProfileHeader";
import { getUserThread, type Thread } from "../services/threadService";
import { ThreadCard } from "../components/ThreadCard";
import { useAuth } from "../context/AuthContext";
import { toggleFollow } from "../services/followService";
import { Link } from "react-router-dom";

export function UserProfile() {
    const { user, isAuthLoading } = useAuth()
    const { username } = useParams<{ username: string }>()

    const [profile, setProfile] = useState<UserProfileData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [threads, setThreads] = useState<Thread[]>([])
    const [isThreadsLoading, setIsThreadsLoading] = useState(true)

    const [isFollowing, setIsFollowing] = useState(false)
    const [isFollowLoading, setIsFollowLoading] = useState(false)
    const [followError, setFollowError] = useState("")

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username || isAuthLoading) return

            try {
                setIsLoading(true)
                setError("")

                const result = await getProfile(username)
                setProfile(result.data)
                setIsFollowing(result.data.isFollowing)
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
    }, [username, isAuthLoading])
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

    const handleFollow = async () => {
        if (!profile || isFollowLoading) return

        try {
            setIsFollowLoading(true)
            setFollowError("")

            await toggleFollow(profile.username)

            setIsFollowing(prev => {
                const nextFollowing = !prev

                setProfile(current => {
                    if (!current) return current

                    return {
                        ...current,
                        followersCount: current.followersCount + (
                            nextFollowing ? 1 : -1
                        )
                    }
                })

                return nextFollowing
            })
        } catch (error) {
            setFollowError("Unable to update follow")
        } finally {
            setIsFollowLoading(false)
        }
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
            <div className="mt-4 flex gap-3">
                {user?.username === profile.username ? (
                    <>
                        <Link
                            to="/profile/edit"
                            className="rounded border px-4 py-2">
                            Edit Profile
                        </Link>
                        <Link
                            to="/bookmarks"
                            className="rounded border px-4 py-2">
                            Bookmarks
                        </Link>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={handleFollow}
                        disabled={isFollowLoading}
                        className="rounded bg-black px-4 py-2 text-white">
                        {isFollowLoading
                            ? "Loading..."
                            : isFollowing
                                ? "Following"
                                : "Follow"}
                    </button>
                )}
            </div>
            {followError && (
                <p className="mt-2 text-sm text-red-500">
                    {followError}
                </p>
            )}
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