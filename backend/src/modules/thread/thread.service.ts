import { prisma } from "../../config/prisma.js"
import { ApiError } from "../../utils/ApiError.js"
import type { threadInput, threadIdinput, getUserInput } from "./thread.validation.js"

export const createThread = async (userId: string, threadData: threadInput) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new ApiError(
            404,
            'user not found'
        )
    }
    const thread = await prisma.thread.create({
        data: {
            content: threadData.content,
            authorId: userId
        }
    })
    return thread
}

export const getThreadById = async (threadData: threadIdinput) => {

    const thread = await prisma.thread.findUnique({
        where: {
            id: threadData.id,
        },
        include: {
            author: {
                select: {
                    id: true,
                    username: true,
                    bio: true,
                    avatarUrl: true
                }
            }
        }
    })
    if (!thread) {
        throw new ApiError(
            404,
            'post not found'
        )
    }
    return thread
}

export const getThreadByUsername = async (username: string, limit: number, cursor: string) => {

    const threads = await prisma.thread.findMany({
        where: {
            author: {
                username: username
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
            createdAt: 'desc',
        }

    })

    const hasNextPage =  threads.length > limit 
    const data = hasNextPage ? threads.slice(0, limit) : threads
    const nextCursor = hasNextPage ? data[data.length -1].id : null
    return {
        data,
        nextCursor,
        hasNextPage
    }
}

export const updateThread = async (userId: string, threadId: string, content: string) => {

    const updatedThread = await prisma.thread.updateMany({
        where: {
            id: threadId,
            authorId: userId
        },
        data: {
            content: content
        }
    })
    if (updatedThread.count === 0) {
        throw new ApiError(
            403,
            'Forbidden'
        )
    }
    const thread = await prisma.thread.findUnique({
        where: {
            id: threadId
        },
        include: {
            author: {
                select: {
                    id: true,
                    username: true,
                    bio: true,
                    avatarUrl: true
                }
            }
        }
    })
    return thread
}

export const deleteThread = async (userId: string, theradId: threadIdinput) => {
    const thread = await prisma.thread.deleteMany({
        where: {
            id: theradId.id,
            authorId: userId
        }
    })
    if (!deleteThread) {
        throw new ApiError(
            403,
            'Forbidden'
        )
    }
    return thread
}