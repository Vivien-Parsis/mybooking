import { roomSchema } from "../config/schema.config.js"
import { databaseConnection } from '../config/database.config.js'

const roomModel = databaseConnection.model("room", roomSchema, "room")

export { roomModel }