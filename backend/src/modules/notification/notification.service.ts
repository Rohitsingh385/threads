import { Prisma, NotificationType } from "@prisma/client"
import { prisma } from "../../config/prisma.js"

export const createNotification = async (
    tx: Prisma.TransactionClient,
    data: {
        recipientId: string
        actorId: string
        type: NotificationType
        threadId?: string
        commentId?: string
    }
) => {

    return tx.notification.create({
        data: {
            recipientId: data.recipientId,
            actorId: data.actorId,
            NotificationType: data.type,
            threadId: data.threadId,
            commentId: data.commentId
        }
    })
}
export const getNotifications = async (userId: string, limit: number, cursor?: string) => {
    const notifications = await prisma.notification.findMany({
        where: {
            recipientId: userId
        },
        include: {
            actor: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true
                }
            },
            thread: {
                select: {
                    id: true,
                    content: true
                }
            },
            comment: {
                select: {
                    id: true,
                    content: true
                }
            }
        },
        take: limit + 1,
        ...(cursor && {
            cursor: {
                id: cursor
            },
            skip: 1
        }),
        orderBy: {
            createdAt: 'desc'
        }
    })

    const hasNextPage = notifications.length > limit
    const data = hasNextPage ? notifications.slice(0, limit): notifications
    const nextCursor = hasNextPage ? data[data.length - 1].id: null

    return {
        data,
        hasNextPage,
        nextCursor
    }
}