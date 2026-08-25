import { redisClient } from "../config/redis.js";

export const getCache = async<T>(key: string): Promise<T | null> => {
    try {
        const value = await redisClient.get(key)

        if (!value) {
            return null
        }
        return JSON.parse(value) as T
    } catch (error) {
        console.error("Redis GET failed:", error)
        return null
    }

}

export const setCache = async<T>(key: string, value: T, ttl: number): Promise<void> => {
    try {
        await redisClient.set(key, JSON.stringify(value), {
            EX: ttl
        })
    } catch (error) {

    }
}


export const incrementCounter = async(key: string, windowSeconds: number): Promise<number> => {
    const count = await redisClient.incr(key)
    if(count === 1){
        await redisClient.expire(key, windowSeconds)
    }
    return count
}

export const getCacheTTL = async(key: string): Promise<number> => {
    return await redisClient.ttl(key)
}