import { asyncHandler } from "../../utils/asyncHandler.js";
import type { Request, Response } from "express";
import { likeService, unLikeService } from './like.service.js'

export const likeController = asyncHandler(async (req: Request, res: Response) => {

    const result = await likeService(req.user?.userId, req.params.threadId)

    return res.status(201).json({
        message: 'liked',
        data: result
    })
})

export const unLikeController = asyncHandler(async(req: Request, res: Response)=> {

    const result = await unLikeService(req.user?.userId, req.params.threadId)

    return res.status(200).json({
        message: 'unliked',
        data: result
    })
})