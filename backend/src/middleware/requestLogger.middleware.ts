import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js"
import { randomUUID } from "crypto";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {

    const requestId = randomUUID()
    const startTime = performance.now()

    logger.info("request received", {
        requestId,
        method: req.method,
        path: req.originalUrl 
    })

    res.on("finish", () => {
        const durationMs = performance.now() - startTime
        
        const logData = {
            requestId,
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: Number(durationMs.toFixed(2))
        }

        if(res.statusCode >= 500){
            logger.error("request failed", logData)
        }else if(res.statusCode >= 400){
            logger.warn("request failed", logData)
        }else{
            logger.info("request completed", logData)
        }
    })

    next()
}