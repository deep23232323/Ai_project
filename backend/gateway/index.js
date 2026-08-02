import dotenv from "dotenv"
dotenv.config()
import express from "express"
import proxy from "express-http-proxy"
import cors from "cors"
import cookieParser from "cookie-parser"
import protect from "./middleware/auth.middleware.js";
import { getCurrentUser } from "./controller/user.controller.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
import morgan from "morgan"
const port = process.env.port
const app = express()
app.use(express.json())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

app.use(morgan('dev'))
app.use(cookieParser())

app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL))
app.use("/api/chat", protect, proxyWithHeader(process.env.CHAT_SERVICE_URL))
app.use("/api/agent",protect, proxy(process.env.AGENT_SERVICE_URL))
app.get("/api/me", protect, getCurrentUser)

app.get("/", (req, res) => {
    return res.json("hello from gateway")
})

app.listen(port, () => {
    console.log(`gateway started on port ${port}`)
})