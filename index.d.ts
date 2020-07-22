type HookMethod<O, R> = (options: O) => R | Promise<R>

type BeforeHook<O> = (options: O) => void
type ErrorHook<O, E> = (error: E, options: O) => void
type AfterHook<O, R> = (result: R, options: O) => void
type WrapHook<O, R> = (
  hookMethod: HookMethod<O, R>,
  options: O
) => R | Promise<R>

type AnyHook<O, R, E> =
  | BeforeHook<O>
  | ErrorHook<O, E>
  | AfterHook<O, R>
  | WrapHook<O, R>

type TypeStoreKey = 'O' | 'R' | 'E'
type TypeStore = { [key in TypeStoreKey]?: any }
type GetType<
  Store extends TypeStore,
  Key extends TypeStoreKey
> = Key extends keyof Store ? Store[Key] : any

export interface HookCollection<
  HooksType extends Record<string, TypeStore>,
  HookName extends keyof HooksType = keyof HooksType
> {
  /**
   * Invoke before and after hooks
   */
  <Name extends HookName>(
    name: Name | Name[],
    hookMethod: HookMethod<
      GetType<HooksType[Name], 'O'>,
      GetType<HooksType[Name], 'R'>
    >,
    options?: GetType<HooksType[Name], 'O'>
  ): Promise<GetType<HooksType[Name], 'R'>>
  /**
   * Add `before` hook for given `name`
   */
  before<Name extends HookName>(
    name: Name,
    beforeHook: BeforeHook<GetType<HooksType[Name], 'O'>>
  ): void
  /**
   * Add `error` hook for given `name`
   */
  error<Name extends HookName>(
    name: Name,
    errorHook: ErrorHook<
      GetType<HooksType[Name], 'O'>,
      GetType<HooksType[Name], 'E'>
    >
  ): void
  /**
   * Add `after` hook for given `name`
   */
  after<Name extends HookName>(
    name: Name,
    afterHook: AfterHook<
      GetType<HooksType[Name], 'O'>,
      GetType<HooksType[Name], 'R'>
    >
  ): void
  /**
   * Add `wrap` hook for given `name`
   */
  wrap<Name extends HookName>(
    name: Name,
    wrapHook: WrapHook<
      GetType<HooksType[Name], 'O'>,
      GetType<HooksType[Name], 'R'>
    >
  ): void
  /**
   * Remove added hook for given `name`
   */
  remove<Name extends HookName>(
    name: Name,
    hook: AnyHook<
      GetType<HooksType[Name], 'O'>,
      GetType<HooksType[Name], 'R'>,
      GetType<HooksType[Name], 'E'>
    >
  ): void
  /**
   * Public API
   */
  api: Pick<
    HookCollection<HooksType>,
    'before' | 'error' | 'after' | 'wrap' | 'remove'
  >
}

export interface HookSingular<O, R, E> {
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
  error(errorHook: ErrorHook<O, E>): void
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
  remove(hook: AnyHook<O, R, E>): void
  /**
   * Public API
   */
  api: Pick<
    HookSingular<O, R, E>,
    'before' | 'error' | 'after' | 'wrap' | 'remove'
  >
}

type Collection = new <
  HooksType extends Record<string, TypeStore> = Record<
    string,
    { O: any; R: any; E: any }
  >
>() => HookCollection<HooksType>
type Singular = new <O = any, R = any, E = any>() => HookSingular<O, R, E>

interface Hook {
  new <
    HooksType extends Record<string, TypeStore> = Record<
      string,
      { O: any; R: any; E: any }
    >
  >(): HookCollection<HooksType>

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
