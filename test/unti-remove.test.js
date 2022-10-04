import test from "ava";

import { removeHook } from "../lib/remove.js";

test('removeHook("before", "name", method) with empty registry', async (t) => {
  const state = {
    registry: {},
  };
  removeHook(state, "before", "test", () => {});
  t.deepEqual(state.registry, {});
});

test('removeHook("before", "name", method) with method that cannot be found', async (t) => {
  const state = {
    registry: {
      test: [],
    },
  };
  removeHook(state, "before", "test", () => {});
  t.deepEqual(state.registry, { test: [] });
});
