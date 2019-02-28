var register = require('./lib/register')
var addHook = require('./lib/add')
var removeHook = require('./lib/remove')

// https://stackoverflow.com/a/21792913
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

var singularHookState = {
  registry: {}
}
var singularHookIterator = 0
var singularHookDeprecationMessageDisplayed = false
function HookSingular () {
  if (!singularHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook.Singular()" deprecation warning. Will be renamed to "Hook()" in the next major release.')
    singularHookDeprecationMessageDisplayed = true
  }
  var unnamedHookName = 'unnamedHook' + singularHookIterator++
  var unnamedHook = register.bind(null, singularHookState, unnamedHookName)
  bindApi(unnamedHook, singularHookState, unnamedHookName)
  return unnamedHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" deprecation/repurpose warning. In the next major release "Hook()" will become a singleton. To continue using hook collections, use "Hook.Collection()".')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind(null)
Hook.Collection = HookCollection.bind(null)

module.exports = Hook
// expose constructor as a named property for Typescript
module.exports.Hook = Hook
