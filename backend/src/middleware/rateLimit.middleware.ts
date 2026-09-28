import { Request, Response, NextFunction } from "express";
import { getCacheTTL, incrementCounter } from "../utils/cache.js";
import { env } from "../config/env.js";
type RateLimitOptions = {
    limit: number
    windowSeconds: number
    keyPrefix: string
}


export const rateLimit = ({ limit, windowSeconds, keyPrefix }: RateLimitOptions) => {

    return async (req: Request, res: Response, next: NextFunction) => {

        if (env.NODE_ENV === "Benchmark") {
            return next()
        }
        const ip = req.ip
        const key = `rate-limit:${keyPrefix}:${ip}`
        const count = await incrementCounter(
            key,
            windowSeconds
        )
        if (count === null) {
            console.error("Rate limtier unavailable, allowing req")
            return next()
        }
        console.log("RATE LIMIT COUNT:", count);
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