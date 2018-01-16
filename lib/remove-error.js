module.exports = removeErrorHook

function removeErrorHook (state, name, method) {
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name].error.indexOf(method)

  if (index === -1) {
    return
  }

  state.registry[name].error.splice(index, 1)
}
