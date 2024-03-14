const logger = require("../utils/logger")

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    if (error.code === "SQLITE_CONSTRAINT" && error.message.includes("UNIQUE constraint failed: users.username")) {
        response.status(400).json({ error: "expected `username` to be unique" })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ error: 'token missing or invalid' })
    } else if (error.name === "TokenExpiredError") {
        return response.status(401).json({ error: "token expired" })
    } else {
        response.status(500).json({ error: error.message })
    }
    next(error)
}

module.exports = {
    requestLogger, unknownEndpoint, errorHandler
}