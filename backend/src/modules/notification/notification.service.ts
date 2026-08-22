import { Prisma, NotificationType } from "@prisma/client"

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