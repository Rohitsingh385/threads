import { z } from "zod"

export const likeSchema = z.object({
    params: z.object({
        threadId: z
            .string()
            .uuid()
    })
})
