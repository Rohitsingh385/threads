export interface CommentUser {
    username: string 
    avatarUrl: string | null 
}

export interface Comment {
    id: string 
    content: string 
    threadId: string 
    username: string
    userId: string 
    parentId: string | null 
    createdAt: string 
    updatedAt: string 
    deletedAt: string | null
}

export interface CommentResult {
    data: Comment[]
    nextCursor: string | null 
}

export interface CommentResponse {
    message: boolean 
    data: CommentResult
}