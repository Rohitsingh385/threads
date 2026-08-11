import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";
import { AuthPayload } from "../types/express.js";
import jwt from "jsonwebtoken"

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return next()
        }

        const token = authHeader.split(" ")[1]
        const payload = jwt.verify(
            token,
            env.ACCESS_TOKEN
        ) as unknown as AuthPayload
        req.user = payload
        next()

    } catch (error) {
        return next()
    }
}