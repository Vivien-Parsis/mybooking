import autocannon from "autocannon"
import { api_url } from "../config/test.config.js"

const healthCheck = async () => {
    return new Promise((resolve) => {
        const res = autocannon({
            url: `${api_url}/health`,
            connections: 10,
            pipelining: 1,
            duration: 10
        })
        autocannon.track(res, { renderProgressBar: false })
        res.on('done', resolve)
    })
}

const getRoomCheck = async () => {
    return new Promise((resolve) => {
        const res = autocannon({
            url: `${api_url}/room`,
            connections: 10,
            pipelining: 1,
            duration: 2,
        })
        autocannon.track(res, { renderProgressBar: false })
        res.on('done', resolve)
    })
}

const getReservationCheck = async () => {
    const testUser = {
        email: "test.example@gmail.com",
        password: "test123"
    }
    const loginResponse = await fetch(`${api_url}/person/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(testUser)
    })
    const loginData = await loginResponse.json()
    const token = loginData.token
    return new Promise((resolve) => {
        const res = autocannon({
            url: `${api_url}/reservation/person`,
            connections: 10,
            pipelining: 1,
            duration: 2,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        autocannon.track(res, { renderProgressBar: false })
        res.on('done', resolve)
    })
}

const backendError404Check = async () => {
    return new Promise((resolve) => {
        const res = autocannon({
            url: `${api_url}/nonexistent-endpoint`,
            connections: 10,
            pipelining: 1,
            duration: 10
        })
        autocannon.track(res, { renderProgressBar: false })
        res.on('done', resolve)
    })
}

export { healthCheck, getRoomCheck, getReservationCheck, backendError404Check }