import { getRoomCheck, healthCheck, backendError404Check, getReservationCheck } from "./test/backend.test.js"
import { loginCheck, homePageAsLoggedCheck, frontendError404Check, reservationPageAsLoggedCheck } from "./test/frontend.test.js"


console.log("\n######Backend Api Health Check######\n")
healthCheck().then(() => {
    console.log("\n######Backend Api Get Room Check######\n")
    return getRoomCheck()
}).then(() => {
    console.log("\n######Backend Api 404 Error Check######\n")
    return backendError404Check()
}).then(() => {
    console.log("\n######Backend Api Get Reservation Check######\n")
    return getReservationCheck()
}).then(() => {
    console.log("\n######Frontend Page Login Check######\n")
    return loginCheck()
}).then(() => {
    console.log("\n######Frontend Page Get Room As Logged Check######\n")
    return homePageAsLoggedCheck()
}).then(() => {
    console.log("\n######Frontend Page 404 Error Check######\n")
    return frontendError404Check()
}).then(() => {
    console.log("\n######Frontend Page Reservation As Logged Check######\n")
    return reservationPageAsLoggedCheck()
})