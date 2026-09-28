import {PrismaClient} from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main(){
    const password = "BenchmarkPassword123!"

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.upsert({
        where: {
            email: "benchmark@threads.local"
        },
        update:{
            password: hashPassword
        },
        create: {
            username: "benchmark_user",
            email: "benchmark@threads.local",
            password: hashPassword,
            emailVerified: true 
        }
    })
    console.log("Benchmark user created")
    console.log({id: user.id, email: user.email, password})
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())

    