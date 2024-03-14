const jwt = require("jsonwebtoken")
const notesRouter = require("express").Router()
const { notesModel } = require("../models")

notesRouter.get('/', (request, response) => {
    notesModel.getAllNotes().then(
        notes => response.json(notes)
    ).catch(
        err => response.status(500).json({ error: err.message })
    )
})

notesRouter.get('/:id', (request, response) => {
    const id = Number(request.params.id)
    notesModel.getNoteById(id).then(
        note => note ? response.json(note) : response.status(404).end()
    ).catch(
        err => response.status(500).json({ error: err.message })
    )
})

notesRouter.delete('/:id', (request, response) => {
    const id = Number(request.params.id)
    notesModel.deleteNoteById(id).then(
        () => response.status(204).end()
    ).catch(
        err => response.status(500).json({ error: err.message })
    )
})

const getTokenFrom = request => {
    const authorization = request.get("authorization")
    if (authorization && authorization.startsWith("Bearer ")) {
        return authorization.replace("Bearer ", "")
    }
    return null
}

notesRouter.post('/', (request, response) => {
    const note = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: "token invalid" })
    }

    if (!note.content) {
        return response.status(400).json({ error: 'content missing' })
    }
    const newNote = {
        content: note.content,
        important: Boolean(note.important) || false,
        userId: decodedToken.id
    }
    notesModel.insertNote(newNote)
        .then(note => response.json(note))
        .catch(err => response.status(500).json({ error: err.message }))
})

module.exports = notesRouter
