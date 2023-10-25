import { BrowserWindow, ipcMain } from 'electron';
import AccountSession from './AccountSession';

export let accountsSessions: Record<string, AccountSession> = {};
export let activeSessionId: string;
export const INITIAL_URL = 'https://onlyfans.com';

export function load(mainWindow: BrowserWindow) {
  const ids = ['1', '2', '3', '4', '5', '6'];

  for (const id of ids) {
    accountsSessions[id] = new AccountSession(mainWindow, id);
  }
}

export function getActiveSession() {
  const activeSession = accountsSessions[activeSessionId];
  if (!activeSession) {
    console.error('No active session selected');
  }

  return activeSession;
}

ipcMain
  .on('getAccountsSessions', (event) => {
    event.returnValue = Object.keys(accountsSessions);
  })
  .on('setActiveSession', (event, id) => {
    if (activeSessionId !== id) {
      if (activeSessionId) {
        getActiveSession().hide();
      }

      activeSessionId = id;

      getActiveSession().show();
    }

    event.returnValue = true;
  })
  .on('getTabsInfo', (event) => {
    event.returnValue = getActiveSession().tabsInfo;
  })
  .on('openNewTab', (event) => {
    const newTabIndex = getActiveSession().openNewTab(INITIAL_URL);
    event.returnValue = getActiveSession().tabsInfo;
  })
  .on('closeTab', (event, index: number) => {
    getActiveSession().closeTab(index);
    event.returnValue = getActiveSession().tabsInfo;
  })
  .on('focusTab', (event, index: number) => {
    getActiveSession().focusTab(index);
    console.log('manualFocus');
    event.returnValue = getActiveSession().tabsInfo;
  })
  .on('goBack', (event) => {
    getActiveSession().goBack();
    event.returnValue = getActiveSession().tabsInfo;
  })
  .on('goForward', (event) => {
    getActiveSession().goForward();
    event.returnValue = getActiveSession().tabsInfo;
  })
  .on('reloadTab', (event) => {
    getActiveSession().reload();
    event.returnValue = getActiveSession().tabsInfo;
  })
  .on('rearrangeTags', (event, oldIndex: number, newIndex: number) => {
    getActiveSession().rearrangeTabs(oldIndex, newIndex);
    event.returnValue = getActiveSession().tabsInfo;
  })
