var test = require('tape')

var removeAfter = require('../../lib/remove-after')

test('removeAfter("name", method) with empty registry', function (t) {
  var state = {
    registry: {}
  }
  removeAfter(state, 'test', function () {})

  t.end()
})

test('removeAfter("name", method) with method that cannot be found', function (t) {
  var state = {
    registry: {
      test: {
        before: [],
        after: []
      }
    }
  }
  removeAfter(state, 'test', function () {})

  t.end()
})
