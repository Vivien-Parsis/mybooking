import { jwt_secret } from "../config/server.config.js"
import jwt from "jsonwebtoken"
import { personModel } from "../model/person.model.js"

const checkRouteJwt = async (req, res, next) => {
    const authHeader = req.headers.authorization || ""
    if (!authHeader) {
        return res.send({ message: "missing jwt token" })
    }
    if (!authHeader.startsWith("Bearer ")) {
        return res.send({ message: "missing bearer key" })
    }

    try {
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, jwt_secret)

        const personSearch = await personModel.findOne({ email: decoded.email || '' })
        if (personSearch) {
            req.user = { _id: personSearch._id }
            next()
        } else {
            return res.status(400).send({ message: "error with jwt token" })
        }
    } catch (err) {
        return res.status(400).send({ message: "error while decode or search for token" })
    }
}

export {
    checkRouteJwt
}