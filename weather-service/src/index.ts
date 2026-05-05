import express from "express"
import cors from "cors"
import 'dotenv/config'

import weatherRoutes from "./routes/weather.routes.js"

const app = express()
const PORT = process.env.PORT || 4001;

app.use(cors())
app.use(express.json())

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AgroAI Weather Service"
  })
})

app.use("/api/weather", weatherRoutes)

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Weather service running on port ${PORT}`)
})