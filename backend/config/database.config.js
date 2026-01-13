import mongoose from 'mongoose'
import { db_url } from "./server.config.js"

const databaseConnection = mongoose.createConnection(db_url)

export { databaseConnection }