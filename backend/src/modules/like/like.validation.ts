import { z } from "zod"

export const likeSchema = z.object({
    params: z.object({
        threadId: z
            .string()
            .uuid()
    })
})

export const unLikeSchema = z.object({
    params: z.object({
        threadId: z
            .string()
            .uuid()
    })
})