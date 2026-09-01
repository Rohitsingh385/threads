

interface ProfileHeaderProps {
    username: string 
    email: string 
    bio: string | null 
    avatarUrl: string | null 
    threadsCount: number 
    followersCount: number 
    followingCount: number 
}

export function ProfileHeader({username, email, bio, avatarUrl, threadsCount, followersCount, followingCount}: ProfileHeaderProps) {

    return(
        <section>
            <div className="mb-4">
                {avatarUrl ? (
                    <img 
                        src={avatarUrl} 
                        alt={`${username}'s avatar`}
                        className="h-20 w-20 rounded-full object-cover"
                     />
                ): (
                    <div className="flex h-20 w-20 items-center justify center rounded-full bg-gray-300">
                        {username[0].toUpperCase()}
                    </div>
                )}
            </div>

            <h1 className="text-2xl font-bold">{username}</h1>
            <p className="text-gray-500">{email}</p>

            <p className="mt-2">
                {bio ?? "No bio yet"}
            </p>
            <div className="mt-4 flex gap-6">
                <div>
                    <p className="font-bold">{threadsCount}</p>
                    <p className="text-sm text-gray-500">Threads</p>
                </div>

                <div>
                    <p className="font-bold">{followersCount}</p>
                    <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div>
                    <p className="font-bold">{followingCount}</p>
                    <p className="text-sm text-gray-500">Following</p>
                </div>
            </div>
        </section>
    )
}