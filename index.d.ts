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

  export interface HookSingular<T> {
    /**
     * Invoke before and after hooks
     */
    (hookMethod: (options: T) => void | T | Promise<void | T>, options?: T): Promise<T>

    /**
     * Add before hook. Returns `UnnamedHook` instance for chaining.
     */
    before(
      beforeHook: (options: T) => void | T | Promise<void | T>
    ): HookSingular<T>;

    /**
     * Add error hook. Returns `UnnamedHook` instance for chaining.
     */
    error(
      errorHook: (options: T) => void | T | Promise<void | T>
    ): HookSingular<T>;

    /**
     * Add after hook. Returns `UnnamedHook` instance for chaining.
     */
    after(
      afterHook: (options: T) => void | T | Promise<void | T>
    ): HookSingular<T>;

    /**
     * Add wrap hook. Returns `UnnamedHook` instance for chaining.
     */
    wrap(
      wrapHook: (options: T) => void | T | Promise<void | T>
    ): HookSingular<T>;

    /**
     * Removes hook. Returns `UnnamedHook` instance for chaining.
     */
    remove(
      hookMethod: (options: T) => void | T | Promise<void | T>
    ): HookSingular<T>;
  }

  export const Hook: {
    new (): HookCollection

    /**
     * Creates a nameless hook that allows passing down typings for the options
     */
    Singular: {new <T = any>(): HookSingular<T>}

    /**
     * Creates a hook collection
     */
    Collection: {new (): HookCollection}
  }

  export const Singular: {new <T = any>(): HookSingular<T>}
  export const Collection: {new (): HookCollection}

  export = Hook
}
