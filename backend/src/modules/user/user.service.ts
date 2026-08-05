import { signupInput, loginInput } from "./user.validation.js";
import { prisma } from "../../config/prisma.js"
import { ApiError } from "../../utils/ApiError.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import bcrypt from "bcrypt"
import { generateOtp } from "../../utils/Otp.js";
import { redisClient } from "../../config/redis.js";
import { sendMail } from "../../utils/transporter.js";

export const signUpService = async (input: signupInput) => {

    const email = input.email.toLowerCase().trim()
    const checkExists = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
                { username: input.username }
            ]
        }
    })
    if (checkExists) {
        throw new ApiError(
            409,
            'user already exists'
        )
    }
    const hashPassword = await bcrypt.hash(input.password, 10)

    const user = await prisma.user.create({
        data: {
            username: input.username,
            email: email,
            password: hashPassword
        }
    })

    const otp = generateOtp()

    await redisClient.set(
        `otp:${user.id}`, otp, {
        EX: 300
    }
    )
    await sendMail(
        user.email,
        "Verify your email",
        `your otp is ${otp}. It expires in 5 mintues.`
    )
    return {
        id: user.id,
        username: user.username,
        email: user.email
    }

}

export const loginService = async (input: loginInput) => {
    const email = input.email.toLocaleLowerCase().trim()
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (!user) {
        throw new ApiError(
            401,
            'invalid email or password'
        )
    }
    const checkPassword = await bcrypt.compare(input.password, user.password)

    if (!checkPassword) {
        throw new ApiError(
            401,
            'invalid email or password'
        )
    }
    const payload = {
        userId: user.id,
        role: user.role
    }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    return {
        accessToken,
        refreshToken
    }
}

export const refreshTokenService = async (token: string) => {

    const payload = verifyRefreshToken(token)

    const user = await prisma.user.findUnique({
        where: {
            id: payload.userId
        }
    })
    if (!user) {
        throw new ApiError(
            401,
            'Invalid refresh token'
        )
    }
    const newPayload = {
        userId: user.id,
        role: user.role
    }
    const accessToken = generateAccessToken(newPayload)
    const refreshToken = generateRefreshToken(newPayload)
    return {
        accessToken,
        refreshToken
    }
}
export const meService = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new ApiError(
            400,
            'user doesnt not exists'
        )
    }
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
    }
}

export const verifyOtp = async (userId: string, otp: string) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new ApiError(
            404,
            'user not found'
        )
    }
    if (user.emailVerified === true) {
        throw new ApiError(
            403,
            'user already verified'
        )
    }
    const storedOtp = await redisClient.get(
        `otp:${userId}`
    )
    console.log(storedOtp, otp)
    if (!storedOtp) {
        throw new ApiError(
            404,
            'invalid or expired otp'
        )
    }
    if (storedOtp !== otp.toString()) {
        throw new ApiError(
            404,
            'invalid or expired otp'
        )
    }
    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            emailVerified: true
        }
    })

    await redisClient.del(`otp:${userId}`)
    return updatedUser
}

export const resendOtp = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new ApiError(
            404,
            'user not found'
        )
    }
    if (user.emailVerified) {
        throw new ApiError(
            400,
            'email already verified'
        )
    }
    const cooldown = await redisClient.get(
        `otp-cooldown:${userId}`
    )
    if (cooldown) {
        throw new ApiError(
            429,
            'please wait before requesting another otp'
        )
    }
    const otp = generateOtp()

    await redisClient.set(
        `otp:${userId}`,
        otp,
        {
            EX: 300,
        }
    )
    await redisClient.set(
        `otp-cooldown:${userId}`,
        "1",
        {
            EX: 30,
        }
    )
    try {
        await sendMail(
            user.email,
            "Verify your email",
            `your OTP is ${otp}. It expires in 5 minutes.`
        )
    }catch(error){
        await redisClient.del(`otp:${userId}`)
        await redisClient.del(`otp-cooldown:${userId}`)
        throw new ApiError(
            500,
            'Failed to send verification email. Please try again.'
        )
    }
    return
}