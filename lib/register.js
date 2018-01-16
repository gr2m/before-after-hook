module.exports = register

function register (state, name, options, method) {
  if (arguments.length === 3) {
    method = options
    options = {}
  }

  if (typeof method !== 'function') {
    throw new Error('method for before hook must be a function')
  }

  if (typeof options !== 'object') {
    throw new Error('options for before hook must be an object')
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, options, callback)
    }, method)()
  }

  var hooks = state.registry[name]
  if (!hooks) {
    return invokeMethod(options, method)
  }

  var beforeHooks = hooks.before
  var errorHooks = hooks.error
  var afterHooks = hooks.after

  return Promise.all(beforeHooks.map(invokeBeforeHook.bind(null, options)))

  .then(function () {
    return method(options)
  })

  .catch(function (error) {
    return Promise.all(errorHooks.map(invokeErrorHook.bind(null, error, options)))

    .then(function (results) {
      var nonErrorResults = results.filter(isntError)

      if (nonErrorResults.length) {
        return nonErrorResults[0]
      }

      throw error
    })
  })

  .then(function (result) {
    return Promise.all(afterHooks.map(invokeAfterHook.bind(null, result, options)))

    .then(function () {
      return result
    })
  })
}

function invokeMethod (options, method) {
  try {
    return Promise.resolve(method(options))
  } catch (error) {
    return Promise.reject(error)
  }
}

function invokeBeforeHook (options, method) {
  try {
    return method(options)
  } catch (error) {
    return Promise.reject(error)
  }
}

function invokeErrorHook (result, options, errorHook) {
  try {
    return Promise.resolve(errorHook(result, options))

    .catch(function (error) { return error })
  } catch (error) {
    return Promise.resolve(error)
  }
}

function invokeAfterHook (result, options, method) {
  try {
    return method(result, options)
  } catch (error) {
    return Promise.reject(error)
  }
}

function isntError (result) {
  return !(result instanceof Error)
}
