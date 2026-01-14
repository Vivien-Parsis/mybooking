import autocannon from "autocannon"
import { api_url, front_url } from "../config/test.config.js"

const loginCheck = async () => {
    return new Promise((resolve) => {
        const res = autocannon({
            url: `${front_url}/login`,
            connections: 10,
            pipelining: 1,
            duration: 10
        })
        autocannon.track(res, { renderProgressBar: false })
        res.on('done', resolve)
    })
}

const homePageAsLoggedCheck = async () => {
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
            url: `${front_url}`,
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

const reservationPageAsLoggedCheck = async () => {
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
            url: `${front_url}/person/reservation`,
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

const frontendError404Check = async () => {
    return new Promise((resolve) => {
        const res = autocannon({
            url: `${front_url}/nonexistent-page`,
            connections: 10,
            pipelining: 1,
            duration: 10
        })
        autocannon.track(res, { renderProgressBar: false })
        res.on('done', resolve)
    })
}

export { loginCheck, homePageAsLoggedCheck, frontendError404Check, reservationPageAsLoggedCheck }