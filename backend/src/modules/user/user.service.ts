import { signupInput, loginInput, updateInputs } from "./user.validation.js";
import { prisma } from "../../config/prisma.js"
import { ApiError } from "../../utils/ApiError.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import bcrypt from "bcrypt"
import { generateOtp } from "../../utils/Otp.js";
import { redisClient } from "../../config/redis.js";
import { sendMail } from "../../utils/transporter.js";
import { generateHexToken } from "../../utils/token.js";
import { uploadToCloudinary, deleteToCloudinary } from "../../utils/Upload.js";
import { UploadApiResponse } from "cloudinary";

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
        emailVerified: user.emailVerified,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        avatarPublicId: user.avatarPublicId
    }
}
export const getDetails = async (username: string, userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
    if (!user) {
        throw new ApiError(
            400,
            'user doesnt not exists'
        )
    }

    const [threadsCount, followersCount, followingCount] = await Promise.all([
        prisma.thread.count({
            where: {
                authorId: user.id 
            }
        }),
        prisma.follow.count({
            where: {
                followingId: user.id 
            }
        }),
        prisma.follow.count({
            where: {
                followerId: user.id
            }
        })
    ])

    let isFollowing =false 
    if(userId){
        const follow = await prisma.follow.findUnique({
            where: {
                followingId_followerId: {
                    followerId: userId,
                    followingId: user.id
                }
            }
        })
        isFollowing = !!follow
    }

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        avatarPublicId: user.avatarPublicId,
        isFollowing,
        threadsCount,
        followersCount,
        followingCount
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
    } catch (error) {
        await redisClient.del(`otp:${userId}`)
        await redisClient.del(`otp-cooldown:${userId}`)
        throw new ApiError(
            500,
            'Failed to send verification email. Please try again.'
        )
    }
    return
}

export const forgotPassword = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (!user) {
        throw new ApiError(
            404,
            'user not found'
        )
    }

    const resetToken = generateHexToken()


    await redisClient.set(
        `password-reset:${resetToken}`,
        user.id.toString(),
        {
            EX: 900
        }
    )
    const resetLink = `https://localhost:5000/api/v1/reset-password?=${resetToken}`

    try {
        sendMail(
            user.email,
            "Reset your password",
            `Click the link below to reset your password:
            
            ${resetLink}

            The link expires in 15 minutes.
            `
        )
    } catch (error) {
        await redisClient.del(
            `password-reset:${resetToken}`
        )

        throw new ApiError(
            500,
            'Failes to send reset email.Please try again'
        )
    }
}

export const resetPassword = async (token: string, newPassword: string) => {

    const userId = await redisClient.get(
        `password-reset:${token}`
    )
    if (!userId) {
        throw new ApiError(
            400,
            'invalid or expired reset token'
        )
    }

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

    const hashPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            password: hashPassword
        }
    })

    await redisClient.del(
        `password-reset:${token}`
    )
    return
}

export const updateProfile = async (userId: string, data: updateInputs) => {
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
    let updatedField = {}

    if (data.body?.username !== undefined) {
        updatedField = {
            ...updatedField,
            username: data.body.username
        }
    }
    if (data.body?.bio !== undefined) {
        updatedField = {
            ...updatedField,
            bio: data.body.bio
        }
    }

    let result: UploadApiResponse | undefined;
    if (data.file) {


        const signature = data.file.buffer.subarray(0, 4).toString("hex")
        const isJpeg = signature.startsWith("ffd8ff")
        const isPng = signature === "89504e47"
        if (!isJpeg && !isPng) {
            throw new ApiError(
                400,
                "invalid file"
            )
        }

        result = await uploadToCloudinary(data.file.buffer)
        if (user.avatarPublicId) {
            await deleteToCloudinary(user.avatarPublicId)
        }
        updatedField = {
            ...updatedField,
            avatarUrl: result.secure_url,
            avatarPublicId: result.public_id
        }

    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: updatedField
    })

    return {
        username: updatedUser.username,
        bio: updatedUser.bio,
        avatarUrl: updatedUser.avatarUrl
    }
}