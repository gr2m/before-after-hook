var test = require('tape')

var Hook = require('../../')

test('hook.remove.before("test", check)', function (t) {
  var hook = new Hook()
  var calls = []

  var beforeCheck = function () { calls.push('before') }
  hook.before('test', beforeCheck)
  hook.remove.before('test', beforeCheck)
  hook('test', function () { calls.push('check') })

  .then(function () {
    t.deepEqual(calls, ['check'])
    t.end()
  })

  .catch(t.error)
})
