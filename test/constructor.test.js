import { test, assert } from "./testrunner.js";

import Hook from "../index.js";

test("new Hook.Singular()", () => {
  const hook = new Hook.Singular();

  assert(typeof hook === "function", "hook() is a function");
  assert(typeof hook.before === "function", "hook.before() is function");
  assert(typeof hook.after === "function", "hook.after() is function");

  assert(typeof hook.api === "object", "hook.api is an object");
  assert(typeof hook.api.before === "function", "hook.before() is function");
  assert(typeof hook.api.after === "function", "hook.after() is function");
  assert(typeof hook.api === "object", "does ont expose hook() method");
});

test("new Hook.Collection()", () => {
  const hook = new Hook.Collection();

  assert(typeof hook, "function", "hook() is a function");
  assert(typeof hook.before === "function", "hook.before() is function");
  assert(typeof hook.after === "function", "hook.after() is function");

  assert(typeof hook.api === "object", "hook.api is an object");
  assert(typeof hook.api.before === "function", "hook.before() is function");
  assert(typeof hook.api.after === "function", "hook.after() is function");
  assert(typeof hook.api === "object", "does ont expose hook() method");
});
