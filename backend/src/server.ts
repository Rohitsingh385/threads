import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/prisma.js";
import { redisClient } from "./config/redis.js";

const serverHandler = async () => {
    try {

        await connectDB()
        console.log('DB connected')

        await redisClient.connect()

        app.listen(env.PORT, () => {
            console.log(`http://localhost:${env.PORT}`)
        })

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

serverHandler()