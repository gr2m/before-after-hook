import { test, assert } from "./testrunner.js";

import Hook from "../index.js";

test("Hook.Singular() multiple names", async () => {
  const hook = new Hook.Singular();
  const calls = [];

  hook.before(() => {
    calls.push("beforeSecond");
  });
  hook.before(() => {
    calls.push("beforeFirst");
  });
  hook.after(() => {
    calls.push("afterFirst");
  });
  hook.after(() => {
    calls.push("afterSecond");
  });

  await hook(() => {
    calls.push("method");
  });

  assert(calls.length === 5);
  assert(calls[0] === "beforeFirst");
  assert(calls[1] === "beforeSecond");
  assert(calls[2] === "method");
  assert(calls[3] === "afterFirst");
  assert(calls[4] === "afterSecond");
});

test("Hook.Singular() order", async () => {
  const hook = new Hook.Singular();
  const calls = [];

  hook.before(() => {
    calls.push("before 1");
  });
  hook.after(() => {
    calls.push("after 1");
  });
  hook.before(() => {
    calls.push("before 2");
  });
  hook.after(() => {
    calls.push("after 2");
  });

  await hook(() => {
    calls.push("method");
  });

  assert(calls.length === 5);
  assert(calls[0] === "before 2");
  assert(calls[1] === "before 1");
  assert(calls[2] === "method");
  assert(calls[3] === "after 1");
  assert(calls[4] === "after 2");
});

test("Hook.Singular() multiple unnamed hooks", async () => {
  const calls = [];

  const hook1 = new Hook.Singular();
  hook1.before(() => {
    calls.push("before 1");
  });
  hook1.after(() => {
    calls.push("after 1");
  });
  const hook2 = new Hook.Singular();
  hook2.before(() => {
    calls.push("before 2");
  });
  hook2.after(() => {
    calls.push("after 2");
  });

  await hook1(() => {
    calls.push("method 1");
  });

  await hook2(() => {
    calls.push("method 2");
  });

  assert(calls.length === 6);
  assert(calls[0] === "before 1");
  assert(calls[1] === "method 1");
  assert(calls[2] === "after 1");
  assert(calls[3] === "before 2");
  assert(calls[4] === "method 2");
  assert(calls[5] === "after 2");
});

test("Hook.Singular() no handlers defined (#51)", async () => {
  const hook = new Hook.Singular();
  const options = { foo: "bar" };

  await hook((_options) => {
    assert(typeof _options === "object");
    assert(Object.keys(_options).length === 1);
    assert(_options.foo === "bar", "passes options to method");
  }, options);
});
