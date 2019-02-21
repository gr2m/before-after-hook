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
  before (name: string, method: (options: any) => Promise<any> | any): Hook
  /**
   * Add error hook for given name. Returns `hook` instance for chaining.
   */
  error (name: string, method: (options: any) => Promise<any> | any): Hook
  /**
   * Add after hook for given name. Returns `hook` instance for chaining.
   */
  after (name: string, method: (options: any) => Promise<any> | any): Hook
  /**
   * Add wrap hook for given name. Returns `hook` instance for chaining.
   */
  wrap (name: string, method: (options: any) => Promise<any> | any): Hook
  /**
   * Removes hook for given name. Returns `hook` instance for chaining.
   */
  remove (name: string, beforeHookMethod: (options: any) => Promise<any> | any): Hook

  /**
   * Creates a nameless hook instance that allows passing down typings for the options
   */
  unnamed<T> (): UnnamedHook<T>
}

interface UnnamedHook<T> {
  /**
   * Invoke before and after hooks.
   */
  (method: (options: T) => Promise<T | null | void> | T | null | void): Promise<T>
  /**
   * Invoke before and after hooks.
   */
  (options: T, method: (options: Y) => Promise<T | null | void> | T | null | void): Promise<T>

  before(
    beforeFn: (options: T) => Promise<T | null | void> | T | null | void
  ): UnnamedHook<T>;
  /**
   * Add error hook for given name. Returns `hook` instance for chaining.
   */
  error(
    errorFn: (options: T) => Promise<T | null | void> | T | null | void
  ): UnnamedHook<T>;
  /**
   * Add after hook for given name. Returns `hook` instance for chaining.
   */
  after(
    afterFn: (options: T) => Promise<T | null | void> | T | null | void
  ): UnnamedHook<T>;
  /**
   * Add wrap hook for given name. Returns `hook` instance for chaining.
   */
  wrap(
    wrapFn: (options: T) => Promise<T | null | void> | T | null | void
  ): UnnamedHook<T>;
  /**
   * Removes hook for given name. Returns `hook` instance for chaining.
   */
  remove(
    beforeHookMethod: (options: T) => Promise<T | null | void> | T | null | void
  ): UnnamedHook<T>;
}

export declare const Hook: {new (): Hook}
