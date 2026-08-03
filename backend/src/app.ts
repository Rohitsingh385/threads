import express from "express"
const app = express()

app.use(express.json())

app.get('/health', (req,res)=> {
    res.status(200).json({
        success: true,
        message: "Server is running"
    })
})


app.use((req,res)=> {
    res.status(404).json({
        success: false,
        message: "page not found"
    })
})
export default app