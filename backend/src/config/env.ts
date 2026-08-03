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
        .trim()
})

export const env = envSchema.parse(process.env)