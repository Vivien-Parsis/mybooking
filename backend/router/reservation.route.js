import { Router } from "express"
import { reservationController } from "../controller/reservation.controller.js"

const reservationRouter = Router()
reservationRouter.get("/", reservationController.getAll)
reservationRouter.get("/person", reservationController.getAllFromPerson)
reservationRouter.post("/person/add", reservationController.addReservationForPerson)
reservationRouter.delete("/person", reservationController.deleteReservationForPerson)

export {
    reservationRouter
}