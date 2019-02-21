interface HookInstance {
  /**
   * Invoke before and after hooks.
   */
  (name: string | string[], method: (options: any) => Promise<any> | any): Promise<any>
  /**
   * Invoke before and after hooks.
   */
  (name: string | string[], options: any, method: (options: any) => Promise<any> | any): Promise<any>
  /**
   * Add before hook for given name. Returns `hook` instance for chaining.
   */
  before (name: string, method: (options: any) => Promise<any> | any): HookInstance
  /**
   * Add error hook for given name. Returns `hook` instance for chaining.
   */
  error (name: string, method: (options: any) => Promise<any> | any): HookInstance
  /**
   * Add after hook for given name. Returns `hook` instance for chaining.
   */
  after (name: string, method: (options: any) => Promise<any> | any): HookInstance
  /**
   * Add wrap hook for given name. Returns `hook` instance for chaining.
   */
  wrap (name: string, method: (options: any) => Promise<any> | any): HookInstance
  /**
   * Removes hook for given name. Returns `hook` instance for chaining.
   */
  remove (name: string, beforeHookMethod: (options: any) => Promise<any> | any): HookInstance

  /**
   * Creates a nameless hook instance that allows passing down typings of the options
   */
  unnamed<T> (): UnnamedHook<T>
}

interface UnnamedHook<T> {
  /**
   * Invoke before and after hooks without options
   */
  (method: (options: T) => Promise<T | null | void> | T | null | void): Promise<T>
  /**
   * Invoke before and after hooks with options
   */
  (options: T, method: (options: Y) => Promise<T | null | void> | T | null | void): Promise<T>

  before(
    beforeFn: (options: T) => Promise<T | null | void> | T | null | void
  ): UnnamedHook<T>;
  /**
   * Add error hook. Returns `UnnamedHook` instance for chaining.
   */
  error(
    errorFn: (options: T) => Promise<T | null | void> | T | null | void
  ): UnnamedHook<T>;
  /**
   * Add after hook. Returns `UnnamedHook` instance for chaining.
   */
  after(
    afterFn: (options: T) => Promise<T | null | void> | T | null | void
  ): UnnamedHook<T>;
  /**
   * Add wrap hook. Returns `UnnamedHook` instance for chaining.
   */
  wrap(
    wrapFn: (options: T) => Promise<T | null | void> | T | null | void
  ): UnnamedHook<T>;
  /**
   * Removes hook. Returns `UnnamedHook` instance for chaining.
   */
  remove(
    beforeHookMethod: (options: T) => Promise<T | null | void> | T | null | void
  ): UnnamedHook<T>;
}

interface HookType {
  new (): HookInstance
}

declare const Hook: HookType
export = Hook
