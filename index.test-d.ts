import { expectType } from "tsd";
import Hook from "./index.js";

export async function singularReadmeTest() {
  // instantiate singular hook API
  const hook = new Hook.Singular();

  expectType<InstanceType<Hook["Singular"]>>(hook);

  // Create a hook
  const method = () => {};
  function getData(options: unknown) {
    return hook(method, options);
  }

  // register before/error/after hooks.
  // The methods can be async or return a promise
  hook.before(() => {});
  hook.error(() => {});
  hook.after(() => {});

  expectType<Promise<unknown>>(getData({ id: 123 }));
}

export function collectionReadmeTest() {
  // instantiate hook collection API
  const hookCollection = new Hook.Collection();

  expectType<InstanceType<Hook["Collection"]>>(hookCollection);

  // Create a hook
  const method = () => {};
  function getData(options: unknown) {
    return hookCollection("get", method, options);
  }

  // register before/error/after hooks.
  // The methods can be async or return a promise
  hookCollection.before("get", () => {});
  hookCollection.error("get", () => {});
  hookCollection.after("get", () => {});

  expectType<Promise<any>>(getData({ id: 123 }));
}

// TODO: add assertions below

type Options = {
  [key: string]: any;
  everything: number;
};

const options: Options = {
  everything: 42,
  nothing: 0,
};

const hookMethod = (options: Options): number => {
  const sumOfNumbers = Object.keys(options)
    .map((key) => options[key])
    .filter((v): v is number => typeof v === "number")
    .reduce((sum, num) => sum + num, 0);

  return sumOfNumbers;
};

const beforeHook = (_options: Options): void => {};
const afterHook = (_result: number, _options: Options): void => {};
const errorHook = (_error: any, _options: Options): void => {};
const errorCatchHook = (_error: any, _options: Options) => "ok";
const wrapHook = (hookMethod: any, options: Options): number => {
  beforeHook(options);
  const result = hookMethod(options);
  afterHook(result, options);
  return result;
};

const hooks = new Hook.Collection();

hooks.before("life", beforeHook);
hooks.after("life", afterHook);
hooks.error("life", errorHook);
hooks.error("life", errorCatchHook);
hooks.wrap("life", wrapHook);

hooks("life", hookMethod);
hooks(["life"], hookMethod);

const hook = new Hook.Singular<Options, number>();

hook.before(beforeHook);
hook.after(afterHook);
hook.error(errorHook);
hook.error(errorCatchHook);
hook.wrap(wrapHook);

hook(hookMethod, options);
