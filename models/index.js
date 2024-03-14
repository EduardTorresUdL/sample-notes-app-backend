const db = require("../utils/db")
const notesModel = require("./notes")
const usersModel = require("./users")

// Database initialization
const initDb = () => {
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, name TEXT, passwordHash TEXT)")
        db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, content TEXT, important BOOLEAN, userId INTEGER, FOREIGN KEY(userId) REFERENCES users(id))")
    })
}

module.exports = {
    initDb, notesModel, usersModel
}