import { NotificationType } from "@prisma/client"
import { prisma } from "../../config/prisma.js"
import { ApiError } from "../../utils/ApiError.js"
import { createNotification } from "../notification/notification.service.js"
import { notificationQueue } from "../../queue/notification.queue.js"



export const likeService = async (userId: string, threadId: string) => {
    const checkIsLiked = await prisma.like.findFirst({
        where: {
            threadId: threadId,
            userId: userId
        }
    })
    if (!checkIsLiked) {
        const result = await prisma.$transaction(async (tx) => {
            const like = await tx.like.create({
                data: {
                    userId: userId,
                    threadId: threadId
                }
            })
            const thread = await tx.thread.update({
                where: {
                    id: threadId
                },
                data: {
                    likesCount: {
                        increment: 1
                    }
                }
            })

            return {
                like,
                thread
            }

        })
        if (result.thread.authorId !== userId) {
            await notificationQueue.add("like-notification", {
                recipientId: result.thread.authorId,
                actorId: userId,
                threadId,
            });
        }
        return {
            liked: true,
            likesCount: result.thread.likesCount
        }
    }
    return prisma.$transaction(async (tx) => {
        const result = await tx.like.deleteMany({
            where: {
                userId,
                threadId
            }
        })
        if (result.count === 0) {
            throw new ApiError(
                404,
                "Thread not liked"
            )
        }
        const thread = await tx.thread.update({
            where: {
                id: threadId
            },
            data: {
                likesCount: {
                    decrement: 1
                }
            }
        })
        return {
            liked: false,
            likesCount: thread.likesCount
        }
    })
}
