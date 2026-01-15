import { generateToken } from "../services/auth.service.js"
import { jwt_secret } from "../config/server.config.js"
import jwt from "jsonwebtoken"

describe("Auth Service Unit Tests", () => {
    describe("generateToken", () => {
        it("should generate a valid JWT token", () => {
            const user = {
                id: "12345",
                email: "test@example.com"
            }

            const token = generateToken(user)
            expect(typeof token).toBe("string")

            const decoded = jwt.verify(token, jwt_secret)
            expect(decoded).toHaveProperty("id", user.id)
            expect(decoded).toHaveProperty("email", user.email)
            expect(decoded).toHaveProperty("iat")
            expect(decoded).toHaveProperty("exp")
        })

        it("should handle empty fields by return null", () => {
            const user = {
                id: "67890",
                email: ""
            }

            const token = generateToken(user)
            expect(token).toBeNull()
        })
        it("should handle wrong fields by return null", () => {
            const user = {
                test: "67890",
                password: "lorem"
            }

            const token = generateToken(user)
            expect(token).toBeNull()
        })
    })
})
