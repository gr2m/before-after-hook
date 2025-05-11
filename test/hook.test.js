import { test, assert } from "./testrunner.js";

import Hook from "../index.js";

test("hook(name, options, method) multiple names", async () => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.before("outer", () => {
    calls.push("beforeOuter");
  });
  hook.before("inner", () => {
    calls.push("beforeInner");
  });
  hook.after("inner", () => {
    calls.push("afterInner");
  });
  hook.after("outer", () => {
    calls.push("afterOuter");
  });

  await hook(["outer", "dafuq", "inner"], () => {
    calls.push("method");
  });

  assert(calls.length === 5);
  assert(calls[0] === "beforeOuter");
  assert(calls[1] === "beforeInner");
  assert(calls[2] === "method");
  assert(calls[3] === "afterInner");
  assert(calls[4] === "afterOuter");
});

test("hook(name, options, method) order", async () => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.before("test", () => {
    calls.push("before test 1");
  });
  hook.after("test", () => {
    calls.push("after test 1");
  });
  hook.before("test", () => {
    calls.push("before test 2");
  });
  hook.after("test", () => {
    calls.push("after test 2");
  });

  await hook("test", () => {
    calls.push("method");
  });

  assert(calls.length === 5);
  assert(calls[0] === "before test 2");
  assert(calls[1] === "before test 1");
  assert(calls[2] === "method");
  assert(calls[3] === "after test 1");
  assert(calls[4] === "after test 2");
});

test("hook(name, options, method) no handlers defined (#51)", async () => {
  const hook = new Hook.Collection();
  const options = { foo: "bar" };

  await hook(
    "test",
    (_options) => {
      assert(typeof _options === "object");
      assert(Object.keys(_options).length === 1);
      assert(_options.foo === "bar");
    },
    options
  );
});
