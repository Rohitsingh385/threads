import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createThread, getThreadById, getThreadByUsername, updateThread, deleteThread } from "./thread.service.js"

export const createThreadController = asyncHandler(async (req: Request, res: Response) => {

    const result = await createThread(req.user?.userId, req.body)

    return res.status(201).json({
        success: true,
        message: 'created',
        data: result
    })
})
export const getThreadByIdController = asyncHandler(async (req: Request, res: Response) => {

    // console.log(req.params.id)
    const result = await getThreadById(req.params, req.user?.userId)

    return res.status(200).json({
        success: true,
        message: 'result',
        data: result
    })
})
export const getThreadByUsernameController = asyncHandler(async (req: Request, res: Response) => {

    const result = await getThreadByUsername(req.params.username, req.query.limit, req.query.cursor)

    return res.status(200).json({
        success: true,
        message: 'result',
        data: result
    })
})

export const updateThreadController = asyncHandler(async (req: Request, res: Response) => {

    const result = await updateThread(req.user?.userId, req.params.id, req.body.content)

    return res.status(200).json({
        success: true,
        message: 'updated',
        data: result
    })
})

export const deleteThreadController = asyncHandler(async (req: Request, res: Response) => {

    const result = await deleteThread(req.user?.userId, req.params.id)

    return res.status(200).json({
        success: true,
        message: 'deleted',
        data: result
    })
})