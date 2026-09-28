import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/prisma.js";
import { redisClient } from "./config/redis.js";
import dns from "node:dns"

dns.setDefaultResultOrder("ipv4first")

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

        app.listen(env.PORT, () => {
            console.log(`http://localhost:${env.PORT}`)
        })

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

serverHandler()