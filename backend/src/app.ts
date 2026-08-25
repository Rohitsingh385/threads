import express from "express"
import { errorHandler } from "./middleware/error.middleware.js"
import userRoute from "./modules/user/user.route.js"
import userThread from "./modules/thread/thread.route.js"
import like from "./modules/like/like.route.js"
import comment from "./modules/comments/comment.route.js"
import follow from "./modules/follow/follow.route.js"
import feed from "./modules/feed/feed.route.js"
import search from "./modules/search/search.route.js"
import bookmark from "./modules/bookmarks/bookmark.route.js"
import notification from "./modules/notification/notification.route.js"
import cookieParser from "cookie-parser"
import { rateLimit } from "./middleware/rateLimit.middleware.js"
import helmet from "helmet"
import cors from "cors"
const apiRateLimit = rateLimit({
    limit: 100,
    windowSeconds: 60,
    keyPrefix: "api"
})
const app = express()


app.use(helmet())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())



app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    })
})

app.use(apiRateLimit)

app.use('/api/v1/users', userRoute)

app.use('/api/v1', bookmark)

app.use('/api/v1', search)

app.use('/api/v1', feed)

app.use('/api/v1', follow)

app.use('/api/v1', like)

app.use('/api/v1', comment)

app.use('/api/v1', notification)

app.use('/api/v1/threads', userThread)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "page not found"
    })
})

app.use(errorHandler)
export default app