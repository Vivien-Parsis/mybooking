import jwt from "jsonwebtoken"
import { jwt_secret } from "../config/server.config.js"

const generateToken = (user) => {
    return user.email && user.id ? jwt.sign({ email: user.email, id: user.id }, jwt_secret, { expiresIn: "2h" }) : null
}

export {
    generateToken
}