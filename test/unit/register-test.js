var test = require('tape')

var register = require('../../lib/register')

test('register("name", method) with empty registry and thrown error by method', function (t) {
  register({
    registry: {}
  }, 'test', function () {
    throw new Error('foo')
  })

  .then(t.fail)

  .catch(function (error) {
    t.equal('foo', error.message)
    t.end()
  })
})

test('register("name", undefined)', function (t) {
  t.throws(register.bind(null, {}, 'test', undefined))
  t.end()
})

test('register("name", undefined, method)', function (t) {
  t.throws(register.bind(null, {}, 'test', undefined, function () {}))
  t.end()
})
