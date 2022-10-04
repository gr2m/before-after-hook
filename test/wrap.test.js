import sinon from "sinon";
import test from "ava";

import Hook from "../index.js";

test('hook.wrap("test", wrapMethod) before/after/error', async (t) => {
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

  t.deepEqual(calls, ["before", "method", "error", "after"]);
});

test('hook.wrap("test", wrapMethod) async check', async (t) => {
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

  t.deepEqual(calls, ["before", "method", "error", "after"]);
});

test('hook.wrap("test", wrapMethod) throws error', async (t) => {
  const hook = new Hook.Collection();
  const method = sinon.stub();

  hook.wrap("test", () => {
    throw new Error("oops");
  });

  try {
    await hook("test", method);
    t.fail("must not resolve");
  } catch (error) {
    t.is(error.message, "oops", "rejects with error message from check");
    t.is(method.callCount, 0);
  }
});

test('hook.wrap("test", wrapMethod) rejected promise', async (t) => {
  const hook = new Hook.Collection();
  const method = sinon.stub();

  hook.wrap("test", () => {
    return Promise.reject(new Error("oops"));
  });

  try {
    await hook("test", method);
    hook("test", method);
    t.fail("must not resolve");
  } catch (error) {
    t.is(error.message, "oops", "rejects with error message from check");
    t.is(method.callCount, 0);
  }
});

test('hook.wrap("test", wrapMethod) options', async (t) => {
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
      t.is(options.foo, "bar");
      t.is(options.baz, "ar");
      t.is(options.otherbar, "baz");
    },
    { foo: "notbar", otherbar: "baz" }
  );
});

test('hook.wrap("test", wrapMethod) multiple wrap hooks', async (t) => {
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

  t.deepEqual(calls, ["wrap2", "wrap1", "method"]);
});
