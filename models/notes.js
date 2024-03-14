const db = require("../utils/db")

const getAllNotes = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM notes", [], (err, rows) => {
            err ? reject(err) : resolve(rows)
        })
    })
}

const getNoteById = id => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM notes WHERE id = ?", [id], (err, row) => {
            err ? reject(err) : resolve(row)
        })
    })
}

const deleteNoteById = id => {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM notes WHERE id = ${id}`, err => {
            err ? reject(err) : resolve({})
        })
    })
}

const insertNote = note => {
    return new Promise((resolve, reject) => {
        const { content, important, userId } = note
        const sql = "INSERT INTO notes (content, important, userId) VALUES (?, ?, ?)"
        db.run(sql, [content, important, userId], function (err) {
            err
                ? reject(err)
                : resolve({
                    id: this.lastID,
                    content: content,
                    important: important
                })
        })
    })
}

module.exports = {
    getAllNotes, getNoteById,
    deleteNoteById, insertNote
}