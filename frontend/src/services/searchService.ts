import { api } from "./api";

export interface searchUser {
    id: string 
    username: string 
    bio: string | null 
    avatarUrl: string | null 
}

export interface searchUserResponse {
    success: string 
    message: string 
    data: searchUser[]
}

export const searchUsers = async(username: string , limit?: number, page?: number): Promise<searchUserResponse> => {

    const response = await api.get<searchUserResponse>(`/users/search/${encodeURIComponent(username)}`, {
        params:{
            limit,
            page
        }
    })

    return response.data
}