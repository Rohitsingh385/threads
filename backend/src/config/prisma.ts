import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    log: ["query"]
})

export async function connectDB(){
    await prisma.$connect()
}