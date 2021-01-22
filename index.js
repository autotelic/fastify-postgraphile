'use strict'

const fastifyPlugin = require('fastify-plugin')
const {
  postgraphile,
  PostGraphileResponseFastify3
} = require('postgraphile')
const DEFAULT_INFLECTOR = require('@graphile-contrib/pg-simplify-inflector')
const mergeWith = require('lodash.mergewith')

const DECORATOR = 'fastify-postgraphile'

const defaultSettings = {
  subscriptions: true,
  watchPg: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  ignoreIndexes: false,
  showErrorStack: 'json',
  extendedErrors: ['hint', 'detail', 'errcode'],
  appendPlugins: [DEFAULT_INFLECTOR],
  exportGqlSchemaPath: 'schema.graphql',
  graphiql: true,
  enhanceGraphiql: true,
  allowExplain (req) {
    return true
  },
  enableQueryBatching: true,
  legacyRelations: 'omit'
}

async function postGraphilePlugin (fastify, opts) {
  const {
    database,
    schemas = 'public',
    settings = {}
  } = opts

  // Deeply merge together user settings and default settings.
  // Array settings will be concatenated together
  const deepMergedSettings = mergeWith({}, defaultSettings, settings, concatNestedArrays)

  const middleware = postgraphile(database, schemas, deepMergedSettings)

  const convertHandler = (handler) => (
    request,
    reply
  ) => handler(new PostGraphileResponseFastify3(request, reply))

  fastify.options(middleware.graphqlRoute, convertHandler(middleware.graphqlRouteHandler))
  fastify.post(middleware.graphqlRoute, convertHandler(middleware.graphqlRouteHandler))

  if (middleware.options.graphiql) {
    if (middleware.graphiqlRouteHandler) {
      fastify.head(middleware.graphiqlRoute, convertHandler(middleware.graphiqlRouteHandler))
      fastify.get(middleware.graphiqlRoute, convertHandler(middleware.graphiqlRouteHandler))
    }
  }

  if (middleware.options.watchPg) {
    if (middleware.eventStreamRouteHandler) {
      fastify.options(
        middleware.eventStreamRoute,
        convertHandler(middleware.eventStreamRouteHandler)
      )
      fastify.get(middleware.eventStreamRoute, convertHandler(middleware.eventStreamRouteHandler))
    }
  }
}

function concatNestedArrays (objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}

module.exports.DEFAULT_INFLECTOR = DEFAULT_INFLECTOR
module.exports = fastifyPlugin(postGraphilePlugin, {
  name: DECORATOR
})
