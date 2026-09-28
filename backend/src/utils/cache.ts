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


export const incrementCounter = async (key: string, windowSeconds: number): Promise<number | null> => {
    try {
        const count = await redisClient.incr(key)
        if (count === 1) {
            await redisClient.expire(key, windowSeconds)
        }
        return count
    } catch (error) {
        console.error("Redis INCR failed:", error)
        return null
    }

}

export const getCacheTTL = async (key: string): Promise<number> => {
    return await redisClient.ttl(key)
}

export const deleteFeedCache = async (userId: string): Promise<void> => {
    try {
        const pattern = `feed:user:${userId}:*`
        const keys: string[] = []

        for await (const keys of redisClient.scanIterator({ MATCH: pattern })) {
            for (const key of keys) {
                await redisClient.del(key)
            }
        }

    } catch {

    }
}

export async function acquireLock(key: string, ttlSeconds: number): Promise<boolean> {
    try {
        const result = await redisClient.set(`lock:${key}`, "1", { NX: true, EX: ttlSeconds })

        return result === "OK"
    } catch (error) {
        console.error("Redis LOCK failed:", error);
        return false
    }
}

export async function releaseLock(key: string): Promise<void> {
    try {
        await redisClient.del(`lock:${key}`)
    } catch (error) {
        console.error("Redis UNLOCK failed:", error)
    }
}