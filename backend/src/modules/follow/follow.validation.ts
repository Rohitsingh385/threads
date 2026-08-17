import {z} from "zod"

export const followSchema = z.object({
    params: z.object({
        username: z
            .string()
            .min(3)
            .max(50)
            .trim()
    })
})
