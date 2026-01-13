import { personModel } from "../model/person.model.js"
import bcrypt from "bcrypt"
import { passwordPattern } from "../config/pattern.config.js"
import { generateToken } from "../services/auth.service.js"


const personController = {
    login: async (req, res) => {
        const currentPerson = {
            email: req.body.email || "",
            password: req.body.password || ""
        }
        if (!currentPerson.email || !currentPerson.password) {
            return res.status(422).send({ message: "missing credential" })
        }
        const findPerson = await personModel.findOne({ email: currentPerson.email })
        if (findPerson) {
            const validPassword = await bcrypt.compare(currentPerson.password, findPerson.password)
            if (validPassword) {
                currentPerson.id = findPerson._id
                const token = generateToken(currentPerson)
                return res.status(200).send({ token })
            } else {
                return res.status(401).send({ message: "password or email not match" })
            }
        } else {
            return res.status(404).send({ message: "person not found" })
        }
    },
    register: async (req, res) => {
        const currentPerson = {
            email: req.body.email || "",
            password: req.body.password || "",
            confirmPassword: req.body.confirmPassword || "",
            lastName: req.body.lastName || "",
            firstName: req.body.firstName || ""
        }
        if (!currentPerson.email || !currentPerson.password || !currentPerson.lastName || !currentPerson.firstName) {
            res.status(422).send({ message: "missing credential" })
        }
        else if (currentPerson.confirmPassword !== currentPerson.password) {
            return res.status(422).send({ message: "password not equal no confirmation password" })
        } else if (!passwordPattern.test(currentPerson.password)) {
            return res.status(422).send({ message: "password must be between 6 and 30 characters with no space" })
        }
        const findPerson = await personModel.findOne({ email: currentPerson.email })
        if (!findPerson) {
            try {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(currentPerson.password, salt)
                const insertedPerson = await personModel.insertOne({
                    email: currentPerson.email,
                    password: hashedPassword,
                    lastName: currentPerson.lastName,
                    firstName: currentPerson.firstName
                })
                currentPerson.id = insertedPerson._id
                const token = generateToken(currentPerson)
                return res.status(200).send({ token })
            } catch {
                res.status(400).send({ message: "error while adding person" })
            }
        } else {
            res.status(409).send({ message: "person already exist" })
        }
    }
}

export {
    personController
}