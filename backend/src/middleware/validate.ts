import { Request, Response, NextFunction } from "express"
import { ZodObject } from "zod"
import { ApiError } from "../utils/ApiError.js"

export const validate = (schema: ZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
            file: req.file
        })
        if (!result.success) {
            throw new ApiError(
                400,
                result.error.message
            )
        }
        req.body = result.data.body
        next()
    }
} 