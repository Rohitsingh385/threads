import { Request, Response, NextFunction } from "express";
import { getCacheTTL, incrementCounter } from "../utils/cache.js";

type RateLimitOptions = {
    limit: number
    windowSeconds: number
    keyPrefix: string
}


export const rateLimit = ({ limit, windowSeconds, keyPrefix }: RateLimitOptions) => {

    return async (req: Request, res: Response, next: NextFunction) => {

        const ip = req.ip
        const key = `rate-limit:${keyPrefix}:${ip}`
        const count = await incrementCounter(
            key,
            windowSeconds
        )
        if (count > limit) {
            const remainingTime = await getCacheTTL(key)
            return res.status(429).json({
                success: false,
                message: "Too many request",
                counter: `Retry after: ${remainingTime} seconds`
            })
        }
        next()
    }
}