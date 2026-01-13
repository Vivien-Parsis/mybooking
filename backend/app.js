import express from "express"
import cors from "cors"
import { personRouter } from "./router/person.route.js"
import { reservationRouter } from "./router/reservation.route.js"
import { roomRouter } from "./router/room.route.js"
import { checkRouteJwt } from "./middleware/auth.middleware.js"
const app = express()

app.use(express.json())
app.use(cors({ origin: '*' }))

app.use(express.json())

app.use('/person', personRouter)
app.use('/reservation', checkRouteJwt, reservationRouter)
app.use('/room', roomRouter)

app.use((req, res, next) => {
    return res.status(req.path === "/" ? 200 : 404)
        .send({ "message": `${req.path === "/" ? "myBooking api" : "page not found"}` })
})

export { app }