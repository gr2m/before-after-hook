interface Hook {
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
  unnamed<T> (): UnnamedHookInstance<T>
}

interface UnnamedHookInstance<T> {
  /**
   * Invoke before and after hooks without options
   */
  (method: (options: T) => T | null | void): Promise<T>
  /**
   * Invoke before and after hooks without options
   */
  (method: (options: T) => Promise<T | null | void>): Promise<T>
  /**
   * Invoke before and after hooks with options
   */
  (options: T, method: (options: T) => T | null | void): Promise<T>
  /**
   * Invoke before and after hooks with options
   */
  (options: T, method: (options: T) => Promise<T | null | void>): Promise<T>

  /**
   * Add before hook. Returns `UnnamedHook` instance for chaining.
   */
  before(
    beforeFn: (options: T) => T | null | void
  ): UnnamedHookInstance<T>;
  /**
   * Add before hook. Returns `UnnamedHook` instance for chaining.
   */
  before(
    beforeFn: (options: T) => Promise<T | null | void>
  ): UnnamedHookInstance<T>;

  /**
   * Add error hook. Returns `UnnamedHook` instance for chaining.
   */
  error(
    errorFn: (options: T) => T | null | void
  ): UnnamedHookInstance<T>;
  /**
   * Add error hook. Returns `UnnamedHook` instance for chaining.
   */
  error(
    errorFn: (options: T) => Promise<T | null | void>
  ): UnnamedHookInstance<T>;

  /**
   * Add after hook. Returns `UnnamedHook` instance for chaining.
   */
  after(
    afterFn: (options: T) => T | null | void
  ): UnnamedHookInstance<T>;
  /**
   * Add after hook. Returns `UnnamedHook` instance for chaining.
   */
  after(
    afterFn: (options: T) => Promise<T | null | void>
  ): UnnamedHookInstance<T>;

  /**
   * Add wrap hook. Returns `UnnamedHook` instance for chaining.
   */
  wrap(
    wrapFn: (options: T) => T | null | void
  ): UnnamedHookInstance<T>;
  /**
   * Add wrap hook. Returns `UnnamedHook` instance for chaining.
   */
  wrap(
    wrapFn: (options: T) => Promise<T | null | void>
  ): UnnamedHookInstance<T>;

  /**
   * Removes hook. Returns `UnnamedHook` instance for chaining.
   */
  remove(
    beforeHookMethod: (options: T) => T | null | void
  ): UnnamedHookInstance<T>;
  /**
   * Removes hook. Returns `UnnamedHook` instance for chaining.
   */
  remove(
    beforeHookMethod: (options: T) => Promise<T | null | void>
  ): UnnamedHookInstance<T>;
}

declare const Hook: {new (): Hook}

export = Hook
