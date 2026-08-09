import { z } from "zod"

export const threadSchema = z.object({
    body: z.object({
        content: z
            .string()
            .trim()
            .min(1)
            .max(200)
    })
})

export const threadIdSchema = z.object({
    params: z.object({
        id: z
            .string()
            .uuid()
    })
})
export const userThreadSchema = z.object({
    params: z.object({
        username: z
            .string()
            .min(3)
            .max(50)
    }),
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

export const updateThreadSchema = z.object({
    params: z.object({
        id: z
            .string()
            .uuid()
    }),
    body: z.object({
        content: z
            .string()
            .trim()
            .min(1)
            .max(200)
    })
})

export type threadInput = z.infer<typeof threadSchema>["body"]
export type updateThreadInput = z.infer<typeof updateThreadSchema>
export type threadIdinput = z.infer<typeof threadIdSchema>["params"]
export type getUserInput = z.infer<typeof userThreadSchema>["params"]