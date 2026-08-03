import { type Request, type Response, type NextFunction, response } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        })
    }
}