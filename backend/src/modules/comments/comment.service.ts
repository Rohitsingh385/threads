import { prisma } from "../../config/prisma.js"
import { ApiError } from "../../utils/ApiError.js"


export const createComment = async (userId: string, threadId: string, content: string, parentCommentId?: string) => {

    const checkExists = await prisma.thread.findFirst({
        where: {
            id: threadId
        }
    })
    if (!checkExists) {
        throw new ApiError(
            404,
            'thread not found'
        )
    }
    // replies
    if (parentCommentId) {
        const checkExists = await prisma.comment.findFirst({
            where: {
                id: parentCommentId,
                threadId: threadId,

            }
        })
        if (!checkExists) {
            throw new ApiError(
                404,
                'comment not found'
            )
        }
        const [comment] = await prisma.$transaction([
            prisma.comment.create({
                data: {
                    content,
                    threadId: threadId,
                    parentId: parentCommentId,
                    userId: userId
                }
            }),
            prisma.thread.update({
                where: {
                    id: threadId
                },
                data: {
                    commentsCount: {
                        increment: 1
                    }
                }
            })
        ])
        return comment
    }

    // comment
    const [comment] = await prisma.$transaction([
        prisma.comment.create({
            data: {
                content,
                threadId: threadId,
                userId: userId
            }
        }),
        prisma.thread.update({
            where: {
                id: threadId
            },
            data: {
                commentsCount: {
                    increment: 1
                }
            }
        })
    ])
    return comment
}