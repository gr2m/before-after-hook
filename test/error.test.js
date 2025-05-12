import { test, assert } from "./testrunner.js";

import Hook from "../index.js";

test('hook.error("test", handleError) order', async () => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.error("test", () => {
    calls.push("errorHook");
  });
  hook.after("test", () => {
    calls.push("afterHook");
  });

  await hook("test", () => {
    calls.push("method");
    throw new Error("oops");
  });

  assert(calls.length === 3);
  assert(calls[0] === "method");
  assert(calls[1] === "errorHook");
  assert(calls[2] === "afterHook");
});

test('hook.error("test", handleError) async order', async () => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.error("test", () => {
    calls.push("errorHook");
  });

  await hook("test", () => {
    return new Promise(() => {
      calls.push("method");
      throw new Error("oops");
    });
  });

  assert(calls.length === 2);
  assert(calls[0] === "method");
  assert(calls[1] === "errorHook");
});

test('hook.error("test", handleError) can mutate error', async () => {
  const hook = new Hook.Collection();
  const method = function method() {
    throw new Error("oops");
  };

  hook.error("test", (error) => {
    error.message = "error hook";
    throw error;
  });

  try {
    await hook("test", method);
    assert(false, "must not resolve");
  } catch (error) {
    assert(
      error.message === "error hook",
      "rejects with error message from error hook"
    );
  }
});

test('hook.error("test", handleError) rejected promise', async () => {
  const hook = new Hook.Collection();
  const method = function method() {
    throw new Error("oops");
  };

  hook.error("test", (error) => {
    error.message = "error hook";
    return Promise.reject(error);
  });

  try {
    await hook("test", method);
    assert(false, "must not resolve");
  } catch (error) {
    assert(
      error.message,
      "error hook",
      "rejects with error message from error hook"
    );
  }
});

test('hook.error("test", handleError) can catch error', async () => {
  const hook = new Hook.Collection();
  const method = function method() {
    throw new Error("oops");
  };

  hook.error("test", () => {
    return { ok: true };
  });

  const result = await hook("test", method);

  assert(result.ok === true);
});

test('hook.error("test", handleError) receives options', async () => {
  const hook = new Hook.Collection();
  const method = function method() {
    throw new Error("oops");
  };

  hook.error("test", (error, options) => {
    assert(options.optionFoo === "bar");
    throw error;
  });

  try {
    await hook("test", method, { optionFoo: "bar" });
    assert(false, "must not resolve");
  } catch (error) {
    assert(error.message === "oops");
  }
});

test('hook.error("test", handleError) multiple error hooks get executed after method', async () => {
  const hook = new Hook.Collection();
  const callOrder = [];
  const method = function method() {
    callOrder.push(1);
    throw new Error("oops");
  };
  let errorHandlerCallCount = 0;
  const errorHandler = function errorHandler() {
    errorHandlerCallCount++;
    throw new Error("error handler oops");
  };

  hook.error("test", () => {
    callOrder.push(2);
    errorHandler();
  });
  hook.error("test", () => {
    callOrder.push(3);
    errorHandler();
  });

  try {
    await hook("test", method);
    assert(false, "should not resolve");
  } catch (error) {
    assert(errorHandlerCallCount === 2);
    assert(callOrder.length === 3);
    assert(callOrder[0] === 1);
    assert(callOrder[1] === 2);
    assert(callOrder[2] === 3);
    assert(error.message === "error handler oops");
  }
});
