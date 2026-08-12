import { asyncHandler } from "../../utils/asyncHandler.js";
import type { Request, Response } from "express";
import { createComment } from "./comment.service.js"

export const createCommentController = asyncHandler(async (req: Request, res: Response) => {

    const result = await createComment(req.user?.userId, req.body.threadId, req.body.content, req.body.parentId)

    return res.status(201).json({
        message: 'comment added',
        data: result
    })
})