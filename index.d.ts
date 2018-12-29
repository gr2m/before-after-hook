interface HookInstance {
  (name: string, method: (options: any) => any): Promise<any>
  (name: string, options: any, method: (options: any) => any): Promise<any>
  before (name: string, method: (options: any) => any): Promise<any>
  error (name: string, method: (options: any) => any): Promise<any>
  after (name: string, method: (options: any) => any): Promise<any>
  wrap (name: string, method: (options: any) => any): Promise<any>
  remove (name: string, beforeHookMethod: (options: any) => any): Promise<any>
}

interface HookType {
  new (): HookInstance
}

declare const Hook: HookType
export = Hook
