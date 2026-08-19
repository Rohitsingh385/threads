import {z} from "zod"

export const searchByUsernameSchema = z.object({
   params: z.object({
        username: z 
            .string()
            .trim()
            .min(1)
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
        page: z
            .coerce
            .number()
            .int()
            .min(1)
            .default(1)
   })
})