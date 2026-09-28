import { createClient } from "redis";
import { env } from "./env.js";

export const redisClient = createClient({
    url: env.REDIS_URL,
    socket: {
        reconnectStrategy: false
    }
})

redisClient.on('connect', ()=> {
    console.log('redis connected')
})

redisClient.on('error', (err)=> {
    console.log('redis not connected', err)
})