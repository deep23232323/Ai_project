import dotenv from "dotenv"
dotenv.config()
import express from "express"
import connect from "./config/db.js"
import router from "./routes/agent.route.js";


const port = process.env.PORT
const app = express()
app.use(express.json())


app.use("/", router)
app.get("/", (req, res) => {
    return res.json("hello from agent")
})



app.listen(port, () => {
    console.log(`agent service  started on port ${port}`)
    connect()
})