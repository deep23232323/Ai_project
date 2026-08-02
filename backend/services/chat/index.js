import dotenv from "dotenv"
dotenv.config()
import express from "express"
import connect from "./config/db.js"
import router from "./routes/chat.route.js";

const port = process.env.port
const app = express()
app.use(express.json())

app.use("/",router)

app.get("/", (req, res) => {
    return res.json("hello from chat")
})



app.listen(port, () => {
    console.log(`chat service  started on port ${port}`)
    connect()
})