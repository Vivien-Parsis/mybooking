import { passwordPattern, emailPattern } from "../config/pattern.config.js"

const isValidPassword = (password) => {
    return (!password || typeof password !== 'string') ? false : passwordPattern.test(password)
}

const isValidEmail = (email) => {
    return (!email || typeof email !== 'string') ? false : emailPattern.test(email)
}

export { isValidPassword, isValidEmail }