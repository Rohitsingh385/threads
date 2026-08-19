import { prisma } from "../../config/prisma.js"

export const getFeed = async (userId: string, limit: number, cursor?: string) => {
    const following = await prisma.follow.findMany({
        where: {
            followerId: userId
        },
        select: {
            followingId: true
        }
    })

    const authorIds = [
        userId,
        ...following.map(follow => follow.followingId)
    ]
    const threads = await prisma.thread.findMany({
        where: {
            authorId: {
                in: authorIds
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
            createdAt: "desc"
        }
    })

    const hasNextPage = threads.length > limit
    const data = hasNextPage ? threads.slice(0, limit) : threads
    const nextCursor = hasNextPage ? data[data.length - 1].id : null


    return {
        data,
        nextCursor,
        hasNextPage
    }
}