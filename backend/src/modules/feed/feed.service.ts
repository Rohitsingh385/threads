import { prisma } from "../../config/prisma.js"
import { redisClient } from "../../config/redis.js"
import { getCache, setCache, acquireLock, releaseLock } from "../../utils/cache.js"


export const getFeed = async (userId: string, limit: number, cursor?: string) => {

    const cacheKey = `feed:user:${userId}:cursor:${cursor ?? "first"}:limit:${limit}`
    const generateFeed = async () => {
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
            ...(cursor && { cursor: { id: cursor }, skip: 1 }),
            orderBy: {
                createdAt: "desc"
            }
        })

        const hasNextPage = threads.length > limit

        const data = hasNextPage
            ? threads.slice(0, limit)
            : threads

        const threadIds = data.map(thread => thread.id)

        const nextCursor = hasNextPage
            ? data[data.length - 1].id
            : null

        return {
            threadIds,
            nextCursor,
            hasNextPage
        }
    }


    let threadIds: string[]
    let nextCursor: string | null
    let hasNextPage: boolean

    if (!redisClient.isReady) {
        const generatedFeed = await generateFeed()

        threadIds = generatedFeed.threadIds
        nextCursor = generatedFeed.nextCursor
        hasNextPage = generatedFeed.hasNextPage
    } else {
        const cachedFeed = await getCache<{
            threadIds: string[]
            nextCursor: string | null
            hasNextPage: boolean
        }>(cacheKey)

        if (cachedFeed) {
            threadIds = cachedFeed.threadIds
            nextCursor = cachedFeed.nextCursor
            hasNextPage = cachedFeed.hasNextPage
        } else {
            const lockAcquired = await acquireLock(cacheKey, 5)
            if (!lockAcquired) {
                const maxRetries = 10
                const retryDelay = 50
                let retryCache = null

                for (let attempt = 0; attempt < maxRetries; attempt++) {

                    await new Promise(resolve => setTimeout(resolve, retryDelay))

                    retryCache = await getCache<{ threadIds: string[], nextCursor: string | null, hasNextPage: boolean }>(cacheKey)

                    if (retryCache) {
                        break
                    }
                }


                if (retryCache) {
                    threadIds = retryCache.threadIds
                    nextCursor = retryCache.nextCursor
                    hasNextPage = retryCache.hasNextPage
                } else {
                    throw new Error("Failed to populate feed cache")
                }
            } else {
                try {
                    const generatedFeed = await generateFeed()

                    threadIds = generatedFeed.threadIds
                    nextCursor = generatedFeed.nextCursor
                    hasNextPage = generatedFeed.hasNextPage

                    const ttl = 60 + Math.floor(Math.random() * 30)

                    await setCache(cacheKey, generatedFeed, ttl)
                } finally {
                    await releaseLock(cacheKey)
                }
            }
        }
    }


    const data = await prisma.thread.findMany({
        where: {
            id: {
                in: threadIds
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    const likedThreads = await prisma.like.findMany({
        where: {
            userId,
            threadId: {
                in: data.map(thread => thread.id)
            }
        },
        select: {
            threadId: true
        }
    })

    const likedThreadIds = new Set(
        likedThreads.map(like => like.threadId)
    )


    const result = {
        data: data.map(thread => ({
            ...thread,
            isLiked: likedThreadIds.has(thread.id)
        })),
        nextCursor,
        hasNextPage
    }
    // await setCache(cacheKey, result, 60)
    return result
}