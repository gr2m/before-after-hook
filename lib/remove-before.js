module.exports = removeBefore

function removeBefore (state, name, method) {
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name].before.indexOf(method)

  if (index === -1) {
    return
  }

  state.registry[name].before.splice(index, 1)
}
