import { test, assert } from "./testrunner.js";

import Hook from "../index.js";

test('hook.after("test", afterCheck) order', async () => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.after("test", () => {
    calls.push("after");
  });

  await hook("test", () => {
    calls.push("afterCheck");
  });

  assert(calls.length === 2);
  assert(calls[0] === "afterCheck");
  assert(calls[1] === "after");
});

test('hook.after("test", afterCheck) async afterCheck', async () => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.after("test", async () => {
    calls.push("after");
  });

  await hook("test", () => {
    calls.push("afterCheck");
  });

  assert(calls.length === 2);
  assert(calls[0] === "afterCheck");
  assert(calls[1] === "after");
});

test('hook.after("test", afterCheck) throws error', async () => {
  const hook = new Hook.Collection();
  const method = function method() {};

  hook.after("test", () => {
    throw new Error("oops");
  });

  try {
    await hook("test", method);
    assert(false, "must not resolve");
  } catch (error) {
    assert(
      error.message === "oops",
      "rejects with error message from afterCheck"
    );
  }
});

test('hook.after("test", afterCheck) rejected promise', async () => {
  const hook = new Hook.Collection();
  const method = function method() {};

  hook.after("test", () => {
    return Promise.reject(new Error("oops"));
  });

  try {
    await hook("test", method);
    assert(false, "must not resolve");
  } catch (error) {
    assert(
      error.message === "oops",
      "rejects with error message from afterCheck"
    );
  }
});

test('hook.after("test", afterCheck) result and options', async () => {
  const hook = new Hook.Collection();

  hook.after("test", (result, options) => {
    assert(options.optionFoo === "bar", "passes options to after hook");
    result.foo = "newbar";
  });
  hook.after("test", (result, options) => {
    result.baz = "ar";
  });

  const result = await hook(
    "test",
    () => {
      return {
        foo: "bar",
        otherFoo: "bar",
      };
    },
    { optionFoo: "bar" }
  );

  assert(result.foo === "newbar", "after hook modifies result");
  assert(result.otherFoo === "bar", "result is not modified by after hook");
});

test('hook.after("test", afterCheck) multiple after hooks get executed after method', async () => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.after("test", () => {
    calls.push("after1");
  });
  hook.after("test", () => {
    calls.push("after2");
  });

  await hook("test", () => {
    calls.push("afterCheck");
  });

  assert(calls.length === 3);
  assert(calls[0] === "afterCheck");
  assert(calls[1] === "after1");
  assert(calls[2] === "after2");
});
