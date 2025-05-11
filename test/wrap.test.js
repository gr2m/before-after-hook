import { test, assert } from "./testrunner.js";

import Hook from "../index.js";

test('hook.wrap("test", wrapMethod) before/after/error', async () => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.wrap("test", (method) => {
    calls.push("before");
    try {
      method();
    } catch (error) {
      calls.push("error");
    }
    calls.push("after");
  });

  await hook("test", () => {
    calls.push("method");
    throw new Error("ooops");
  });

  assert(calls.length === 4);
  assert(calls[0] === "before");
  assert(calls[1] === "method");
  assert(calls[2] === "error");
  assert(calls[3] === "after");
});

test('hook.wrap("test", wrapMethod) async check', async () => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.wrap("test", (method) => {
    calls.push("before");
    return method()
      .catch(() => calls.push("error"))
      .then(() => calls.push("after"));
  });

  await hook("test", async () => {
    calls.push("method");
    throw new Error("ooops");
  });

  assert(calls.length === 4);
  assert(calls[0] === "before");
  assert(calls[1] === "method");
  assert(calls[2] === "error");
  assert(calls[3] === "after");
});

test('hook.wrap("test", wrapMethod) throws error', async () => {
  const hook = new Hook.Collection();

  let methodCallCount = 0;
  const method = function method() {
    methodCallCount++;
  };

  hook.wrap("test", () => {
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

test('hook.wrap("test", wrapMethod) rejected promise', async () => {
  const hook = new Hook.Collection();

  let methodCallCount = 0;
  const method = function method() {
    methodCallCount++;
  };

  hook.wrap("test", () => {
    return Promise.reject(new Error("oops"));
  });

  try {
    await hook("test", method);
    hook("test", method);
    assert(false, "must not resolve");
  } catch (error) {
    assert(error.message, "oops", "rejects with error message from check");
    assert(methodCallCount === 0);
  }
});

test('hook.wrap("test", wrapMethod) options', async () => {
  const hook = new Hook.Collection();

  hook.wrap("test", (method, options) => {
    options.foo = "bar";
    return method(options);
  });
  hook.wrap("test", (method, options) => {
    options.baz = "ar";
    return method(options);
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

test('hook.wrap("test", wrapMethod) multiple wrap hooks', async () => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.wrap("test", (method) => {
    calls.push("wrap1");
    method();
  });
  hook.wrap("test", (method) => {
    calls.push("wrap2");
    method();
  });

  await await hook("test", () => {
    calls.push("method");
  });

  assert(calls.length === 3);
  assert(calls[0] === "wrap2");
  assert(calls[1] === "wrap1");
  assert(calls[2] === "method");
});
