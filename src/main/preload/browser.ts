import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronApi', {
  send: (event, ...args) => ipcRenderer.send(event, ...args),
  sendSync: (event, ...args) => ipcRenderer.sendSync(event, ...args),
  on: (event, listener: (...args: any[]) => void) => ipcRenderer.on(event, listener),
  once: (event, listener: (...args: any[]) => void) => ipcRenderer.once(event, listener),
  off: (event, listener: (...args: any[]) => void) => ipcRenderer.off(event, listener),
});

// function attachVueDevToolsScript() {
//   const isDev = process.env.NODE_ENV === 'development';
//   if (isDev) {
//     const vueDevToolsScript = document.createElement('script');
//     vueDevToolsScript.src = 'http://localhost:8098';
//     document.head.appendChild(vueDevToolsScript);
//   }
// }

// document.addEventListener('DOMContentLoaded', attachVueDevToolsScript);
