import { z } from "zod"


export const createCommentSchema = z.object({
    params: z.object({
        threadId: z
            .string()
            .uuid()
    }),
    body: z.object({
        content: z
            .string()
            .min(1)
            .max(100),
        parentCommentId: z
            .string()
            .uuid()
            .optional()
    }),

})

export const getCommentsSchema = z.object({
    params: z.object({
        threadId: z
            .string()
            .uuid(),
    }),
    query: z.object({
        parentId: z
            .string()
            .transform(value => value === 'null' ? null : value)
            .pipe(z.string().uuid().nullable())
            .optional(),
        cursor: z
            .string()
            .transform(value => value === 'null' ? null : value)
            .pipe(z.string().uuid().nullable())
            .optional(),
        limit: z
            .coerce
            .number()
            .int()
            .min(1)
            .max(2)
            .default(1)
    })
})

export const updateCommentSchema = z.object({
    params: z.object({
        commentId: z
            .string()
            .uuid()
    }),
    body: z.object({
        content: z
            .string()
            .min(1)
            .max(100)
    }),

})

export const deleteCommentSchema = z.object({
    params: z.object({
        commentId: z
            .string()
            .uuid()
    })
})