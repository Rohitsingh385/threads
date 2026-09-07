export interface CommentUser {
    username: string 
    avatarUrl: string | null 
}

export interface CommentResult {
    data: Comment[]
    nextCursor: string | null 
}

export interface CommentResponse {
    message: boolean 
    data: CommentResult
}

export interface CreateCommentResponse {
    message: string 
    data: {
        comment: Comment 
        updateCommentCount:{
            id: string 
            content: string 
            authorId: string 
            likesCount: number 
            commentsCount: number 
            createdAt: string 
            updatedAt: string
        }
    }
}