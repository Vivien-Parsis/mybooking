import { reservationModel } from "../model/reservation.model.js"

const reservationController = {
    getAll: async (req, res) => {
        const reservations = await reservationModel.find({}, "-person")
        res.status(200).send(reservations)
    },
    getAllFromPerson: async (req, res) => {
        const reservations = await reservationModel.find({ person: req.user._id }).sort({ date: 1 }).populate('room')
        res.status(200).send(reservations)
    },
    addReservationForPerson: async (req, res) => {
        const curreservationReservation = {
            person: req.user._id,
            room: req.body.room,
            hour: req.body.hour,
            date: req.body.date,
            endHour: req.body.endHour
        }
        if(!curreservationReservation.person || !curreservationReservation.room || !curreservationReservation.hour || !curreservationReservation.date || !curreservationReservation.endHour){
            return res.status(400).send("Missing parameters")
        }else{
            const alreadyReserved = await reservationModel.findOne({
                room: req.body.room,
                hour: req.body.hour,
                date: req.body.date,
                endHour: req.body.endHour
            })
            if (alreadyReserved) {
                return res.status(400).send("Room already reserved")
            } else {
                const reservation = await reservationModel.create(curreservationReservation)
                res.status(200).send(reservation)
            }
        }
    },
    deleteReservationForPerson: async (req, res) => {
        if(!req.body.id){
            return res.status(400).send("Missing id")
        }else{
            const existingReservation = await reservationModel.findById(req.body.id)
            if (!existingReservation) {
                return res.status(404).send("Reservation not found")
            }else if(!req.user._id.equals(existingReservation.person)){
                return res.status(401).send("You are not authorized to delete this reservation")
            }else{
                const reservation = await reservationModel.findByIdAndDelete(req.body.id)
                res.status(200).send(reservation)
            }
        }
    }
}

export {
    reservationController
}