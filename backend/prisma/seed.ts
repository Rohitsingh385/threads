import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
    console.log("Seeding...")

    // ── Users ──────────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash("password123", 10)

    const users = await Promise.all(
        Array.from({ length: 10 }).map(() =>
            prisma.user.create({
                data: {
                    username: faker.internet.username().slice(0, 20).toLowerCase(),
                    email: faker.internet.email().toLowerCase(),
                    password: hashedPassword,
                    bio: faker.lorem.sentence(),
                    emailVerified: true,
                },
            })
        )
    )
    console.log(`Created ${users.length} users`)

    // ── Threads ────────────────────────────────────────────────────────────
    const threads = await Promise.all(
        users.flatMap((user) =>
            Array.from({ length: 5 }).map(() =>
                prisma.thread.create({
                    data: {
                        content: faker.lorem.sentences({ min: 1, max: 3 }).slice(0, 200),
                        authorId: user.id,
                    },
                })
            )
        )
    )
    console.log(`Created ${threads.length} threads`)

    // ── Likes ──────────────────────────────────────────────────────────────
    const likeSet = new Set<string>()
    const likePairs: { userId: string; threadId: string }[] = []

    for (const user of users) {
        const shuffled = faker.helpers.shuffle(threads).slice(0, 8)
        for (const thread of shuffled) {
            const key = `${user.id}:${thread.id}`
            if (!likeSet.has(key) && thread.authorId !== user.id) {
                likeSet.add(key)
                likePairs.push({ userId: user.id, threadId: thread.id })
            }
        }
    }

    for (const { userId, threadId } of likePairs) {
        await prisma.$transaction([
            prisma.like.create({ data: { userId, threadId } }),
            prisma.thread.update({
                where: { id: threadId },
                data: { likesCount: { increment: 1 } },
            }),
        ])
    }
    console.log(`Created ${likePairs.length} likes`)

    // ── Comments ───────────────────────────────────────────────────────────
    const comments = await Promise.all(
        threads.slice(0, 20).flatMap((thread) =>
            Array.from({ length: 3 }).map(() => {
                const randomUser = faker.helpers.arrayElement(users)
                return prisma.$transaction(async (tx) => {
                    const comment = await tx.comment.create({
                        data: {
                            content: faker.lorem.sentence(),
                            threadId: thread.id,
                            userId: randomUser.id,
                        },
                    })
                    await tx.thread.update({
                        where: { id: thread.id },
                        data: { commentsCount: { increment: 1 } },
                    })
                    return comment
                })
            })
        )
    )
    console.log(`Created ${comments.length} comments`)

    // ── Replies ────────────────────────────────────────────────────────────
    const topLevelComments = comments.flat().slice(0, 15)
    for (const parent of topLevelComments) {
        const randomUser = faker.helpers.arrayElement(users)
        await prisma.$transaction(async (tx) => {
            await tx.comment.create({
                data: {
                    content: faker.lorem.sentence(),
                    threadId: parent.threadId,
                    userId: randomUser.id,
                    parentId: parent.id,
                },
            })
            await tx.thread.update({
                where: { id: parent.threadId },
                data: { commentsCount: { increment: 1 } },
            })
        })
    }
    console.log(`Created ${topLevelComments.length} replies`)

    // ── Follows ────────────────────────────────────────────────────────────
    const followSet = new Set<string>()
    const followPairs: { followerId: string; followingId: string }[] = []

    for (const user of users) {
        const others = faker.helpers.shuffle(users.filter((u) => u.id !== user.id)).slice(0, 4)
        for (const target of others) {
            const key = `${user.id}:${target.id}`
            if (!followSet.has(key)) {
                followSet.add(key)
                followPairs.push({ followerId: user.id, followingId: target.id })
            }
        }
    }

    for (const { followerId, followingId } of followPairs) {
        await prisma.$transaction([
            prisma.follow.create({ data: { followerId, followingId } }),
            prisma.user.update({
                where: { id: followerId },
                data: { followingCount: { increment: 1 } },
            }),
            prisma.user.update({
                where: { id: followingId },
                data: { followerCount: { increment: 1 } },
            }),
        ])
    }
    console.log(`Created ${followPairs.length} follows`)

    console.log("Seeding complete!")
    console.log("Login with any seeded user — password is: password123")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
