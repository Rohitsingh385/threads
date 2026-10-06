import { notificationQueue } from "./notification.queue.js";

await notificationQueue.add("like-notification", {
    recipientId: "244411ba-a7ac-4877-9c90-2926c6fdeac3",
    actorId: "0005036c-bd29-472e-b6cf-dec92af9d911",
    threadId: "000005d4-8030-483c-8a0e-3daf335a1e7e",
});

console.log("job added")

await notificationQueue.close()