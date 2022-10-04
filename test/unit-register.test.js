import test from "ava";

import { register } from "../lib/register.js";

test('register("name", method) with empty registry and thrown error by method', async (t) => {
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
    t.fail("should not resolve");
  } catch (error) {
    t.is("foo", error.message);
  }
});

test('register("name", undefined)', async (t) => {
  t.throws(register.bind(null, {}, "test", undefined));
});

test('register("name", undefined, method)', async (t) => {
  t.throws(register.bind(null, {}, "test", undefined, () => {}));
});
