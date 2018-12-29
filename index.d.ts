declare module 'before-after-hook' {
  export interface HookInstance {
    (name: string, data: any, method: (...any) => any): Promise<any>
    before (name: string, method: (...any) => any): Promise<any>
    error (name: string, method: (...any) => any): Promise<any>
    after (name: string, method: (...any) => any): Promise<any>
    wrap (name: string, method: (...any) => any): Promise<any>
    remove (name: string, beforeHookMethod: (...any) => any): Promise<any>
  }

  export interface HookType {
    new (): HookInstance
  }

  const Hook: HookType
  export default Hook
}