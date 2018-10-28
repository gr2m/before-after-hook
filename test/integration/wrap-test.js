var simple = require('simple-mock')
var test = require('tape')

var Hook = require('../../')

test('hook.wrap("test", wrapMethod)', function (group) {
  group.test('before/after/error', function (t) {
    var hook = new Hook()
    var calls = []

    hook.wrap('test', function (method) {
      calls.push('before')
      try {
        method()
      } catch (error) {
        calls.push('error')
      }
      calls.push('after')
    })
    hook('test', function () {
      calls.push('method')
      throw new Error('ooops')
    })

      .then(function () {
        t.deepEqual(calls, ['before', 'method', 'error', 'after'])
        t.end()
      })

      .catch(t.error)
  })

  group.test('async check', function (t) {
    var hook = new Hook()
    var calls = []

    hook.wrap('test', function (method) {
      calls.push('before')
      return method()
        .catch(() => calls.push('error'))
        .then(() => calls.push('after'))
    })

    hook('test', function () {
      return new Promise(function (resolve) {
        calls.push('method')
        throw new Error('ooops')
      })
    })

      .then(function () {
        t.deepEqual(calls, ['before', 'method', 'error', 'after'])
        t.end()
      })

      .catch(t.error)
  })

  group.test('throws error', function (t) {
    var hook = new Hook()
    var method = simple.stub()

    hook.wrap('test', function () {
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

    hook.wrap('test', function () {
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

    hook.wrap('test', function (method, options) {
      options.foo = 'bar'
      return method(options)
    })
    hook.wrap('test', function (method, options) {
      options.baz = 'ar'
      return method(options)
    })

    hook('test', { foo: 'notbar', otherbar: 'baz' }, function (options) {
      t.equal(options.foo, 'bar')
      t.equal(options.baz, 'ar')
      t.equal(options.otherbar, 'baz')
      t.end()
    })

      .catch(t.error)
  })

  group.test('multiple wrap hooks', function (t) {
    var hook = new Hook()
    var calls = []

    hook.wrap('test', function (method) {
      calls.push('wrap1')
      method()
    })
    hook.wrap('test', function (method) {
      calls.push('wrap2')
      method()
    })

    hook('test', function () { calls.push('method') })

      .then(function () {
        t.deepEqual(calls, ['wrap2', 'wrap1', 'method'])
        t.end()
      })

      .catch(t.error)
  })

  group.end()
})
