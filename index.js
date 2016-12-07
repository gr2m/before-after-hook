module.exports = Hook

var register = require('./lib/register')
var before = require('./lib/before')
var after = require('./lib/after')
var removeBefore = require('./lib/remove-before')
var removeAfter = require('./lib/remove-after')

function Hook () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  hook.api = {}

  hook.api.before = hook.before = before.bind(null, state)
  hook.api.after = hook.after = after.bind(null, state)

  hook.api.remove = hook.remove = {
    before: removeBefore.bind(null, state),
    after: removeAfter.bind(null, state)
  }

  return hook
}
