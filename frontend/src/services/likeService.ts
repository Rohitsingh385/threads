import { api } from "./api";

export interface LikeResponse{
    success: boolean
    message: string 
    data: {
        liked: boolean
        likesCount: number
    }
}

export async function toggleLike(threadId: string): Promise<LikeResponse> {

    const response = await api.post<LikeResponse>(`/threads/${threadId}/likes`)

    return response.data
}