import { Router } from "express"
import { roomController } from "../controller/room.controller.js"

const roomRouter = Router()
roomRouter.get("/", roomController.getAll)

export {
    roomRouter
}