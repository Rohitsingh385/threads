import { signupInput, loginInput } from "./user.validation.js";
import { User } from "./user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import bcrypt from "bcrypt"
export const signUpService = async (data: signupInput) => {

    const checkExists = await User.findOne({
        email: data.email
    })
    if (checkExists) {
        throw new ApiError(
            409,
            'user already exists'
        )
    }

    const user = await User.create(data)

    return {
        id: user._id,
        username: user.username,
        email: user.email
    }

}

export const loginService = async (data: loginInput) => {

    const user = await User.findOne({
        email: data.email
    }).select("+password")

    if (!user) {
        throw new ApiError(
            401,
            'invalid email or password'
        )
    }
    const checkPassword = await bcrypt.compare(data.password, user.password)
    if (!checkPassword) {
        throw new ApiError(
            401,
            'invalid email or password'
        )
    }
    const payload = {
        userId: user._id.toString(),
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

    const user = await User.findById(payload.userId)
    if (!user) {
        throw new ApiError(
            401,
            'Invalid refresh token'
        )
    }
    const newPayload = {
        userId: user._id.toString(),
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
    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(
            400,
            'user doesnt not exists'
        )
    }
    return user
}