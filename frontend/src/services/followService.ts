import { api } from "./api";

export interface followUser {
    id: string 
    username: string 
    avatarUrl: string | null 
    bio: string | null 
}

export interface followResponse {
    success: boolean
    message: string 
    data: {
        id: string 
        followerId: string
        followingId: string 
        createdAt: string
    }
}

export async function toggleFollow (username: string): Promise<followResponse>{

    const result = await api.post<followResponse>(`/user/${username}/follow`)
    
    return result.data
}