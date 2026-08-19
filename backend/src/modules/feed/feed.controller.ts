import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getFeed } from "./feed.service.js"

export const getFeedController = asyncHandler(async (req: Request, res: Response) => {

    const result = await getFeed(req.user?.userId, req.query.limit, req.query.cursor)

    return res.status(200).json({
        success: true,
        message: 'records fetched',
        data: result
    })
})