export interface FeedThread {
    id: string
    content: string
    authorId: string
    likesCount: number
    commentsCount: number
    createdAt: string 
    updatedAt: string
}

export interface FeedResult {
    data: FeedThread[]
    nextCursor: string | null
    hasNextPage: boolean
}

export interface FeedResponse {
    success: boolean
    message: string
    data: FeedResult
}