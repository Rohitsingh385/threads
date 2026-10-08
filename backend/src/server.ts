import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB, prisma } from "./config/prisma.js";
import { redisClient } from "./config/redis.js";
import "./queue/notification.worker.js"
import dns from "node:dns"
import { logger } from "./utils/logger.js";
dns.setDefaultResultOrder("ipv4first")

let server: ReturnType<typeof app.listen>

const serverHandler = async () => {
    try {

        await connectDB()
        console.log('DB connected')

        try {
            await redisClient.connect()
            console.log("REdis connected")
        } catch (erorr) {
            console.error("Redis unavailable, continuing without Redis")
        }

         server = app.listen(env.PORT, () => {
            logger.info("server started", {
                port: env.PORT
            })
        })

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

const shutdown = async(signal: string) => {
    console.log(`${signal} received. starting graceful shutdown..`)
    server.close(async()=> {
        console.log(`http server closed`)
        
        await prisma.$disconnect()
        console.log(`prisma disconnected`)

        await redisClient.quit()
        console.log(`redis disconnected`)

        process.exit(0)
    })
}

process.on("SIGTERM", () => shutdown("SIGTERM"))
process.on("SIGINT", ()=> shutdown("SIGINT"))


serverHandler()