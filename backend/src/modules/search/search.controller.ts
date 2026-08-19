
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { searchUsers } from "./search.service.js";


export const searchUsersController = asyncHandler(async(req: Request, res: Response)=> {

    const result = await searchUsers(req.params.username, req.query.limit, req.query.page)

    return res.status(200).json({
        success: true,
        message: 'user list',
        data: result
    })
})