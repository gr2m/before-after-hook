module.exports = Hook

var register = require('./lib/register')
var before = require('./lib/before')
var error = require('./lib/error')
var after = require('./lib/after')
var removeBefore = require('./lib/remove-before')
var removeError = require('./lib/remove-error')
var removeAfter = require('./lib/remove-after')

function Hook () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  hook.api = {}

  hook.api.before = hook.before = before.bind(null, state)
  hook.api.error = hook.error = error.bind(null, state)
  hook.api.after = hook.after = after.bind(null, state)

  hook.api.remove = hook.remove = {
    before: removeBefore.bind(null, state),
    error: removeError.bind(null, state),
    after: removeAfter.bind(null, state)
  }

  return hook
}
