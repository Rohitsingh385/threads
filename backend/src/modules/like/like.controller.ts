import { asyncHandler } from "../../utils/asyncHandler.js";
import type { Request, Response } from "express";
import { likeService } from './like.service.js'

export const likeController = asyncHandler(async (req: Request, res: Response) => {

    const result = await likeService(req.user?.userId, req.params.threadId)

    return res.status(201).json({
        message: 'liked',
        data: result
    })
})
