import dotenv from "dotenv"
dotenv.config()

import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,     // don't fail requests during reconnect
  retryStrategy(times) {
    return Math.min(times * 500, 5000)
  },
  reconnectOnError() {
    return true
  },
})

redis.on("connect", () => console.log("redis connected"))
redis.on("error", (err) => console.error("redis error:", err.message))

export default redis