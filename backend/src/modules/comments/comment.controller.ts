import { asyncHandler } from "../../utils/asyncHandler.js";
import type { Request, Response } from "express";
import { createComment, getComment, updateComment, deleteComment } from "./comment.service.js"

export const createCommentController = asyncHandler(async (req: Request, res: Response) => {

    const result = await createComment(req.user?.userId, req.params.threadId, req.body.content, req.body.parentCommentId)

    return res.status(201).json({
        message: 'comment added',
        data: result
    })
})

export const getCommentController = asyncHandler(async (req: Request, res: Response) => {

    const result = await getComment(req.params.threadId, req.query.parentId, req.query.limit, req.query.cursor)

    return res.status(200).json({
        message: true,
        data: result
    })
})

export const updateCommentController = asyncHandler(async (req: Request, res: Response) => {

    const result = await updateComment(req.user?.userId, req.params.commentId, req.body.content)
    return res.status(200).json({
        message: {
            success: true,
            message: 'comment udpated',
            data: result.comment
        }
    })
})

export const deleteCommentController = asyncHandler(async(req: Request, res: Response) => {
    const result = await deleteComment(req.user?.userId, req.params.commentId)

    return res.status(200).json({
        success: true,
        message: 'comment deleted',
        data: result
    })
})