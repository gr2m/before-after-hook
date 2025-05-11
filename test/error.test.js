import test from "ava";

import Hook from "../index.js";

test('hook.error("test", handleError) order', async (t) => {
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

  t.deepEqual(calls, ["method", "errorHook", "afterHook"]);
});

test('hook.error("test", handleError) async order', async (t) => {
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

  t.deepEqual(calls, ["method", "errorHook"]);
});

test('hook.error("test", handleError) can mutate error', async (t) => {
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
    t.fail("must not resolve");
  } catch (error) {
    t.is(
      error.message,
      "error hook",
      "rejects with error message from error hook"
    );
  }
});

test('hook.error("test", handleError) rejected promise', async (t) => {
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
    t.fail("must not resolve");
  } catch (error) {
    t.is(
      error.message,
      "error hook",
      "rejects with error message from error hook"
    );
  }
});

test('hook.error("test", handleError) can catch error', async (t) => {
  const hook = new Hook.Collection();
  const method = function method() {
    throw new Error("oops");
  };

  hook.error("test", () => {
    return { ok: true };
  });

  const result = await hook("test", method);

  t.is(result.ok, true);
});

test('hook.error("test", handleError) receives options', async (t) => {
  const hook = new Hook.Collection();
  const method = function method() {
    throw new Error("oops");
  };

  hook.error("test", (error, options) => {
    t.is(options.optionFoo, "bar");
    throw error;
  });

  try {
    await hook("test", method, { optionFoo: "bar" });
    t.fail("must not resolve");
  } catch (error) {
    t.is(error.message, "oops");
  }
});

test('hook.error("test", handleError) multiple error hooks get executed after method', async (t) => {
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
    t.fail("should not resolve");
  } catch (error) {
    t.is(errorHandlerCallCount, 2);
    t.deepEqual(callOrder, [1, 2, 3]);
    t.is(error.message, "error handler oops");
  }
});
