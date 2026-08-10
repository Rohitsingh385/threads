import { prisma } from "../../config/prisma.js"
import { ApiError } from "../../utils/ApiError.js"



export const likeService = async (userId: string, threadId: string) => {

    try {
        const [like] = await prisma.$transaction([
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
        return like
    } catch (error) {
        throw new ApiError(
            409,
            'Thread already liked'
        )
    }
}

export const unLikeService = async (userId: string, threadId: string) => {
   return prisma.$transaction(async(tx)=> {
    const result = await tx.like.deleteMany({
        where: {
            userId,
            threadId
        }
    })
    if(result.count === 0){
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
    return thread
   })
}