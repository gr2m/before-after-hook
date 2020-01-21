var test = require("tape");

var Hook = require("../../");

test('hook.remove("test", check)', function(t) {
  var hook = new Hook();
  var calls = [];

  var afterCheck = function() {
    calls.push("after");
  };
  hook.after("test", afterCheck);
  hook.remove("test", afterCheck);
  hook("test", function() {
    calls.push("check");
  })
    .then(function() {
      t.deepEqual(calls, ["check"]);
      t.end();
    })

    .catch(t.error);
});

test('hook.remove("test", check) without "check" matching existing function', function(t) {
  var hook = new Hook();
  var calls = [];

  hook.before("test", () => calls.push("before"));
  hook.remove("test", () => {
    throw new Error("should not be called");
  });
  hook("test", function() {
    calls.push("check");
  })
    .then(function() {
      t.deepEqual(calls, ["before", "check"]);
      t.end();
    })

    .catch(t.error);
});
