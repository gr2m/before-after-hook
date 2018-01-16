module.exports = beforeHook

function beforeHook (state, name, beforeHook) {
  if (state.registry[name]) {
    state.registry[name].before.unshift(beforeHook)
    return
  }

  state.registry[name] = {
    before: [beforeHook],
    error: [],
    after: []
  }
}
