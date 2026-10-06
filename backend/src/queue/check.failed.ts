import { Queue } from "bullmq";
import { env } from "../config/env.js";

const notificationQueue = new Queue("notification", {
    connection: {
        url: env.REDIS_URL
    }
})

const failedJobs = await notificationQueue.getFailed()

console.log("Failed jobs:", failedJobs.length)

for(const job of failedJobs){
    console.log({
        id: job.id,
        name: job.name,
        data: job.data,
        attemptsMade: job.attemptsMade,
        failedReason: job.failedReason 
    })
}

await notificationQueue.close()