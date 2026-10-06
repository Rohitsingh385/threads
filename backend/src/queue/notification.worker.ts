import { Worker } from "bullmq";
import { env } from "../config/env.js";
import { createNotification } from "../modules/notification/notification.service.js";
import { NotificationType } from "@prisma/client";

const notificationWorker = new Worker("notification",async (job) => {

        const { recipientId, actorId, threadId } = job.data;

        console.log(`Processing notification job ${job.id}`);

        await createNotification({
            recipientId,
            actorId,
            type: NotificationType.LIKE,
            threadId,
        });

        console.log(`Notification created for job ${job.id}`);
    },
    {
        connection: {
            url: env.BULLMQ_REDIS_URL,
        },
    }
);


notificationWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`)
})

notificationWorker.on("failed", (job, error)=> {
    console.error(`Job ${job?.id} failed:`, error.message)
})