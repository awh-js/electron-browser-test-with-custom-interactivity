/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface electronApi {
  send: (event: string, ...args: any[]) => void
  sendSync: (event: string, ...args: any[]) => any
  on: (event: string, listener: (...args: any[]) => void) => electronApi
  once: (event: string, listener: (...args: any[]) => void) => electronApi
  off: (event: string, listener?: (...args: any[]) => void) => electronApi
}

declare global {
  interface Window {
    electronApi: electronApi;
  }
}
