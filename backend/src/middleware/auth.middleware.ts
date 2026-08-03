import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";
import jwt from "jsonwebtoken"
import { AuthPayload } from "../types/express.js";
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            throw new ApiError(
                401,
                'unauthorized'
            )
        }
        
        const token = authHeader.split(" ")[1]
        const payload = jwt.verify(
            token,
            env.ACCESS_TOKEN
        ) as unknown as AuthPayload
        req.user = payload
        next()

    } catch (error) {
        throw new ApiError(
            401,
            'authorization failed'
        )
    }
}