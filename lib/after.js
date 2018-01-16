module.exports = afterHook

function afterHook (state, name, afterHook) {
  if (state.registry[name]) {
    state.registry[name].after.push(afterHook)
    return
  }

  state.registry[name] = {
    before: [],
    error: [],
    after: [afterHook]
  }
}
