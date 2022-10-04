import test from "ava";

import Hook from "../index.js";

test('hook.remove("test", check)', async (t) => {
  const hook = new Hook.Collection();
  const calls = [];

  const afterCheck = () => {
    calls.push("after");
  };
  hook.after("test", afterCheck);
  hook.remove("test", afterCheck);

  await hook("test", () => {
    calls.push("check");
  });

  t.deepEqual(calls, ["check"]);
});

test('hook.remove("test", check) without "check" matching existing function', async (t) => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.before("test", () => calls.push("before"));
  hook.remove("test", () => {
    throw new Error("should not be called");
  });

  await hook("test", () => {
    calls.push("check");
  });

  t.deepEqual(calls, ["before", "check"]);
});
