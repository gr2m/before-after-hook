var test = require('tape')

var Hook = require('../../')

test('hook.remove.after("test", check)', function (t) {
  var hook = new Hook()
  var calls = []

  var afterCheck = function () { calls.push('after') }
  hook.after('test', afterCheck)
  hook.remove.after('test', afterCheck)
  hook('test', function () { calls.push('check') })

  .then(function () {
    t.deepEqual(calls, ['check'])
    t.end()
  })

  .catch(t.error)
})
