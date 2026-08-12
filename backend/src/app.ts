import express from "express"
import { errorHandler } from "./middleware/error.middleware.js"
import userRoute from "./modules/user/user.route.js"
import userThread from "./modules/thread/thread.route.js"
import like from "./modules/like/like.route.js"
import comment from "./modules/comments/comment.route.js"
import cookieParser from "cookie-parser"
const app = express()


app.use(express.json())
app.use(cookieParser())

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    })
})

app.use('/api/v1/users', userRoute)

app.use('/api/v1/threads', userThread)

app.use('/api/v1', like)

app.use('/api/v1', comment)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "page not found"
    })
})

app.use(errorHandler)
export default app