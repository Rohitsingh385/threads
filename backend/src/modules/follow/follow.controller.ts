import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { followService, getFollowing, getFollowers } from "./follow.service.js"

export const followController = asyncHandler(async (req: Request, res: Response) => {

    const result = await followService(req.user?.userId, req.params.username)

    return res.status(201).json({
        success: true,
        message: result.message,
        data: result
    })
})

export const followingCountController = asyncHandler(async (req: Request, res: Response) => {
    const result = await getFollowing(req.params.username)

    return res.status(200).json({
        success: true,
        message: 'following',
        data: result
    })
})

export const followerCountController = asyncHandler(async (req: Request, res: Response) => {
    const result = await getFollowers(req.params.username)

    return res.status(200).json({
        success: true,
        message: 'followers',
        data: result
    })
})