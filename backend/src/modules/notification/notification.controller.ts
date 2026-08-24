import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getNotifications, getUnreadCount, markAllNotificationAsRead, markNotificationAsRead } from "./notification.service.js";


export const getNotificationsController = asyncHandler(async (req: Request, res: Response) => {

    const result = await getNotifications(req.user?.userId, req.query.limit, req.query.cursor)

    return res.status(200).json({
        success: true,
        message: 'notifications',
        data: result
    })
})

export const unReadCountNotificationController = asyncHandler(async (req: Request, res: Response) => {

    const result = await getUnreadCount(req.user?.userId)

    return res.status(200).json({
        success: true,
        message: 'unread Counts',
        data: result
    })
})

export const markNotificationAsReadController = asyncHandler(async (req, res) => {
    const result = await markNotificationAsRead(req.user?.userId, req.params.notificationId)
    return res.status(200).json({
        success: true,
        message: result.message
    })
})

export const markAllNotificationAsReadController = asyncHandler(async (req, res) => {

    const result = await markAllNotificationAsRead(req.user?.userId)
    return res.status(200).json({
        success: true,
        message: result.message
    })
})