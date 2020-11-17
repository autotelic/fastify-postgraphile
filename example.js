'use strict'

const postgraphile = require('.')

module.exports = function (fastify, options, next) {
  fastify.register(postgraphile, {})

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
