var simple = require('simple-mock')
var test = require('tape')

var Hook = require('../../')

test('hook.after("test", afterCheck)', function (group) {
  group.test('order', function (t) {
    var hook = new Hook()
    var calls = []

    hook.after('test', function () { calls.push('after') })
    hook('test', function () { calls.push('afterCheck') })

    .then(function () {
      t.deepEqual(calls, ['afterCheck', 'after'])
      t.end()
    })

    .catch(t.error)
  })

  group.test('async afterCheck', function (t) {
    var hook = new Hook()
    var calls = []

    hook.after('test', function () {
      return new Promise(function (resolve) {
        calls.push('after')
        resolve()
      })
    })
    hook('test', function () { calls.push('afterCheck') })

    .then(function () {
      t.deepEqual(calls, ['afterCheck', 'after'])
      t.end()
    })

    .catch(t.error)
  })

  group.test('throws error', function (t) {
    var hook = new Hook()
    var method = simple.stub()

    hook.after('test', function () {
      throw new Error('oops')
    })

    hook('test', method)

    .then(function () {
      t.error('must not resolve')
    })

    .catch(function (error) {
      t.equal(error.message, 'oops', 'rejects with error message from afterCheck')
      t.end()
    })
  })

  group.test('rejected promise', function (t) {
    var hook = new Hook()
    var method = simple.stub()

    hook.after('test', function () {
      return Promise.reject(new Error('oops'))
    })

    hook('test', method)

    .then(function () {
      t.error('must not resolve')
    })

    .catch(function (error) {
      t.equal(error.message, 'oops', 'rejects with error message from afterCheck')
      t.end()
    })
  })

  group.test('result and options', function (t) {
    var hook = new Hook()

    hook.after('test', function (result, options) {
      t.equal(options.optionFoo, 'bar', 'passes options to after hook')
      result.foo = 'newbar'
    })
    hook.after('test', function (result, options) {
      result.baz = 'ar'
    })

    hook('test', {optionFoo: 'bar'}, function () {
      return {
        foo: 'bar',
        otherFoo: 'bar'
      }
    })

    .then(function (result) {
      t.equal(result.foo, 'newbar')
      t.equal(result.otherFoo, 'bar')
      t.end()
    })

    .catch(t.error)
  })

  group.test('multiple after hooks get executed after method', function (t) {
    var hook = new Hook()
    var calls = []

    hook.after('test', function () { calls.push('after1') })
    hook.after('test', function () { calls.push('after2') })

    hook('test', function () { calls.push('afterCheck') })

    .then(function () {
      t.deepEqual(calls, ['afterCheck', 'after1', 'after2'])
      t.end()
    })

    .catch(t.error)
  })

  group.end()
})
