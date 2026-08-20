import { z } from "zod"

export const bookmarkSchema = z.object({
    params: z.object({
        threadId: z
            .string()
            .uuid()
    })
})

export const getBookmarkSchema = z.object({
    query: z.object({
        limit: z
            .coerce
            .number()
            .int()
            .min(1)
            .max(10)
            .default(10),
        query: z
            .string()
            .uuid()
            .optional()
    })
})