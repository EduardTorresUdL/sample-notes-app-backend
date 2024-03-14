require('dotenv').config()

const PORT = process.env.PORT
const SQLITE_URL = process.env.NODE_ENV === 'test'
    ? process.env.TEST_SQLITE_URL
    : process.env.SQLITE_URL

module.exports = { SQLITE_URL, PORT }