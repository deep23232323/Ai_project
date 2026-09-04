import dotenv from "dotenv"
dotenv.config()
import express from "express"

import connect from "./config/db.js"
import router from "./routes/auth.route.js"
const port = process.env.PORT
const app = express()
app.use(express.json())

app.use("/", router)

app.get("/", (req, res) => {
    return res.json("hello from auth")
})



app.listen(port, () => {
    console.log(`auth service  started on port ${port}`)
    connect()
})