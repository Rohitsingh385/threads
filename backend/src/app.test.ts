import request from "supertest"
import { jest } from "@jest/globals"
import { redisClient } from "./config/redis.js"


jest.unstable_mockModule("./utils/transporter.js", () => ({
    sendMail: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
}))

beforeAll(async () => {
    await redisClient.connect()
})

afterAll(async () => {
    await redisClient.quit()
})
const { default: app } = await import("./app.js")

describe("GET /health", () => {
    it("should return 200 when the server is healthy", async () => {
        const response = await request(app).get("/health")

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("Server is running")
    })
})

describe("POST /api/v1/users/signup", () => {
    it("should create a new user", async () => {
        const username = `testuser_${Date.now()}`
        const email = `test_${Date.now()}@example.com`

        const response = await request(app)
            .post("/api/v1/users/signup")
            .send({
                username,
                email,
                password: "password123"
            })

        expect(response.status).toBe(201)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("user created")

        expect(response.body.result).toHaveProperty("id")
        expect(response.body.result.username).toBe(username)
        expect(response.body.result.email).toBe(email)
        expect(response.body.result).not.toHaveProperty("password")
    })
})

describe("POST /api/v1/users/login", () => {

    it("should login in an existing user", async () => {
        const username = `loginuser_${Date.now()}`
        const email = `email_${Date.now()}@example.com`
        const password = "password123"

        await request(app)
            .post("/api/v1/users/signup")
            .send({
                username,
                email,
                password
            })
        const response = await request(app)
            .post("/api/v1/users/login")
            .send({
                email,
                password
            })

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("user loggedIn")

        expect(response.body.data).toHaveProperty("accessToken")
        expect(response.headers["set-cookie"]).toBeDefined()
    })

    it("should reject login with an incorrect password", async () => {
        const username = `wrongpass_${Date.now()}`
        const email = `wrongpass_${Date.now()}@example.com`
        const password = "password123"

        await request(app)
            .post("/api/v1/users/signup")
            .send({
                username,
                email,
                password
            })
        const response = await request(app)
            .post("/api/v1/users/login")
            .set("X-Forwarded-For", `10.0.0.${Math.floor(Math.random() * 200) + 1}`)
            .send({
                email,
                password: "wrongpassword"
            })
        expect(response.status).toBe(401)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe("invalid email or password")
    })

})


describe("POST /api/v1/threads", () => {
    it("should create a thread for an authenticated user", async () => {
        const username = `threaduser_${Date.now()}`
        const email = `thread_${Date.now()}@example.com`
        const password = "password123"

        await request(app)
            .post("/api/v1/users/signup")
            .send({
                username,
                email,
                password
            })
        const loginResponse = await request(app)
            .post("/api/v1/users/login")
            .set("X-Forwarded-For", `10.0.0.${Math.floor(Math.random() * 200) + 1}`)
            .send({
                email,
                password
            })
        const accessToken = loginResponse.body.data.accessToken
        const response = await request(app)
            .post("/api/v1/threads")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                content: "This is my test thread"
            })

        expect(response.status).toBe(201)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("created")

        expect(response.body.data).toHaveProperty("id")
        expect(response.body.data.content).toBe("This is my test thread")
    })
    it("should reject creating a thread without authentication", async() => {
        const response = await request(app)
            .post("/api/v1/threads")
            .send({
                content: "this should not be created"
            })
        expect(response.status).toBe(401)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe("authorization failed")
    })
})