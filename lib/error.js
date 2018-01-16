module.exports = errorHook

function errorHook (state, name, errorHook) {
  if (state.registry[name]) {
    state.registry[name].error.unshift(errorHook)
    return
  }

  state.registry[name] = {
    before: [],
    error: [errorHook],
    after: []
  }
}
