import {
  app, BrowserWindow, BrowserView, ipcMain, session, protocol
} from 'electron';
import AccountSession from './AccountSession';
import Path from 'path';
import { load as loadAccountsSessions } from './BrowserAccountsSessions';

export const APP_PATH = app.getAppPath();
export const OVERLAY_APP_PATH = Path.join(APP_PATH,
  '..', 'app.asar', 'overlay', 'overlay-application.mjs');
export const OVERLAY_RENDERER_PORT = process.argv[2];
export const BROWSER_RENDERER_PORT = process.argv[3];

export const CONSTANTS = {
  APP_PATH, OVERLAY_APP_PATH, OVERLAY_RENDERER_PORT, BROWSER_RENDERER_PORT,
};

Object.assign(process.env, { APP_PATH, OVERLAY_APP_PATH });

const windowSize = {
  width: 1200,
  height: 900,
  minWidth: 600,
  minHeight: 428,
}

async function createWindow() {
  const mainWindow = new BrowserWindow({
    // useContentSize: true,
    ...windowSize,
    webPreferences: {
      preload: Path.join(__dirname, 'preload', 'browser.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    show: false,
  });

  mainWindow.webContents.on('did-finish-load', () => mainWindow.show());

  loadAccountsSessions(mainWindow);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(`http://localhost:${BROWSER_RENDERER_PORT}`);

    mainWindow.webContents.openDevTools({
      mode: 'detach',
    });
  }
  else {
    mainWindow.loadFile(Path.join(APP_PATH, 'browser', 'index.html'));
  }
}

function preLaunch() {
  // workaround for file/https security errors
  app.commandLine.appendSwitch('disable-site-isolation-trials');

  // workaround for CORS errors when injecting vite frontend script
  // in the preload
  app.commandLine.appendSwitch('disable-features',
    'BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessSendPreflights');

  // disable security warnings
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
}

preLaunch();

app.whenReady().then(async () => {
  createWindow();

  // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       ...details.responseHeaders,
  //       'Content-Security-Policy': ['script-src \'self\'']
  //     }
  //   })
  // })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('getConstant', (event, constantName) => {
  event.returnValue = CONSTANTS[constantName];
});
