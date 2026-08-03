import express from "express"
import { errorHandler } from "./middleware/error.middleware.js"
const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    })
})


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "page not found"
    })
})

app.use(errorHandler)
export default app