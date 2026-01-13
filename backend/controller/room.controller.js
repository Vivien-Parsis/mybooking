import { roomModel } from "../model/room.model.js"

const roomController = {
    getAll: async (req, res) => {
        const rooms = await roomModel.find()
        res.status(200).send(rooms)
    }
}

export {
    roomController
}