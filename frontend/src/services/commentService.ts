import { api } from "./api";
import type { CommentResponse, Comment } from "../types/comment";

interface GetCommentsParams {
    parentId?: string | null
    cursor?: string | null
    limit?: number
}

interface CreateCommentResponse {
    success: boolean
    message: string
    data: Comment
}

export async function createComment(threadId: string, content: string, parentCommentId?: string): Promise<CreateCommentResponse> {
    const response = await api.post<CreateCommentResponse>(`/threads/${threadId}/comment`, { content, parentCommentId })

    return response.data
}
export async function getComments(threadId: string, params?: GetCommentsParams): Promise<CommentResponse> {

    const response = await api.get<CommentResponse>(`/threads/${threadId}/comments`, {
        params
    })

    return response.data
}

