import type { Request, Response, RequestHandler, NextFunction } from "express";

export const asyncHandler = (fn: RequestHandler): RequestHandler => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        next(error)
    }
}