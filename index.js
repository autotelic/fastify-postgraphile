'use strict'

const fastifyPlugin = require('fastify-plugin')
const {
  postgraphile,
  PostGraphileResponseFastify3
} = require('postgraphile')
const simplifyInflector = require('@graphile-contrib/pg-simplify-inflector')
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
  appendPlugins: [simplifyInflector],
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
    settings = {},
    overrides = {}
  } = opts

  // Deeply merge together user settings and default settings.
  // New settings will be added
  // Array settings will be concatenated together
  // Existing default settings will be retained
  const deepMergedSettings = mergeWith({}, settings, defaultSettings, concatNestedArrays)

  // Apply overrides settings to replace/change any default settings
  const mergedSettingsWithOverrides = {
    ...deepMergedSettings,
    ...overrides
  }

  const middleware = postgraphile(database, schemas, mergedSettingsWithOverrides)

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

module.exports = fastifyPlugin(postGraphilePlugin, {
  name: DECORATOR
})

function concatNestedArrays (objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}
