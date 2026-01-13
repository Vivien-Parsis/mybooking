const passwordPattern = /^\S{6,30}$/

const emailPattern = /^[a-zA-Z0-9._\-]{1,30}[@][a-zA-Z0-9._\-]{4,12}[.]{1}[a-zA-Z]{2,4}$/

export { passwordPattern, emailPattern }