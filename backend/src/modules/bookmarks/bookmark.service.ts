import { id } from "zod/locales"
import { prisma } from "../../config/prisma.js"
import { ApiError } from "../../utils/ApiError.js"


export const bookmarkService = async (userId: string, threadId: string) => {

    const checkExistsThread = await prisma.thread.findUnique({
        where: {
            id: threadId
        }
    })
    if (!checkExistsThread) {
        throw new ApiError(
            404,
            'thread not found'
        )
    }
    const checkExistsBookmark = await prisma.bookmark.findUnique({
        where: {
            userId_threadId: {
                userId: userId,
                threadId: threadId
            }
        }
    })

    if (checkExistsBookmark) {
        await prisma.bookmark.delete({
            where: {
                userId_threadId: {
                    userId: userId,
                    threadId: threadId
                }
            }
        })
        return {
            message: 'Bookmark removed'
        }
    }

    const bookmark = await prisma.bookmark.create({
        data: {
            userId: userId,
            threadId: threadId
        }
    })

    return {
        message: 'Thread bokmarked',
        data: bookmark
    }

}
export const getBookmarks = async (userId: string, limit: number, cursor: string) => {
    const bookmarks = await prisma.bookmark.findMany({
        where: {
            userId: userId
        },
        take: limit + 1 ,
        ...(cursor && {
            cursor: {
                id: cursor
            },
            skip: 1
        }),
        orderBy: {
            createdAt: "desc"
        },
        include:{
            thread: {
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatarUrl: true
                        }
                    }
                }
            }
        }
    })

    const hashNextPage = bookmarks.length > limit 
    const data = hashNextPage? bookmarks.slice(0, limit) : bookmarks
    const nextCursor = hashNextPage ? data[data.length - 1].id : null 
    return {
        data,
        nextCursor,
        hashNextPage
    }
}