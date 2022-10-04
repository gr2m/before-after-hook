import test from "ava";

import Hook from "../index.js";

test("Hook.Singular() multiple names", async (t) => {
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

  t.deepEqual(calls, [
    "beforeFirst",
    "beforeSecond",
    "method",
    "afterFirst",
    "afterSecond",
  ]);
});

test("Hook.Singular() order", async (t) => {
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

  t.deepEqual(calls, ["before 2", "before 1", "method", "after 1", "after 2"]);
});

test("Hook.Singular() multiple unnamed hooks", async (t) => {
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

  t.deepEqual(calls, [
    "before 1",
    "method 1",
    "after 1",
    "before 2",
    "method 2",
    "after 2",
  ]);
});

test("Hook.Singular() no handlers defined (#51)", async (t) => {
  const hook = new Hook.Singular();
  const options = { foo: "bar" };

  await hook((_options) => {
    t.deepEqual(options, _options);
  }, options);
});
