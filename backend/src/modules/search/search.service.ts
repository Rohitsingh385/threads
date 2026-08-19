import { prisma } from "../../config/prisma.js"



export const searchUsers = async (query: string, limit: number, page: number) => {
    const skip = (page - 1) * limit
    const users = await prisma.user.findMany({
        where: {
            username: {
                contains: query,
                mode: "insensitive"
            }
        },
        orderBy: {
            username: "asc"
        },
        skip: skip,
        take: limit,
        select: {
            id: true,
            username: true,
            bio: true,
            avatarUrl: true
        }
    })
    return users
}