import { PrismaClient } from "@prisma/client"
import {faker} from "@faker-js/faker"

faker.seed(12345)

const prisma = new PrismaClient()

async function main() {

    const TOTAL_USERS = 100_000
    const TOTAL_THREADS = 500_000
    const BATCH_SIZE = 25_000

    console.log("cleaning users records")
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" CASCADE`)
    console.log("users table truncated")

    const userIds: string[] = []

    const startUserInsertion = performance.now()

    for (let offset = 0; offset < TOTAL_USERS; offset += BATCH_SIZE) {
        const currentBatchSize = Math.min(
            BATCH_SIZE,
            TOTAL_USERS - offset
        )

        const users = Array.from({ length: currentBatchSize }, (_, index) => {
            const userIndex = offset + index
            return {
                username: `benchmark_user_${userIndex}_${faker.internet.username()}`,
                email: `benchmark_user_${userIndex}_${faker.internet.email()}`,
                password: `benchmark-password`
            }
        })
        console.log(`inserting batch: ${offset + 1}- ${offset + currentBatchSize}`)

        await prisma.user.createMany({
            data: users
        })
    }
    const stopUserInsertion = performance.now()
    console.log(`user insertion took ${(stopUserInsertion - startUserInsertion).toFixed(2)} ms`)

    console.log("Fetching user Ids..")
    const users = await prisma.user.findMany({
        select: {
            id: true 
        }
    })
    userIds.push(...users.map(user => user.id))
    console.log(`Fetched ${userIds.length} user IDs`)

    const startThreadInsertion = performance.now()

    for(let offset = 0 ; offset < TOTAL_THREADS; offset += BATCH_SIZE) {
        const currentBatchSize = Math.min(BATCH_SIZE, TOTAL_THREADS - offset)
        const threads  = Array.from({ length: currentBatchSize}, () => {
            const randomUserId = userIds[faker.number.int({ min: 0, max: userIds.length - 1})]

            return {
                content: faker.lorem.sentence(),
                authorId: randomUserId
            }
        })
            console.log(`Inserting threads: ${offset + 1}-${offset + currentBatchSize}`)
            await prisma.thread.createMany({
                data: threads
            })
    }

    const stopThreadInsertion = performance.now()
    console.log(`Thread insertion took ${(stopThreadInsertion - startThreadInsertion).toFixed(2)} ms`)
    console.log("Benchmark dataset generation complete")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())