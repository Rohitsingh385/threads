import { prisma } from "../../config/prisma.js"
import { getCache, setCache } from "../../utils/cache.js"


export const getFeed = async (userId: string, limit: number, cursor?: string) => {

    const cacheKey = `feed:user:${userId}:cursor:${cursor ?? "first"}:limit:${limit}`

    const cachedFeed = await getCache<{
        threadIds: string[] 
        nextCursor: string | null 
        hasNextPage: boolean
    }>(cacheKey)


    let threadIds : string []
    let nextCursor : string | null 
    let hasNextPage : boolean

    if(cachedFeed){
        threadIds = cachedFeed.threadIds
        nextCursor = cachedFeed.nextCursor
        hasNextPage = cachedFeed.hasNextPage
    }else {
        const following = await prisma.follow.findMany({
            where : {
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
        hasNextPage = threads.length > limit

        const data = hasNextPage
            ? threads.slice(0, limit)
            : threads

        threadIds = data.map(thread => thread.id)
        nextCursor = hasNextPage
            ? data[data.length -1].id
            : null
        
        await setCache(
            cacheKey,
            {
                threadIds,
                nextCursor,
                hasNextPage
            },
            60
        )
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