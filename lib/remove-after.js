module.exports = removeAfter

function removeAfter (state, name, method) {
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name].after.indexOf(method)

  if (index === -1) {
    return
  }

  state.registry[name].after.splice(index, 1)
}
