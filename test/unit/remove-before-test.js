var test = require('tape')

var removeBefore = require('../../lib/remove-before')

test('removeBefore("name", method) with empty registry', function (t) {
  var state = {
    registry: {}
  }
  removeBefore(state, 'test', function () {})

  t.end()
})

test('removeBefore("name", method) with method that cannot be found', function (t) {
  var state = {
    registry: {
      test: {
        before: [],
        after: []
      }
    }
  }
  removeBefore(state, 'test', function () {})

  t.end()
})
