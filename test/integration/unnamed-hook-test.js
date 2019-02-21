var test = require('tape')

var Hook = require('../../')

test('hook.unnamed(options, method)', function (group) {
  group.test('multiple names', function (t) {
    var hook = new Hook()
    var calls = []

    var unnamedHook = hook.unnamed()
    unnamedHook.before(function () { calls.push('beforeSecond') })
    unnamedHook.before(function () { calls.push('beforeFirst') })
    unnamedHook.after(function () { calls.push('afterFirst') })
    unnamedHook.after(function () { calls.push('afterSecond') })

    unnamedHook(function () { calls.push('method') })

      .then(function () {
        t.deepEqual(calls, [
          'beforeFirst',
          'beforeSecond',
          'method',
          'afterFirst',
          'afterSecond'
        ])
        t.end()
      })

      .catch(t.error)
  })

  group.test('order', function (t) {
    var hook = new Hook()
    var calls = []

    var unnamedHook = hook.unnamed()
    unnamedHook.before(function () { calls.push('before 1') })
    unnamedHook.after(function () { calls.push('after 1') })
    unnamedHook.before(function () { calls.push('before 2') })
    unnamedHook.after(function () { calls.push('after 2') })

    unnamedHook(function () { calls.push('method') })

      .then(function () {
        t.deepEqual(calls, [
          'before 2',
          'before 1',
          'method',
          'after 1',
          'after 2'
        ])
        t.end()
      })

      .catch(t.error)
  })

  group.test('no handlers defined (#51)', function (t) {
    var hook = new Hook()
    var options = { foo: 'bar' }

    var unnamedHook = hook.unnamed()
    unnamedHook(options, function (_options) {
      t.deepLooseEqual(options, _options)
      t.end()
    })
  })

  group.end()
})
