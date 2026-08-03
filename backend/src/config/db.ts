import mongoose from "mongoose"
import { env } from "./env.js"

export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}