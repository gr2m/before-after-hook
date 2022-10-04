import sinon from "sinon";
import test from "ava";

import Hook from "../index.js";

test('hook.after("test", afterCheck) order', async (t) => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.after("test", () => {
    calls.push("after");
  });

  await hook("test", () => {
    calls.push("afterCheck");
  });

  t.deepEqual(calls, ["afterCheck", "after"]);
});

test('hook.after("test", afterCheck) async afterCheck', async (t) => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.after("test", async () => {
    calls.push("after");
  });

  await hook("test", () => {
    calls.push("afterCheck");
  });

  t.deepEqual(calls, ["afterCheck", "after"]);
});

test('hook.after("test", afterCheck) throws error', async (t) => {
  const hook = new Hook.Collection();
  const method = sinon.stub();

  hook.after("test", () => {
    throw new Error("oops");
  });

  try {
    await hook("test", method);
    t.fail("must not resolve");
  } catch (error) {
    t.is(error.message, "oops", "rejects with error message from afterCheck");
  }
});

test('hook.after("test", afterCheck) rejected promise', async (t) => {
  const hook = new Hook.Collection();
  const method = sinon.stub();

  hook.after("test", () => {
    return Promise.reject(new Error("oops"));
  });

  try {
    await hook("test", method);
    t.fail("must not resolve");
  } catch (error) {
    t.is(error.message, "oops", "rejects with error message from afterCheck");
  }
});

test('hook.after("test", afterCheck) result and options', async (t) => {
  const hook = new Hook.Collection();

  hook.after("test", (result, options) => {
    t.is(options.optionFoo, "bar", "passes options to after hook");
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

  t.is(result.foo, "newbar");
  t.is(result.otherFoo, "bar");
});

test('hook.after("test", afterCheck) multiple after hooks get executed after method', async (t) => {
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

  t.deepEqual(calls, ["afterCheck", "after1", "after2"]);
});
