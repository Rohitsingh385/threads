import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { signUpService, loginService, meService, refreshTokenService, verifyOtp, resendOtp , forgotPassword, resetPassword} from "./user.service.js"
import { ApiError } from "../../utils/ApiError.js";
export const signupController = asyncHandler(async (req: Request, res: Response) => {

    const result = await signUpService(req.body)

    return res.status(201).json({
        success: true,
        message: "user created",
        result
    })
})

export const loginController = asyncHandler(async (req: Request, res: Response) => {

    const result = await loginService(req.body)

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 1000
    })
    return res.status(200).json({
        success: true,
        message: "user loggedIn",
        data: {
            accessToken: result.accessToken
        }
    })
})

export const meController = asyncHandler(async (req: Request, res: Response) => {

    const result = await meService(req.user?.userId as string)

    return res.status(200).json({
        success: true,
        message: `${req.user?.userId} details`,
        data: {
            username: result.username,
            email: result.email,
            role: result.role,
            emailVerified: result.emailVerified
        }
    })
})

export const refreshTokenController = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        throw new ApiError(
            401,
            "Refresh token missing"
        )
    }
    const result = await refreshTokenService(refreshToken)

    res.cookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 1000
    })

    return res.status(200).json({
        success: true,
        message: "access token refreshed",
        data: {
            accessToken: result.accessToken
        }
    })

})
export const logoutController = asyncHandler(async (req: Request, res: Response) => {

    res.cookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    return res.status(200).json({
        success: true,
        message: "user logged out"
    })
})

export const verifyOtpController = asyncHandler(async (req: Request, res: Response) => {


    const result = await verifyOtp(req.user?.userId, req.body.otp)

    return res.status(200).json({
        success: true,
        message: 'email verified',
        data: result
    })
})

export const resendOtpController = asyncHandler(async (req: Request, res: Response) => {
    const result = await resendOtp(req.user?.userId)

    return res.status(200).json({
        success: true,
        message: 'Otp sent successfully',
        data: result
    })
})

export const forgotPasswordController  = asyncHandler(async(req: Request, res: Response)=> {

    await forgotPassword(req.body.email)

    return res.status(200).json({
        success: true,
        message: "If an account exists, a password reset link has been sent.",

    })
})

export const resetPasswordController = asyncHandler(async(req: Request, res: Response)=> {


    await resetPassword(req.body.token, req.body.newPassword)

    return res.status(200).json({
        success: true,
        message: 'password reset',
    })
})