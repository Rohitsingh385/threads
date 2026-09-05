import { api } from "./api";


export interface ThreadAuthor {
    id: string
    username: string
    bio: string
    avatarUrl: string
}
export interface Thread {
    id: string
    content: string
    authorId: string
    likesCount: number
    commentsCount: number
    createdAt: string
    updatedAt: string
    author?: ThreadAuthor
}

export interface createThreadInput {
    content: string
}

export interface createThreadResponse {
    success: boolean
    message: string
    data: Thread
}


export interface getUserThreadResponse {
    success: boolean
    message: string
    data: GetUserThreadData
}

export interface GetUserThreadData {
    data: Thread[]
    nextCursor: string | null
    hasNextPage: boolean
}

export interface GetThreadResponse {
    success: boolean
    message: string
    data: {
        thread: Thread
        isLiked: boolean
        isFollowing: boolean
    }
}

export interface UpdateThreadInput {
    content: string
}

export async function updateThread(threadId: string, input: UpdateThreadInput): Promise<GetThreadResponse> {

    const response = await api.patch<GetThreadResponse>(`/threads/${threadId}`, input)

    return response.data
}

export async function getThread(threadId: string): Promise<GetThreadResponse> {
    const response = await api.get<GetThreadResponse>(`/threads/${threadId}?t=${Date.now()}`)
    return response.data
}

export async function getUserThread(username: string): Promise<getUserThreadResponse> {

    const response = await api.get<getUserThreadResponse>(`/threads/user/${username}`)

    return response.data
}
export async function createThread(input: createThreadInput): Promise<createThreadResponse> {

    const response = await api.post<createThreadResponse>(
        "/threads",
        input
    )
    return response.data
}
export async function deleteThread(threadId: string) {
    const response = await api.delete(`/threads/${threadId}`)

    return response.data
}