const bcrypt = require("bcrypt")
const { test, describe, beforeEach } = require('node:test')
const supertest = require('supertest')
const app = require("../app")
const assert = require('node:assert')
const { usersModel } = require("../models")
const db = require('../utils/db')

const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        // Clear the users table
        db.serialize(() => {
            db.run('DELETE FROM users')
        })
        // Create the root user
        const rootUser = {
            username: "root",
            name: "Root User",
            passwordHash: await bcrypt.hash("secret", 10)
        }
        await usersModel.createUser(rootUser)
    })

    test('creation succeeds with a fresh username', async () => {
        const newUser = {
            username: "newUser",
            name: "New User",
            password: "mypsswd"
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const allUsers = await usersModel.getAllUsers()
        const usernames = allUsers.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await usersModel.getAllUsers()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersModel.getAllUsers()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})