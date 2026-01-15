import request from "supertest"
import { app } from "../app.js"
import { databaseConnection } from "../config/database.config.js"
import { personModel } from "../model/person.model.js"

describe("Person Authentication Integration Tests", () => {
    beforeAll(async () => {
        await personModel.deleteMany({ email: "test@test.com" })
    })

    afterAll(async () => {
        await personModel.deleteMany({ email: "test@test.com" })
        await databaseConnection.close()
    })

    describe("POST /api/v1/person/register", () => {
        it("should return 422 if credentials are missing", async () => {
            const res = await request(app).post("/api/v1/person/register").send({
                email: "",
                password: "password123",
                confirmPassword: "password123",
                lastName: "Doe",
                firstName: "John"
            })
            expect(res.statusCode).toBe(422)
            expect(res.body.message).toBe("missing credential")
        })

        it("should return 422 if password does not match pattern", async () => {
            const res = await request(app).post("/api/v1/person/register").send({
                email: "test@test.com",
                password: "pw",
                confirmPassword: "pw",
                lastName: "Doe",
                firstName: "John"
            })
            expect(res.statusCode).toBe(422)
            expect(res.body.message).toMatch(/password must be/)
        })

        it("should return 422 if email format is invalid", async () => {
            const res = await request(app).post("/api/v1/person/register").send({
                email: "invalid-email-format",
                password: "password123",
                confirmPassword: "password123",
                lastName: "Doe",
                firstName: "John"
            })
            expect(res.statusCode).toBe(422)
            expect(res.body.message).toBe("email not valid")
        })
        
        it("should return 200 and a token on successful registration", async () => {
            const res = await request(app).post("/api/v1/person/register").send({
                email: "test@test.com",
                password: "password123",
                confirmPassword: "password123",
                lastName: "Doe",
                firstName: "John"
            })
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty("token")
        })

        it("should return 409 if person already exists", async () => {
            const res = await request(app).post("/api/v1/person/register").send({   
                email: "test@test.com",
                password: "password123",
                confirmPassword: "password123",
                lastName: "Doe",
                firstName: "John"
            })
            expect(res.statusCode).toBe(409)
            expect(res.body.message).toBe("person already exist")
        })
    })

    describe("POST /api/v1/person/login", () => {
        it("should return 422 if credentials are missing", async () => {
            const res = await request(app).post("/api/v1/person/login").send({
                email: "",
                password: "password123"
            })
            expect(res.statusCode).toBe(422)
            expect(res.body.message).toBe("missing credential")
        })

        it("should return 404 if person not found", async () => {
            const res = await request(app).post("/api/v1/person/login").send({
                email: "nonexistent@test.com",
                password: "password123"
            })
            expect(res.statusCode).toBe(404)
            expect(res.body.message).toBe("person not found")
        })

        it("should return 200 and a token on successful login", async () => {
            const res = await request(app).post("/api/v1/person/login").send({
                email: "test@test.com",
                password: "password123"
            })
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty("token")
        })
    })
})
