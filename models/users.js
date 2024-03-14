const db = require("../utils/db")

const createUser = user => {
    return new Promise((resolve, reject) => {
        const { username, name, passwordHash } = user
        const sql = "INSERT INTO users (username, name, passwordHash) VALUES (?, ?, ?)"
        db.run(sql, [username, name, passwordHash], function (err) {
            if (err) {
                reject(err)
            } else {
                resolve({
                    id: this.lastID,
                    username: username,
                    name: name
                })
            }
        })
    })
}

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM users", (err, rows) => {
            err ? reject(err) : resolve(rows)
        })
    })
}

const getUserByUsername = username => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users where users.username = ?", [username], (err, row) => {
            err ? reject(err) : resolve(row)
        })
    })
}

module.exports = { createUser, getAllUsers, getUserByUsername }