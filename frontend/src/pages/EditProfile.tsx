import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/profileService";
import { useNavigate } from "react-router-dom";
export function EditProfile() {
    const { user, setUser } = useAuth()

    const [username, setUsername] = useState(user?.username ?? "")
    const [bio, setBio] = useState(user?.bio ?? "")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [avatar, setAvatar] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    if (!user) {
        return <div>Loading...</div>
    }
    const navigate = useNavigate()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        try {
            setIsSubmitting(true)
            const result = await updateProfile({
                username,
                bio
            },
                avatar)

            setUser({
                ...user,
                username: result.data.username,
                bio: result.data.bio,
                avatarUrl: result.data.avatarUrl
            })
            setSuccess("Profile updated successfully")
            navigate(`/profile/${result.data.username}`)
        } catch (error) {
            setError("Failed to update profile")
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <main className="mx-auto max-w-2xl px-4 py-6">
            <h1 className="mb-6 text-2xl font-bold">
                Edit Profile
            </h1>

            {error && (
                <p className="mb-4 text-sm text-red-500">
                    {error}
                </p>
            )}
            {success && (
                <p className="mb-4 text-sm text-green-600">
                    {success}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        username
                    </label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Bio
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full rounded border px-3 py-2"
                        rows={4}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Avatar
                    </label>
                    <input type="file"
                        accept="image/png,image/jpeg"
                        onChange={(e) => {
                            const file = e.target.files?.[0] ?? null 

                            setAvatar(file)
                            if(file){
                                setAvatarPreview(URL.createObjectURL(file))
                            }else{
                                setAvatarPreview(null)
                            }
                        }}
                    />
                    {avatarPreview && (
                        <img 
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="mt-3 h-20 w-20 rounded-full object-cover"
                        />
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded bg-black px-4 py-2 text-white"
                >
                    {isSubmitting ? "Saving..." : "Save"}
                </button>
            </form>
        </main>
    )
}