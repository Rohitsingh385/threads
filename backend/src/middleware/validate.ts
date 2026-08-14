import { AnyZodObject, ZodError } from "zod"
import { Request, Response, NextFunction } from "express"
import { ApiError } from "../utils/ApiError.js"

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params)
    try {
        const parsed = schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
        })
        console.log(parsed)
        if (parsed.body) req.body = parsed.body

        if (parsed.params) {
            Object.defineProperty(req, 'params', {
                value: { ...req.params, ...parsed.params },
                writable: true,
                configurable: true,
                enumerable: true
            })
        }
        if (parsed.query) {
            Object.defineProperty(req, 'query', {
                value: { ...req.query, ...parsed.query },
                writable: true,
                configurable: true,
                enumerable: true
            })
        }
        next()
    } catch (error) {
        if (error instanceof ZodError) {
            return next(
                new ApiError(
                    400,
                    error.issues[0]?.message || "Validation Error"
                )
            )
        }
        next(error)
    }
}