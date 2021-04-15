import { Hook, Collection, Singular } from "../index";

// ************************************************************
// THIS CODE IS NOT EXECUTED. IT IS JUST FOR TYPECHECKING
// ************************************************************

const _Collection = Hook.Collection;
const _Singular = Hook.Singular;

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

const hooks = new Collection();

hooks.before("life", beforeHook);
hooks.after("life", afterHook);
hooks.error("life", errorHook);
hooks.error("life", errorCatchHook);
hooks.wrap("life", wrapHook);

hooks("life", hookMethod);
hooks(["life"], hookMethod);

const hook = new Singular<Options, number>();

hook.before(beforeHook);
hook.after(afterHook);
hook.error(errorHook);
hook.error(errorCatchHook);
hook.wrap(wrapHook);

hook(hookMethod, options);
