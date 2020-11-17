'use strict'

function plugin (pluginOptions) {
  const defaultOptions = {
  }

  const options = {
    ...defaultOptions,
    ...pluginOptions
  }

  function pluginHook (req, reply, next) {
    return next()
  }

  return pluginHook
}

module.exports = plugin
