import test from "ava";

import Hook from "../index.js";

test("hook(name, options, method) multiple names", async (t) => {
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

  t.deepEqual(calls, [
    "beforeOuter",
    "beforeInner",
    "method",
    "afterInner",
    "afterOuter",
  ]);
});

test("hook(name, options, method) order", async (t) => {
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

  t.deepEqual(calls, [
    "before test 2",
    "before test 1",
    "method",
    "after test 1",
    "after test 2",
  ]);
});

test("hook(name, options, method) no handlers defined (#51)", async (t) => {
  const hook = new Hook.Collection();
  const options = { foo: "bar" };

  await hook(
    "test",
    (_options) => {
      t.deepEqual(options, _options);
    },
    options
  );
});
