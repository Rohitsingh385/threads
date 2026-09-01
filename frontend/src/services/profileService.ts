import { api } from "./api";
export interface UpdateProfileInput {
    username?: string 
    bio?: string 
}

export interface UpdateProfileResponse {

    success: boolean
    message: string 
    data: {
        username: string 
        bio: string 
        avatarUrl: string 
    }
}

export interface UserProfile {
    id: string 
    username: string 
    email: string 
    role: string 
    bio: string | null 
    avatarUrl: string | null 
    avatarPublicId: string | null 
    isFollowing: boolean
    threadsCount: number 
    followersCount: number 
    followingCount: number
}

export interface GetProfileResponse {
    success: boolean
    message: string 
    data: UserProfile
}
export async function getProfile(username: string): Promise<GetProfileResponse> {
    const response = await api.get<GetProfileResponse>(
        `/users/${username}`
    )
    return response.data
}

export async function updateProfile(input: UpdateProfileInput, avatar?: File | null): Promise<UpdateProfileResponse> {
    const formData = new FormData()

    if(input.username !== undefined){
        formData.append("username", input.username)
    }
    if(input.bio !== undefined){
        formData.append("bio", input.bio)
    }
    if(avatar){
        formData.append("avatarUrl", avatar)
    }

    const response = await api.patch<UpdateProfileResponse>("/users/profile", formData)

    return response.data
}