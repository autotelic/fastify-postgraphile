'use strict'

const fastifyPostGraphile = require('.')
const { DATABASE_URL } = process.env

module.exports = function (fastify, options, next) {
  fastify.register(fastifyPostGraphile, { database: DATABASE_URL })

  fastify.get('/', (req, reply) => {
    reply.type('application/json')
    reply.send({ foo: 'bar' })
  })

  fastify.post('/', (req, reply) => {
    reply.type('application/json')
    reply.send({ hello: 'world' })
  })

  next()
}
