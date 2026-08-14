import { prisma } from "../../config/prisma.js"
import { ApiError } from "../../utils/ApiError.js"


export const createComment = async (userId: string, threadId: string, content: string, parentCommentId?: string) => {

    const checkExists = await prisma.thread.findFirst({
        where: {
            id: threadId
        }
    })
    if (!checkExists) {
        throw new ApiError(
            404,
            'thread not found'
        )
    }
    // replies
    if (parentCommentId) {
        const checkExists = await prisma.comment.findFirst({
            where: {
                id: parentCommentId,
                threadId: threadId,

            }
        })
        if (!checkExists) {
            throw new ApiError(
                404,
                'comment not found'
            )
        }
        const [comment] = await prisma.$transaction([
            prisma.comment.create({
                data: {
                    content,
                    threadId: threadId,
                    parentId: parentCommentId,
                    userId: userId
                }
            }),
            prisma.thread.update({
                where: {
                    id: threadId
                },
                data: {
                    commentsCount: {
                        increment: 1
                    }
                }
            })
        ])
        return comment
    }

    // comment
    const [comment] = await prisma.$transaction([
        prisma.comment.create({
            data: {
                content,
                threadId: threadId,
                userId: userId
            }
        }),
        prisma.thread.update({
            where: {
                id: threadId
            },
            data: {
                commentsCount: {
                    increment: 1
                }
            }
        })
    ])
    return comment
}

export const getComment = async (threadId: string, parentId: string, limit: number, cursor?: string) => {

    const comments = await prisma.comment.findMany({
        where: {
            threadId,
            parentId: parentId ? parentId : null,
        },

        include: {
            user: {
                select: {
                    username: true,
                    avatarUrl: true,
                }
            }
        },

        take: limit + 1,

        ...(cursor && {
            cursor: {
                id: cursor,
            },
            skip: 1
        }),

        orderBy: {
            createdAt: 'desc'
        }
    })
    const hasNextPage = comments.length > limit

    const data = hasNextPage ? comments.slice(0, limit) : comments

    const nextCursor = hasNextPage ? data[data.length - 1].id : null

    return {
        data,
        nextCursor
    }


}

export const updateComment = async (userId: string, commentId: string, content: string) => {
    const comment = await prisma.comment.update({
        where: {
            id: commentId,
            userId: userId
        },
        data: {
            content
        }

    })

    if (!comment) {
        throw new ApiError(
            404,
            'comment not found'
        )
    }
    return {
        comment
    }
}

export const deleteComment = async (userId: string, commentId: string) => {
    const checkCommentExists = await prisma.comment.findFirst({
        where: {
            id: commentId,
            userId: userId
        }
    })
    if (!checkCommentExists) {
        throw new ApiError(
            404,
            'comment not found'
        )
    }

    if (checkCommentExists.deletedAt !== null) {
        throw new ApiError(
            400,
            'comment already deleted'
        )
    }

    return prisma.$transaction(async (tx) => {

        const comment = await tx.comment.update({
            where: {
                id: commentId
            },
            data: {
                deletedAt: new Date()
            }
        })
        const thread = await tx.thread.update({
            where: {
                id: checkCommentExists.threadId
            },
            data: {
                commentsCount: {
                    decrement: 1
                }
            }
        })
        return {
            comment,
            commentsCount: thread.commentsCount
        }
    })
}