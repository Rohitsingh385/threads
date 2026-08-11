import { prisma } from "../../config/prisma.js"
import { ApiError } from "../../utils/ApiError.js"



export const likeService = async (userId: string, threadId: string) => {
    const checkIsLiked = await prisma.like.findFirst({
        where: {
            threadId: threadId,
            userId: userId
        }
    })
    if (!checkIsLiked) {
        try {
            const [like, thread] = await prisma.$transaction([
                prisma.like.create({
                    data: {
                        userId: userId,
                        threadId: threadId
                    }
                }),
                prisma.thread.update({
                    where: {
                        id: threadId
                    },
                    data: {
                        likesCount: {
                            increment: 1
                        }
                    }
                })
            ])
            
            return {
                liked: true,
                likesCount: thread.likesCount
            }
        } catch (error) {
            throw new ApiError(
                409,
                'Thread already liked'
            )
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
