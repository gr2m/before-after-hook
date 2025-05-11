import { test, assert } from "./testrunner.js";

import { register } from "../lib/register.js";

test('register("name", method) with empty registry and thrown error by method', async () => {
  try {
    await register(
      {
        registry: {},
      },
      "test",
      () => {
        throw new Error("foo");
      }
    );
    assert(false, "should not resolve");
  } catch (error) {
    assert(error.message === "foo", "rejects with error message from method");
  }
});

test('register("name", undefined)', () => {
  try {
    register.bind(null, {}, "test", undefined)();
    assert(false, "should throw");
  } catch (error) {
    assert(
      error.message === "method for before hook must be a function",
      "rejects with error message from method"
    );
  }
});

test('register("name", undefined, method)', () => {
  try {
    register.bind(null, {}, "test", undefined, () => {})();
    assert(false, "should throw");
  } catch (error) {
    assert(
      error.message === "method for before hook must be a function",
      "rejects with error message from method"
    );
  }
});
