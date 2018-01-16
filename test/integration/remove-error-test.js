var test = require('tape')

var Hook = require('../../')

test('hook.remove.error("test", check)', function (t) {
  var hook = new Hook()
  var calls = []

  var afterCheck = function () { calls.push('error') }
  hook.error('test', afterCheck)
  hook.remove.error('test', afterCheck)
  hook('test', function () { calls.push('check') })

  .then(function () {
    t.deepEqual(calls, ['check'])
    t.end()
  })

  .catch(t.error)
})
