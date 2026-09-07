import { api } from "./api"
export interface BookmarkThread {
    id: string
    userId: string
    threadId: string
    createdAt: string

    thread: {
        id: string
        content: string
        authorId: string 
        likesCount: number
        commentsCount: number
        isLiked: boolean 
        createdAt: string
        updatedAt: string
        author: {
            id: string
            username: string
            bio: string 
            avatarUrl: string | null
        }

    }
}

export interface BookmarkResult {
    data: BookmarkThread[]
    nextCursor: string | null
    hasNextPage: boolean
}

export interface BookmarkResponse {
    success: boolean
    message: string
    data: {
        data: BookmarkThread[]
        nextCursor: string | null 
        hasNextPage: boolean
    }
}

export async function getBookmarks(limit?: 10, cursor?: string): Promise<BookmarkResponse> {
    const response = await api.post<BookmarkResponse>("/bookmarks", {
        limit,
        cursor
    })

    return response.data
}