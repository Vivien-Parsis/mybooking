import request from "supertest"
import { app } from "../app.js"
import { databaseConnection } from "../config/database.config.js"
import { personModel } from "../model/person.model.js"
import { roomModel } from "../model/room.model.js"
import { reservationModel } from "../model/reservation.model.js"
import { generateToken } from "../services/auth.service.js"

describe("Reservation Integration Tests", () => {
    let token
    let personId
    let roomId
    let otherPersonId
    let otherToken

    const testPerson = {
        email: "reservtest@test.com",
        password: "password123",
        lastName: "Res",
        firstName: "Test"
    }

    const testRoom = {
        name: "Test Room",
        building: "A",
        floor: "1",
        capacity: 10
    }

    beforeAll(async () => {
        // Create User
        await personModel.deleteMany({ email: testPerson.email })
        const person = await personModel.create(testPerson)
        personId = person._id
        token = generateToken({ email: testPerson.email, id: personId })

        // Create Other User (for auth tests)
        const otherPerson = await personModel.create({ ...testPerson, email: "other@test.com" })
        otherPersonId = otherPerson._id
        otherToken = generateToken({ email: "other@test.com", id: otherPersonId })

        // Create Room
        await roomModel.deleteMany({ name: testRoom.name })
        const room = await roomModel.create(testRoom)
        roomId = room._id
    })

    afterAll(async () => {
        await personModel.deleteMany({ email: { $in: [testPerson.email, "other@test.com"] } })
        await roomModel.deleteMany({ name: testRoom.name })
        await reservationModel.deleteMany({ person: { $in: [personId, otherPersonId] } })
        await databaseConnection.close()
    })

    describe("POST /reservation/person/add", () => {
        it("should return 400 if parameters are missing", async () => {
            const res = await request(app)
                .post("/reservation/person/add")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    room: roomId
                })
            expect(res.statusCode).toBe(400)
            expect(res.text).toBe("Missing parameters")
        })

        it("should return 200 and create reservation", async () => {
            const res = await request(app)
                .post("/reservation/person/add")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    room: roomId,
                    hour: 10,
                    endHour: 12,
                    date: new Date().toISOString()
                })
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty("_id")
            expect(res.body.person).toBe(personId.toString())
        })

        it("should return 400 if room already reserved", async () => {
            const res = await request(app)
                .post("/reservation/person/add")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    room: roomId,
                    hour: 10,
                    endHour: 12,
                    date: new Date().toISOString()
                })
        })
    })
    
    describe("POST /reservation/person/add (Strict)", () => {
        const fixedDate = new Date("2026-01-20").toISOString()

        it("should create reservation", async () => {
             const res = await request(app)
                .post("/reservation/person/add")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    room: roomId,
                    hour: 14,
                    endHour: 16,
                    date: fixedDate
                })
            expect(res.statusCode).toBe(200)
        })

        it("should fail if already reserved", async () => {
            const res = await request(app)
                .post("/reservation/person/add")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    room: roomId,
                    hour: 14,
                    endHour: 16,
                    date: fixedDate
                })
            expect(res.statusCode).toBe(400)
            expect(res.text).toBe("Room already reserved")
        })
    })

    describe("GET /reservation/person", () => {
        it("should return user reservations", async () => {
            const res = await request(app)
                .get("/reservation/person")
                .set("Authorization", `Bearer ${token}`)
            
            expect(res.statusCode).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBeGreaterThan(0)
            expect(res.body[0].room).toHaveProperty("name")
        })
    })

    describe("DELETE /reservation/person", () => {
        let reservId

        beforeEach(async () => {
             const res = await reservationModel.create({
                person: personId,
                room: roomId,
                hour: 18,
                endHour: 20,
                date: new Date()
             })
             reservId = res._id
        })

        it("should return 400 if id missing", async () => {
             const res = await request(app)
                .delete("/reservation/person")
                .set("Authorization", `Bearer ${token}`)
                .send({})
            expect(res.statusCode).toBe(400)
        })

        it("should return 401 if trying to delete other's reservation", async () => {
            const res = await request(app)
                .delete("/reservation/person")
                .set("Authorization", `Bearer ${otherToken}`)
                .send({ id: reservId })
            expect(res.statusCode).toBe(401)
        })

        it("should return 200 and delete reservation", async () => {
            const res = await request(app)
                .delete("/reservation/person")
                .set("Authorization", `Bearer ${token}`)
                .send({ id: reservId })
            expect(res.statusCode).toBe(200)
            
            const check = await reservationModel.findById(reservId)
            expect(check).toBeNull()
        })
    })
})
