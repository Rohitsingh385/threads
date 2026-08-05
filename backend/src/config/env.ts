import dotenv from "dotenv"
dotenv.config()
import { z } from "zod"

const envSchema = z.object({
    PORT: z
        .coerce
        .number()
        .int(),
    MONGO_URI: z
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
    EMAIL_USER: z
        .string()
        .trim(),
    EMAIL_APP_PASSWORD: z
        .string()
        .trim(),
})

export const env = envSchema.parse(process.env)