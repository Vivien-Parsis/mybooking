import { reservationSchema } from "../config/schema.config.js"
import { databaseConnection } from '../config/database.config.js'

const reservationModel = databaseConnection.model("reservation", reservationSchema, "reservation")

export { reservationModel }