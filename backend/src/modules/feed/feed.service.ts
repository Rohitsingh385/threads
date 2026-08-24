import { prisma } from "../../config/prisma.js"
import { getCache, setCache } from "../../utils/cache.js"

type FeedResult = {
    data: {
        id: string
        content: string
        authorId: string
        likesCount: number
        commentsCount: number
        createdAt: Date
        updatedAt: Date
    }[]
    nextCursor: string | null
    hasNextPage: boolean
}

export const getFeed = async (userId: string, limit: number, cursor?: string) => {

    const cacheKey = `feed:user:${userId}:cursor:${cursor ?? "first"}:limit:${limit}`

    const cachedFeed = await getCache<FeedResult>(cacheKey)

    if (cachedFeed) {
        return cachedFeed
    }
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


    const result = {
        data,
        nextCursor,
        hasNextPage
    }
    await setCache(cacheKey, result, 60)
    return result
}