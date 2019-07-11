type HookMethod<O, R> = (options: O) => R | Promise<R>

type BeforeHook<O> = (options: O) => void
type ErrorHook<O> = (error: any, options: O) => void
type AfterHook<O, R> = (result: R, options: O) => void
type WrapHook<O, R> = (
  hookMethod: HookMethod<O, R>,
  options: O
) => R | Promise<R>

type AnyHook<O, R> =
  | BeforeHook<O>
  | ErrorHook<O>
  | AfterHook<O, R>
  | WrapHook<O, R>

interface HookCollection {
  /**
   * Invoke before and after hooks
   */
  (
    name: string | string[],
    hookMethod: HookMethod<any, any>,
    options?: any
  ): Promise<any>
  /**
   * Add `before` hook for given `name`
   */
  before(name: string, beforeHook: BeforeHook<any>): void
  /**
   * Add `error` hook for given `name`
   */
  error(name: string, errorHook: ErrorHook<any>): void
  /**
   * Add `after` hook for given `name`
   */
  after(name: string, afterHook: AfterHook<any, any>): void
  /**
   * Add `wrap` hook for given `name`
   */
  wrap(name: string, wrapHook: WrapHook<any, any>): void
  /**
   * Remove added hook for given `name`
   */
  remove(name: string, hook: AnyHook<any, any>): void
}

interface HookSingular<O, R> {
  /**
   * Invoke before and after hooks
   */
  (hookMethod: HookMethod<O, R>, options?: O): Promise<R>
  /**
   * Add `before` hook
   */
  before(beforeHook: BeforeHook<O>): void
  /**
   * Add `error` hook
   */
  error(errorHook: ErrorHook<O>): void
  /**
   * Add `after` hook
   */
  after(afterHook: AfterHook<O, R>): void
  /**
   * Add `wrap` hook
   */
  wrap(wrapHook: WrapHook<O, R>): void
  /**
   * Remove added hook
   */
  remove(hook: AnyHook<O, R>): void
}

type Collection = new () => HookCollection
type Singular = new <O = any, R = any>() => HookSingular<O, R>

interface Hook {
  new (): HookCollection

  /**
   * Creates a collection of hooks
   */
  Collection: Collection

  /**
   * Creates a nameless hook that supports strict typings
   */
  Singular: Singular
}

export const Hook: Hook
export const Collection: Collection
export const Singular: Singular

export default Hook
