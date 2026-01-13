import { Router } from "express"
import { personController } from "../controller/person.controller.js"

const personRouter = Router()
personRouter.post("/login", personController.login)
personRouter.post("/register", personController.register)

export {
    personRouter
}