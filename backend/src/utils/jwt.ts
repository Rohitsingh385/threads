import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import { AuthPayload } from "../types/express.js"
import { ApiError } from "./ApiError.js"


export const generateAccessToken = (payload: AuthPayload)=> {

    return jwt.sign(
        payload, 
        env.ACCESS_TOKEN,
        {
            expiresIn: "6h"
        })

}
export const generateRefreshToken = (payload: AuthPayload)=> {
    return jwt.sign(
        payload,
        env.REFRESH_TOKEN,
        {
            expiresIn: "30d"
        }
    )
}


export const verifyRefreshToken = (token: string): AuthPayload => {
    try{

        return jwt.verify(token, env.REFRESH_TOKEN) as AuthPayload
        
    }catch(error){
        throw new ApiError(
            401,
            'invalid or expired token'
        )
    }
}