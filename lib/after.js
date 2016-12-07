module.exports = after

function after (state, name, afterHook) {
  if (state.registry[name]) {
    state.registry[name].after.push(afterHook)
    return
  }

  state.registry[name] = {
    before: [],
    after: [afterHook]
  }
}
