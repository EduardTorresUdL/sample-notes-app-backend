const config = require("./config")
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database(config.SQLITE_URL)

module.exports = db