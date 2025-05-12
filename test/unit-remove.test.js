import { test, assert } from "./testrunner.js";

import { removeHook } from "../lib/remove.js";

test('removeHook("before", "name", method) with empty registry', () => {
  const state = {
    registry: {},
  };
  removeHook(state, "before", "test", () => {});

  assert(typeof state.registry === "object");
  assert(Object.keys(state.registry).length === 0);
});

test('removeHook("before", "name", method) with method that cannot be found', () => {
  const state = {
    registry: {
      test: [],
    },
  };
  removeHook(state, "before", "test", () => {});
  assert(typeof state.registry === "object");
  assert(Object.keys(state.registry).length === 1);
  assert(Array.isArray(state.registry.test));
  assert(state.registry.test.length === 0);
});
