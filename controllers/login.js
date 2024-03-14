const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const userModel = require('../models/users')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await userModel.getUserByUsername(username)
    const passwordCorrect = user
        ? await bcrypt.compare(password, user.passwordHash)
        : false

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter