const express = require('express')
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database(":memory:")
const app = express()

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, content TEXT, important BOOLEAN)")
    db.run('INSERT INTO notes (content, important) VALUES ("My first note", FALSE)')
    db.run('INSERT INTO notes (content, important) VALUES ("My second note", TRUE)')
})

app.use(express.json())

app.get('/api/notes', (request, response) => {
    db.all("SELECT * FROM notes", (err, rows) => {
        if (err) {
            response.status(500).json({ error: err.message })
        } else {
            response.json(rows)
        }
    })
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    db.get("SELECT * FROM notes WHERE id = ?", [id], (err, row) => {
        if (err) {
            response.status(500).json({ error: err.message })
            return
        }
        row
            ? response.json(row)
            : response.status(404).end()
    })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    db.run("DELETE FROM notes WHERE id = ?", [id], err => {
        if (err) {
            response.status(500).json({ error: err.message })
        }
    })
    response.status(204).end()
})

app.post('/api/notes', (request, response) => {
    const note = request.body
    if (!note.content) {
        return response.status(400).json({ error: 'content missing' })
    }
    const sql = "INSERT INTO notes (content, important) VALUES (?, ?)"
    params = [note.content, Boolean(note.important) || false]
    db.run(sql, params, function (err) {
        if (err) {
            return response.status(500).json({ error: err.message })
        }
        const insertedNote = {
            id: this.lastID,
            content: note.content,
            important: Boolean(note.important) || false
        }
        response.json(insertedNote)
    })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})