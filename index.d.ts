interface HookInstance {
  (name: string | string[], method: (options: any) => any): Promise<any>
  (name: string | string[], options: any, method: (options: any) => any): Promise<any>
  before (name: string, method: (options: any) => any): HookInstance
  error (name: string, method: (options: any) => any): HookInstance
  after (name: string, method: (options: any) => any): HookInstance
  wrap (name: string, method: (options: any) => any): HookInstance
  remove (name: string, beforeHookMethod: (options: any) => any): HookInstance
}

interface HookType {
  new (): HookInstance
}

declare const Hook: HookType
export = Hook
