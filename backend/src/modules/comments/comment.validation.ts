import { z } from "zod"


export const createCommentSchema = z.object({
    body: z.object({
        content: z
            .string()
            .min(1)
            .max(100),
        parentCommentId: z
            .string()
            .min(1)
            .max(100)
            .optional()
    }),

}) 