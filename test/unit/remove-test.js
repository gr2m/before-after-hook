var test = require("tape");

var remove = require("../../lib/remove");

test('remove("before", "name", method) with empty registry', function (t) {
  var state = {
    registry: {},
  };
  remove(state, "before", "test", function () {});

  t.end();
});

test('remove("before", "name", method) with method that cannot be found', function (t) {
  var state = {
    registry: {
      test: [],
    },
  };
  remove(state, "before", "test", function () {});

  t.end();
});
