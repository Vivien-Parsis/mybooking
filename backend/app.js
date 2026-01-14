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

app.use('/api/v1/health', (req, res) => {
    return res.status(200).send({ "message": "ok" })
})

app.use('/api/v1/person', personRouter)
app.use('/api/v1/reservation', checkRouteJwt, reservationRouter)
app.use('/api/v1/room', roomRouter)

app.use((req, res, next) => {
    return res.status(req.path === "/" ? 200 : 404)
        .send({ "message": `${req.path === "/" ? "EasyBooking api" : "page not found"}` })
})

export { app }