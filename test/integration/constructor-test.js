var test = require('tape')

var Hook = require('../../')

test('Constructor', function (t) {
  var hook = new Hook()

  t.is(typeof hook, 'function', 'hook() is a function')
  t.is(typeof hook.before, 'function', 'hook.before() is function')
  t.is(typeof hook.after, 'function', 'hook.after() is function')
  t.is(typeof hook.remove.before, 'function', 'hook.remove.before() is function')
  t.is(typeof hook.remove.after, 'function', 'hook.remove.after() is function')

  t.is(typeof hook.api, 'object', 'hook.api is an object')

  t.end()
})

test('hook.api', function (t) {
  var hook = new Hook()

  t.is(typeof hook.api.before, 'function', 'hook.before() is function')
  t.is(typeof hook.api.after, 'function', 'hook.after() is function')
  t.is(typeof hook.api.remove.before, 'function', 'hook.remove.before() is function')
  t.is(typeof hook.api.remove.after, 'function', 'hook.remove.after() is function')
  t.is(typeof hook.api, 'object', 'does ont expose hook() method')

  t.end()
})
