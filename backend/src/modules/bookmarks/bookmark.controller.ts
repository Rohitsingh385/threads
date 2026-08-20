import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { bookmarkService, getBookmarks } from "./bookmark.service.js"

export const addBookmarkController = asyncHandler(async (req: Request, res: Response) => {
    const result = await bookmarkService(req.user?.userId, req.params.threadId)

    return res.status(201).json({
        success: true,
        message: result.message,
        data: result.data
    })
})

export const getBookmarksController = asyncHandler(async(req: Request, res: Response) => {

    const result = await getBookmarks(req.user?.userId, req.query.limit, req.query.cursor)

    return res.status(200).json({
        success: true,
        message: 'bookmarks fetched',
        data: result
    })

})