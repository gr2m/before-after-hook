import test from "ava";

import Hook from "../index.js";

test("new Hook.Singular()", (t) => {
  const hook = new Hook.Singular();

  t.is(typeof hook, "function", "hook() is a function");
  t.is(typeof hook.before, "function", "hook.before() is function");
  t.is(typeof hook.after, "function", "hook.after() is function");

  t.is(typeof hook.api, "object", "hook.api is an object");
  t.is(typeof hook.api.before, "function", "hook.before() is function");
  t.is(typeof hook.api.after, "function", "hook.after() is function");
  t.is(typeof hook.api, "object", "does ont expose hook() method");
});

test("new Hook.Collection()", (t) => {
  const hook = new Hook.Collection();

  t.is(typeof hook, "function", "hook() is a function");
  t.is(typeof hook.before, "function", "hook.before() is function");
  t.is(typeof hook.after, "function", "hook.after() is function");

  t.is(typeof hook.api, "object", "hook.api is an object");
  t.is(typeof hook.api.before, "function", "hook.before() is function");
  t.is(typeof hook.api.after, "function", "hook.after() is function");
  t.is(typeof hook.api, "object", "does ont expose hook() method");
});
