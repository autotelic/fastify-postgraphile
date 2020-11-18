'use strict'

const postGraphile = require('.')
const { DATABASE_URL } = process.env

module.exports = function (fastify, options, next) {
  try {
    fastify.register(postGraphile, { database: DATABASE_URL })

    fastify.get('/', (req, reply) => {
      reply.type('application/json')
      reply.send({ foo: 'bar' })
    })

    fastify.post('/', (req, reply) => {
      reply.type('application/json')
      reply.send({ hello: 'world' })
    })

    next()
  } catch (error) {
    next(error)
  }
}
