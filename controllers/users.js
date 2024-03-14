const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const usersModel = require('../models/users')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = {
        username: username, name: name, passwordHash: passwordHash
    }

    const savedUser = await usersModel.createUser(user)
    response.status(201).json(savedUser)
})

module.exports = usersRouter