import { z } from "zod"


export const getNotificationSchema = z.object({
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
            .trim()
            .optional()
    })
})

export const notificationIdSchema = z.object({
    params: z.object({
        notificationId: z
            .string()
            .uuid()
    })
})