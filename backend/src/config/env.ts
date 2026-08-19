import dotenv from "dotenv"
dotenv.config()
import { z } from "zod"

const envSchema = z.object({
    PORT: z
        .coerce
        .number()
        .int(),
    ACCESS_TOKEN: z
        .string()
        .trim(),
    REFRESH_TOKEN: z
        .string()
        .trim(),
    REDIS_URL: z
        .string()
        .trim(),
    EMAIL_USER: z
        .string()
        .trim(),
    EMAIL_APP_PASSWORD: z
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
})

export const env = envSchema.parse(process.env)