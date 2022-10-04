import sinon from "sinon";
import test from "ava";

import Hook from "../index.js";

test('hook.before("test", check) order', async (t) => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.before("test", () => {
    calls.push("before");
  });

  await hook("test", () => {
    calls.push("check");
  });

  t.deepEqual(calls, ["before", "check"]);
});

test('hook.before("test", check) async check', async (t) => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.before("test", async () => {
    calls.push("before");
  });

  await hook("test", () => {
    calls.push("check");
  });

  t.deepEqual(calls, ["before", "check"]);
});

test('hook.before("test", check) throws error', async (t) => {
  const hook = new Hook.Collection();
  const method = sinon.stub();

  hook.before("test", () => {
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

test('hook.before("test", check) rejected promise', async (t) => {
  const hook = new Hook.Collection();
  const method = sinon.stub();

  hook.before("test", () => {
    return Promise.reject(new Error("oops"));
  });

  try {
    await hook("test", method);
    t.fail("must not resolve");
  } catch (error) {
    t.is(error.message, "oops", "rejects with error message from check");
    t.is(method.callCount, 0);
  }
});

test('hook.before("test", check) options', async (t) => {
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
      t.is(options.foo, "bar");
      t.is(options.baz, "ar");
      t.is(options.otherbar, "baz");
    },
    { foo: "notbar", otherbar: "baz" }
  );
});

test('before("test", check) multiple before hooks get executed before method', async (t) => {
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

  t.deepEqual(calls, ["before2", "before1", "check"]);
});
