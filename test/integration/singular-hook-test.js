var test = require('tape')

var Hook = require('../../')

test('hook.Singular(options, method)', function (group) {
  group.test('multiple names', function (t) {
    var hook = new Hook.Singular()
    var calls = []

    hook.before(function () { calls.push('beforeSecond') })
    hook.before(function () { calls.push('beforeFirst') })
    hook.after(function () { calls.push('afterFirst') })
    hook.after(function () { calls.push('afterSecond') })

    hook(function () { calls.push('method') })

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
    var hook = new Hook.Singular()
    var calls = []

    hook.before(function () { calls.push('before 1') })
    hook.after(function () { calls.push('after 1') })
    hook.before(function () { calls.push('before 2') })
    hook.after(function () { calls.push('after 2') })

    hook(function () { calls.push('method') })

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

  group.test('multiple unnamed hooks', function (t) {
    var calls = []

    var hook1 = new Hook.Singular()
    hook1.before(function () { calls.push('before 1') })
    hook1.after(function () { calls.push('after 1') })
    var hook2 = new Hook.Singular()
    hook2.before(function () { calls.push('before 2') })
    hook2.after(function () { calls.push('after 2') })

    hook1(function () { calls.push('method 1') })
      .then(function () {
        hook2(function () { calls.push('method 2') })
          .then(function () {
            t.deepEqual(calls, [
              'before 1',
              'method 1',
              'after 1',
              'before 2',
              'method 2',
              'after 2'
            ])
            t.end()
          })
          .catch(t.error)
      })
  })

  group.test('no handlers defined (#51)', function (t) {
    var hook = new Hook.Singular()
    var options = { foo: 'bar' }

    hook(function (_options) {
      t.deepLooseEqual(options, _options)
      t.end()
    }, options)
  })

  group.end()
})
