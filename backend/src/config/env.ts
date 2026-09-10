import dotenv from "dotenv"
dotenv.config()
import { z } from "zod"

const envSchema = z.object({
    PORT: z
        .coerce
        .number()
        .int(),
    CLIENT_URL: z   
        .string()
        .trim(),
    ACCESS_TOKEN: z
        .string()
        .trim(),
    REFRESH_TOKEN: z
        .string()
        .trim(),
    REDIS_URL: z
        .string()
        .trim(),
    CLOUDINARY_CLOUD_NAME: z
        .string()
        .trim(),
    CLOUDINARY_API_KEY: z
        .string()
        .trim(),
    CLOUDINARY_API_SECRET: z
        .string()
        .trim(),
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    RESEND_API_KEY: z
        .string()
})

export const env = envSchema.parse(process.env)