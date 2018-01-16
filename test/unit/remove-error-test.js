var test = require('tape')

var errorAfter = require('../../lib/remove-error')

test('errorAfter("name", method) with empty registry', function (t) {
  var state = {
    registry: {}
  }
  errorAfter(state, 'test', function () {})

  t.end()
})

test('errorAfter("name", method) with method that cannot be found', function (t) {
  var state = {
    registry: {
      test: {
        before: [],
        error: [],
        after: []
      }
    }
  }
  errorAfter(state, 'test', function () {})

  t.end()
})
