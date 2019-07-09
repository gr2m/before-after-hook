var simple = require('simple-mock')
var test = require('tape')

var Hook = require('../../')

test('hook.error("test", handleError)', function (group) {
  group.test('order', function (t) {
    var hook = new Hook()
    var calls = []

    hook.error('test', function () { calls.push('errorHook') })
    hook.after('test', function () { calls.push('afterHook') })
    hook('test', function () {
      calls.push('method')
      throw new Error('oops')
    })

      .then(function () {
        t.deepEqual(calls, ['method', 'errorHook', 'afterHook'])
        t.end()
      })

      .catch(t.error)
  })

  group.test('async order', function (t) {
    var hook = new Hook()
    var calls = []

    hook.error('test', function () {
      calls.push('errorHook')
    })
    hook('test', function () {
      return new Promise(function () {
        calls.push('method')
        throw new Error('oops')
      })
    })

      .then(function () {
        t.deepEqual(calls, ['method', 'errorHook'])
        t.end()
      })

      .catch(t.error)
  })

  group.test('can mutate error', function (t) {
    var hook = new Hook()
    var method = simple.stub().throwWith(new Error('oops'))

    hook.error('test', function (error) {
      error.message = 'error hook'
      throw error
    })

    hook('test', method)

      .then(function () {
        t.error('must not resolve')
      })

      .catch(function (error) {
        t.equal(error.message, 'error hook', 'rejects with error message from error hook')
        t.end()
      })
  })

  group.test('rejected promise', function (t) {
    var hook = new Hook()
    var method = simple.stub().throwWith(new Error('oops'))

    hook.error('test', function (error) {
      error.message = 'error hook'
      return Promise.reject(error)
    })

    hook('test', method)

      .then(function () {
        t.error('must not resolve')
      })

      .catch(function (error) {
        t.equal(error.message, 'error hook', 'rejects with error message from error hook')
        t.end()
      })
  })

  group.test('can catch error', function (t) {
    var hook = new Hook()
    var method = simple.stub().throwWith(new Error('oops'))

    hook.error('test', function () {
      return { ok: true }
    })

    hook('test', method)

      .then(function (result) {
        t.equal(result.ok, true)
        t.end()
      })

      .catch(t.error)
  })

  group.test('receives options', function (t) {
    var hook = new Hook()
    var method = simple.stub().throwWith(new Error('oops'))

    hook.error('test', function (error, options) {
      t.equal(options.optionFoo, 'bar')
      throw error
    })

    hook('test', method, { optionFoo: 'bar' })

      .catch(function (error) {
        t.equal(error.message, 'oops')
        t.end()
      })
  })

  group.test('multiple error hooks get executed after method', function (t) {
    var hook = new Hook()
    var method = simple.stub().throwWith(new Error('oops'))
    var errorHandler = simple.stub().throwWith(new Error('error handler oops'))

    hook.error('test', errorHandler)
    hook.error('test', errorHandler)

    hook('test', method)

      .catch(function (error) {
        t.equal(errorHandler.callCount, 2)
        t.ok(method.lastCall.k < errorHandler.calls[0].k)
        t.ok(method.lastCall.k < errorHandler.calls[1].k)
        t.equal(error.message, 'error handler oops')
        t.end()
      })
  })

  group.end()
})
