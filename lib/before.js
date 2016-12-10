module.exports = before

function before (state, name, beforeHook) {
  if (state.registry[name]) {
    state.registry[name].before.unshift(beforeHook)
    return
  }

  state.registry[name] = {
    before: [beforeHook],
    after: []
  }
}
