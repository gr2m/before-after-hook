import { test, assert } from "./testrunner.js";

import Hook from "../index.js";

test('hook.before("test", check) order', async () => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.before("test", () => {
    calls.push("before");
  });

  await hook("test", () => {
    calls.push("check");
  });

  assert(calls.length === 2);
  assert(calls[0] === "before");
  assert(calls[1] === "check");
});

test('hook.before("test", check) async check', async () => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.before("test", async () => {
    calls.push("before");
  });

  await hook("test", () => {
    calls.push("check");
  });

  assert(calls.length === 2);
  assert(calls[0] === "before");
  assert(calls[1] === "check");
});

test('hook.before("test", check) throws error', async () => {
  const hook = new Hook.Collection();

  let methodCallCount = 0;
  const method = function method() {
    methodCallCount++;
  };

  hook.before("test", () => {
    throw new Error("oops");
  });

  try {
    await hook("test", method);
    assert(false, "must not resolve");
  } catch (error) {
    assert(error.message === "oops", "rejects with error message from check");
    assert(methodCallCount === 0);
  }
});

test('hook.before("test", check) rejected promise', async () => {
  const hook = new Hook.Collection();

  let methodCallCount = 0;
  const method = function method() {
    methodCallCount++;
  };

  hook.before("test", () => {
    return Promise.reject(new Error("oops"));
  });

  try {
    await hook("test", method);
    assert(false, "must not resolve");
  } catch (error) {
    assert(error.message === "oops", "rejects with error message from check");
    assert(methodCallCount === 0);
  }
});

test('hook.before("test", check) options', async () => {
  const hook = new Hook.Collection();

  hook.before("test", (options) => {
    options.foo = "bar";
  });
  hook.before("test", (options) => {
    options.baz = "ar";
  });

  await hook(
    "test",
    (options) => {
      assert(options.foo === "bar", "passes options to before hook");
      assert(options.baz === "ar", "passes options to before hook");
      assert(options.otherbar === "baz", "passes options to before hook");
    },
    { foo: "notbar", otherbar: "baz" }
  );
});

test('before("test", check) multiple before hooks get executed before method', async () => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.before("test", () => {
    calls.push("before1");
  });
  hook.before("test", () => {
    calls.push("before2");
  });

  await hook("test", () => {
    calls.push("check");
  });

  assert(calls.length === 3);
  assert(calls[0] === "before2");
  assert(calls[1] === "before1");
  assert(calls[2] === "check");
});
