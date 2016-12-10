var simple = require('simple-mock')
var test = require('tape')

var Hook = require('../../')

test('hook.before("test", check)', function (group) {
  group.test('order', function (t) {
    var hook = new Hook()
    var calls = []

    hook.before('test', function () { calls.push('before') })
    hook('test', function () { calls.push('check') })

    .then(function () {
      t.deepEqual(calls, ['before', 'check'])
      t.end()
    })

    .catch(t.error)
  })

  group.test('async check', function (t) {
    var hook = new Hook()
    var calls = []

    hook.before('test', function () {
      return new Promise(function (resolve) {
        calls.push('before')
        resolve()
      })
    })
    hook('test', function () { calls.push('check') })

    .then(function () {
      t.deepEqual(calls, ['before', 'check'])
      t.end()
    })

    .catch(t.error)
  })

  group.test('throws error', function (t) {
    var hook = new Hook()
    var method = simple.stub()

    hook.before('test', function () {
      throw new Error('oops')
    })

    hook('test', method)

    .then(function () {
      t.error('must not resolve')
    })

    .catch(function (error) {
      t.equal(error.message, 'oops', 'rejects with error message from check')
      t.equal(method.callCount, 0)
      t.end()
    })
  })

  group.test('rejected promise', function (t) {
    var hook = new Hook()
    var method = simple.stub()

    hook.before('test', function () {
      return Promise.reject(new Error('oops'))
    })

    hook('test', method)

    .then(function () {
      t.error('must not resolve')
    })

    .catch(function (error) {
      t.equal(error.message, 'oops', 'rejects with error message from check')
      t.equal(method.callCount, 0)
      t.end()
    })
  })

  group.test('options', function (t) {
    var hook = new Hook()

    hook.before('test', function (options) {
      options.foo = 'bar'
    })
    hook.before('test', function (options) {
      options.baz = 'ar'
    })

    hook('test', {foo: 'notbar', otherbar: 'baz'}, function (options) {
      t.equal(options.foo, 'bar')
      t.equal(options.baz, 'ar')
      t.equal(options.otherbar, 'baz')
      t.end()
    })

    .catch(t.error)
  })

  group.test('multiple before hooks get executed before method', function (t) {
    var hook = new Hook()
    var calls = []

    hook.before('test', function () { calls.push('before1') })
    hook.before('test', function () { calls.push('before2') })

    hook('test', function () { calls.push('check') })

    .then(function () {
      t.deepEqual(calls, ['before2', 'before1', 'check'])
      t.end()
    })

    .catch(t.error)
  })

  group.end()
})
