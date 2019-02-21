var register = require('./lib/register')
var addHook = require('./lib/add')
var removeHook = require('./lib/remove')

var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  const removeHookRef = bindable(removeHook, null).apply(null, name ? [state, null, name] : [state, null])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    const args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
    hook.remove[kind] = hook.api.remove[kind] = bindable(removeHook, null).apply(null, args)
  })
}

function unnamedHook (state) {
  var unnamedHookIterator = 0
  var unnamedHookName = 'unnamedHook' + unnamedHookIterator++
  var unnamedHook = register.bind(null, state, unnamedHookName)
  bindApi(unnamedHook, state, unnamedHookName)
  return unnamedHook
}

module.Hook = function Hook () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  hook.unnamed = unnamedHook.bind(null, state)

  return hook
}
