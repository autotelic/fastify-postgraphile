'use strict'

function plugin (pluginOptions) {
  const defaultOptions = {
  }

  const options = {
    ...defaultOptions,
    ...pluginOptions
  }

  function pluginHook (req, reply, next) {
    const { log } = req

    log.info(options)

    return next()
  }

  return pluginHook
}

module.exports = plugin
