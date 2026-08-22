import { NotificationType } from "@prisma/client"
import { prisma } from "../../config/prisma.js"
import { ApiError } from "../../utils/ApiError.js"
import { createNotification } from "../notification/notification.service.js"


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
        const result = await prisma.$transaction(async (tx) => {
            const comment = await tx.comment.create({
                data: {
                    content,
                    threadId: threadId,
                    parentId: parentCommentId,
                    userId: userId
                }
            })
            const updateCommentCount = await tx.thread.update({
                where: {
                    id: threadId
                },
                data: {
                    commentsCount: {
                        increment: 1
                    }
                }
            })
            if (checkExists.userId !== userId) {
                await createNotification(tx, { recipientId: checkExists.userId, actorId: userId, type: NotificationType.COMMENT, threadId: threadId, commentId: comment.id })
            }
            return {
                comment,
                updateCommentCount
            }
        })
        return {
            result
        }
    }

    const result = await prisma.$transaction(async (tx) => {

        const comment = await prisma.comment.create({
            data: {
                content,
                threadId: threadId,
                userId: userId
            }
        })
        const updateCommentCount = await prisma.thread.update({
            where: {
                id: threadId
            },
            data: {
                commentsCount: {
                    increment: 1
                }
            }
        })

        if (checkExists.authorId !== userId) {
            await createNotification(tx, { recipientId: updateCommentCount.authorId, actorId: userId, type: NotificationType.COMMENT, threadId: threadId, commentId: comment.id })
        }
        return {
            comment,
            updateCommentCount
        }
    })
    return result
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