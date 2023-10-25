import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronApi', {
  send: (event, ...args) => ipcRenderer.send(event, ...args),
  sendSync: (event, ...args) => ipcRenderer.sendSync(event, ...args),
  on: (event, listener: (...args: any[]) => void) => ipcRenderer.on(event, listener),
  once: (event, listener: (...args: any[]) => void) => ipcRenderer.once(event, listener),
  off: (event, listener: (...args: any[]) => void) => ipcRenderer.off(event, listener),
});

function addOverlayApplication() {
  const isDev = process.env.NODE_ENV === 'development';

  const { sendSync } = ipcRenderer;
  const scriptSrc = isDev
    ? `http://localhost:${sendSync('getConstant', 'OVERLAY_RENDERER_PORT')}/main.ts`
    : `file://${sendSync('getConstant', 'OVERLAY_APP_PATH')}`;

  console.log('scriptSrc', scriptSrc);

  const overlayScript = document.createElement('script');
  Object.assign(overlayScript, {
    src: scriptSrc,
    type: 'module',
    crossOrigin: '',
  })
  document.head.appendChild(overlayScript);


  const overlayRoot = document.createElement('div');
  overlayRoot.id = 'onlyMonsterOverlayRoot';
  document.body.appendChild(overlayRoot);
}

document.addEventListener('DOMContentLoaded', addOverlayApplication);
