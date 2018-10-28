module.exports = removeHook

function removeHook (state, kind, name, method) {
  if (kind) {
    console.warn(`hook.remove.${kind}(name, method) is deprecated, use hook.remove(name, method)`)
  }
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name].map(({ orig }) => orig).indexOf(method)

  if (index === -1) {
    return
  }

  state.registry[name].splice(index, 1)
}
