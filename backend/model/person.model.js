import { personSchema } from "../config/schema.config.js"
import { databaseConnection } from '../config/database.config.js'

const personModel = databaseConnection.model("person", personSchema, "person")

export { personModel }