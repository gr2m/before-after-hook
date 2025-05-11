import { test, assert } from "./testrunner.js";

import Hook from "../index.js";

test('hook.remove("test", check)', async () => {
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

  assert(calls.length === 1);
  assert(calls[0] === "check");
});

test('hook.remove("test", check) without "check" matching existing function', async () => {
  const hook = new Hook.Collection();
  const calls = [];

  hook.before("test", () => calls.push("before"));
  hook.remove("test", () => {
    throw new Error("should not be called");
  });

  await hook("test", () => {
    calls.push("check");
  });

  assert(calls.length === 2);
  assert(calls[0] === "before");
  assert(calls[1] === "check");
});
