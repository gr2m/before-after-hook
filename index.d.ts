type HookMethod<O = any, R = any> = (options: O) => R | Promise<R>

type SingularBeforeHook<O> = (options: O) => void
type SingularErrorHook<O> = (error: any, options: O) => void
type SingularAfterHook<O, R> = (result: R, options: O) => void
type SingularWrapHook<O, R> = (hookMethod: HookMethod<O, R>, options: O) => R | Promise<R>

declare module "before-after-hook" {
  export interface HookCollection {
    /**
     * Invoke before and after hooks.
     */
    (name: string | string[], method: (options: any) => Promise<any> | any): Promise<any>
    /**
     * Invoke before and after hooks.
     */
    (name: string | string[], method: (options: any) => Promise<any> | any, options: any): Promise<any>
    /**
     * Add before hook for given name. Returns `hook` instance for chaining.
     */
    before (name: string, method: (options: any) => Promise<any> | any): HookCollection
    /**
     * Add error hook for given name. Returns `hook` instance for chaining.
     */
    error (name: string, method: (options: any) => Promise<any> | any): HookCollection
    /**
     * Add after hook for given name. Returns `hook` instance for chaining.
     */
    after (name: string, method: (options: any) => Promise<any> | any): HookCollection
    /**
     * Add wrap hook for given name. Returns `hook` instance for chaining.
     */
    wrap (name: string, method: (options: any) => Promise<any> | any): HookCollection
    /**
     * Removes hook for given name. Returns `hook` instance for chaining.
     */
    remove (name: string, beforeHookMethod: (options: any) => Promise<any> | any): HookCollection
  }

  export interface HookSingular<O, R> {
    /**
     * Invoke before and after hooks
     */
    (hookMethod: HookMethod<O, R>, options?: O): Promise<R>

    /**
     * Add before hook. Returns `UnnamedHook` instance for chaining.
     */
    before(
      beforeHook: SingularBeforeHook<O>
    ): HookSingular<O, R>;

    /**
     * Add error hook. Returns `UnnamedHook` instance for chaining.
     */
    error(
      errorHook: SingularErrorHook<O>
    ): HookSingular<O, R>;

    /**
     * Add after hook. Returns `UnnamedHook` instance for chaining.
     */
    after(
      afterHook: SingularAfterHook<O, R>
    ): HookSingular<O, R>;

    /**
     * Add wrap hook. Returns `UnnamedHook` instance for chaining.
     */
    wrap(
      wrapHook: SingularWrapHook<O, R>
    ): HookSingular<O, R>;

    /**
     * Removes hook. Returns `UnnamedHook` instance for chaining.
     */
    remove(
      hook: SingularBeforeHook<O> | SingularErrorHook<O> | SingularAfterHook<O, R> | SingularWrapHook<O, R>
    ): HookSingular<O, R>;
  }

  export const Hook: {
    new (): HookCollection

    /**
     * Creates a nameless hook that allows passing down typings for the options
     */
    Singular: {new <O = any, R = any>(): HookSingular<O, R>}

    /**
     * Creates a hook collection
     */
    Collection: {new (): HookCollection}
  }

  export const Singular: {new <O = any, R = any>(): HookSingular<O, R>}
  export const Collection: {new (): HookCollection}

  export = Hook
}
