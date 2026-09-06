import { api } from "./api"
export interface BookmarkThread{
    id: string
    content: string 
    author : {
        id: string
        username: string 
    }
    likesCount: number 
    commentsCounts: number 
    createdAt: string 
    updatedAt: string 
}

export interface BookmarkResult {
    data: BookmarkThread[]
    nextCursor: string | null 
    hasNextPage: boolean
}

export interface BookmarkResponse {
    success: boolean
    message: string 
    data: BookmarkResult
}

export async function getBookmarks(limit?: 10, cursor?: string) : Promise<BookmarkResponse>{
    const response = await api.post<BookmarkResponse>("/bookmarks", {
        limit,
        cursor
    })

    return response.data
}