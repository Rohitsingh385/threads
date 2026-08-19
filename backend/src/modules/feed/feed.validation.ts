import {z} from "zod"

export const getFeedSchema = z.object({
    query: z.object({
        limit: z    
            .coerce
            .number()
            .int()
            .min(1)
            .max(10)
            .default(10),
        cursor: z
            .string()
            .uuid()
            .optional()
    })
})