import dotenv from "dotenv"

dotenv.config()

const api_url = process.env.API_URL || "http://localhost:3000/api/v1"
const front_url = process.env.FRONT_URL || "http://localhost:5173"

export { api_url, front_url }