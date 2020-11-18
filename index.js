'use strict'

const fastifyPlugin = require('fastify-plugin')
const { plugin } = require('./lib')

const DECORATOR = 'fastify-postgraphile'

module.exports = fastifyPlugin(plugin, {
  name: DECORATOR
})
