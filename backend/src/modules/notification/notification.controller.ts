import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getNotifications } from "./notification.service.js";


export const getNotificationsController = asyncHandler(async (req: Request, res: Response) => {

    const result = await getNotifications(req.user?.userId, req.query.limit, req.query.cursor)

    return res.status(200).json({
        success: true,
        message: 'notifications',
        data: result
    })
})