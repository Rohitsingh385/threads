import { signupInput, loginInput } from "./user.validation.js";
import { prisma } from "../../config/prisma.js"
import { ApiError } from "../../utils/ApiError.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import bcrypt from "bcrypt"

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
        where : {
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