var test = require('tape')

var Hook = require('../../')

test('hook(name, options, method)', function (group) {
  group.test('multiple names', function (t) {
    var hook = new Hook()
    var calls = []

    hook.before('outer', function () { calls.push('beforeOuter') })
    hook.before('inner', function () { calls.push('beforeInner') })
    hook.after('inner', function () { calls.push('afterInner') })
    hook.after('outer', function () { calls.push('afterOuter') })
    hook(['outer', 'dafuq', 'inner'], function () { calls.push('method') })

    .then(function () {
      t.deepEqual(calls, [
        'beforeOuter',
        'beforeInner',
        'method',
        'afterInner',
        'afterOuter'
      ])
      t.end()
    })

    .catch(t.error)
  })

  group.test('order', function (t) {
    var hook = new Hook()
    var calls = []

    hook.before('test', function () { calls.push('before test 1') })
    hook.after('test', function () { calls.push('after test 1') })
    hook.before('test', function () { calls.push('before test 2') })
    hook.after('test', function () { calls.push('after test 2') })
    hook('test', function () { calls.push('method') })

    .then(function () {
      t.deepEqual(calls, [
        'before test 2',
        'before test 1',
        'method',
        'after test 1',
        'after test 2'
      ])
      t.end()
    })

    .catch(t.error)
  })

  group.end()
})
