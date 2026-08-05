import { z } from "zod"

export const signupSchema = z.object({
    body: z.object({
        username: z
            .string()
            .min(1)
            .max(50)
            .trim(),
        email: z
            .string()
            .trim(),
        password: z
            .string()
            .min(6)
            .max(20)
    })
})
export const loginSchema = z.object({
    body: z.object({
        email: z
            .string()
            .trim(),
        password: z
            .string()
            .min(6)
            .max(20)
    })
})

export const otpSchema = z.object({
    body: z.object({
        otp: z
            .string()
            .trim()
            .min(6)
            .max(6)
    })
})

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z
            .string()
            .trim()
    })
})

export const resetPasswordSchema = z.object({
    body: z.object({
        token: z
            .string()
            .trim(),
        newPassword: z
            .string()
            .trim()
            .min(8)
    })
})
export type signupInput = z.infer<typeof signupSchema>["body"]
export type loginInput = z.infer<typeof loginSchema>["body"]