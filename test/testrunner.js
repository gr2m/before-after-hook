let test, assert;
if ("Bun" in globalThis) {
  test = function test(name, fn) {
    return globalThis.Bun.jest(caller()).it(name, fn);
  };
  assert = function assert(value, message) {
    return globalThis.Bun.jest(caller()).expect(value, message);
  };
  /** Retrieve caller test file. */
  function caller() {
    const Trace = Error;
    const _ = Trace.prepareStackTrace;
    Trace.prepareStackTrace = (_, stack) => stack;
    const { stack } = new Error();
    Trace.prepareStackTrace = _;
    const caller = stack[2];
    return caller.getFileName().replaceAll("\\", "/");
  }
} else if ("Deno" in globalThis) {
  const nodeTest = await import("node:test");
  const nodeAssert = await import("node:assert");

  test = nodeTest.test;
  assert = nodeAssert.strict;
} else if (process.env.VITEST_WORKER_ID) {
  test = await import("vitest").then((module) => module.test);
  assert = await import("vitest").then((module) => module.assert);
} else {
  const nodeTest = await import("node:test");
  const nodeAssert = await import("node:assert");

  test = nodeTest.test;
  assert = nodeAssert.strict;
}

export { test, assert };
