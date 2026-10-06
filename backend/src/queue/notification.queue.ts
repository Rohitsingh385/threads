import { Queue } from "bullmq"
import { env } from "../config/env.js"

export interface LikeNotificationJob {
    recipientId: string
    actorId: string
    threadId: string 
}

export const notificationQueue = new Queue<LikeNotificationJob>("notification", {
    connection:{
        url: env.BULLMQ_REDIS_URL
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000
        }
    }
})

