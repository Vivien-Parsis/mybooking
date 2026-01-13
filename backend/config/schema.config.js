import mongoose from "mongoose"

const personSchema = new mongoose.Schema({
    lastName: { type: String, required: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    email: { type: String, required: true, minLength: 6, maxLength: 40, trim: true },
    password: { type: String, required: true, minLength: 6, maxLength: 80 }
}, { versionKey: false })

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    building: { type: String, required: true, trim: true },
    floor: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, trim: true },
}, { versionKey: false })

const reservationSchema = new mongoose.Schema({
    person: { type: mongoose.Schema.Types.ObjectId, ref: 'person', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'room', required: true },
    hour: { type: Number, require: true },
    endHour: { type: Number, require: true },
    date: { type: Date, require: true }
}, { versionKey: false })

export {
    personSchema,
    roomSchema,
    reservationSchema
}