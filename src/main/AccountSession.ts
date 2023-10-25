import { ipcMain, BrowserView, BrowserWindow } from 'electron';
import type TabInfo from '../types/TabInfo';
import Path from 'path';

export const TAB_CHANGE_EVENTS = [
  'page-title-updated',
  'did-frame-navigate',
];

export function createBrowserView({ bounds, id = '0' }: {
  bounds: Electron.Rectangle,
  id?: string,
}) {
  const view = new BrowserView({
    webPreferences: {
      preload: Path.join(__dirname, 'preload', 'overlay.js'),
      webSecurity: false,
      nodeIntegration: false,
      contextIsolation: true,
      partition: `persist:${id}`,
    },
  });

  view.setAutoResize({
    width: true,
    height: true,
    vertical: true,
    horizontal: true,
  });

  view.setBounds({
    ...bounds,
    x: 0,
    y: 100,
  });

  return view;
}

// TODO: add partition
export default class BrowserSession {
  mainWindow: BrowserWindow;
  id: string;
  browserViews = [] as BrowserView[];
  focusedTabIndex = -1;

  constructor(mainWindow: BrowserWindow, id: string) {
    this.mainWindow = mainWindow;
    this.id = id;
  }

  openNewTab(url: string) {
    const { browserViews, mainWindow, id } = this;

    const browserView = createBrowserView({
      bounds: mainWindow.getContentBounds(),
      id,
    });
    browserViews.push(browserView);

    this.attachBrowserViewChangeEvents(browserView);

    mainWindow.addBrowserView(browserView);
    browserView.webContents.loadURL(url);
    // browserView.webContents.openDevTools({
    //   mode: 'detach',
    // });

    if (this.focusedTabIndex === -1) {
      this.focusedTabIndex = 0;
    }
    // To focus newely created tab
    // this.focusedTabIndex = newTabIndex;

    mainWindow.setTopBrowserView(browserViews[this.focusedTabIndex])

    const newTabIndex = browserViews.length - 1;
    return newTabIndex;
  }

  tabsChanged() {
    const { mainWindow, id } = this;

    mainWindow.webContents.send('tabsChanged', id, this.tabsInfo);
  }

  attachBrowserViewChangeEvents(browserView: BrowserView) {
    const { mainWindow, browserViews, id } = this;

    const addEventListener = (eventName) => {
      browserView.webContents.on(eventName, () => {
        this.tabsChanged();
      });
    }

    TAB_CHANGE_EVENTS.forEach(addEventListener);
  }

  focusTab(index = this.focusedTabIndex) {
    const { browserViews, mainWindow } = this;
    const browserView = browserViews[index];
    if (browserView) {
      mainWindow.setTopBrowserView(browserView);
      this.focusedTabIndex = index;
    }
  }

  rearrangeTabs(oldIndex: number, newIndex: number) {
    const { browserViews, focusedTabIndex } = this;

    const view1 = browserViews[oldIndex];
    const view2 = browserViews[newIndex];

    if (view1 && view2) {
      browserViews[newIndex] = view1;
      browserViews[oldIndex] = view2;
    }

    if (oldIndex === focusedTabIndex) {
      this.focusedTabIndex = newIndex;
    }

    if (newIndex === focusedTabIndex) {
      this.focusedTabIndex = oldIndex;
    }

    console.log(oldIndex, newIndex, this.focusedTabIndex)
  }

  hide() {
    const { browserViews, mainWindow } = this;

    for (const view of browserViews) {
      view.webContents.executeJavaScript(`
        (() => {
          const { documentElement } = document;
          const { scrollTop, scrollLeft } = documentElement;

          window.___browserViewPreservedScroll = { scrollTop, scrollLeft };
          documentElement.style.display = 'none';
        })();
      `);
    }
  }

  show() {
    const { browserViews, mainWindow } = this;

    for (const view of browserViews) {
      view.webContents.executeJavaScript(`
        (() => {
          const { documentElement } = document;
          document.documentElement.style.display = 'block'

          Object.assign(documentElement, window.___browserViewPreservedScroll)
        })();
      `);
    }

    this.focusTab();
    this.tabsChanged();
  }

  closeTab(index = this.focusedTabIndex) {
    const { browserViews, mainWindow, focusedTabIndex } = this;
    const browserView = this.browserViews[index];

    if (browserView) {
      browserViews.splice(index, 1);

      if (index === focusedTabIndex || focusedTabIndex > index) {
        if (browserViews.length > 0) {
          this.focusTab(Math.max(0, focusedTabIndex - 1));
        }
      }

      mainWindow.removeBrowserView(browserView);
      // https://github.com/electron/electron/issues/10096#issuecomment-1046040408
      // works despite being undocumented
      (browserView.webContents as any).destroy();
    }
  }

  goBack(index = this.focusedTabIndex) {
    const { browserViews } = this;

    const browserView = browserViews[index];
    if (browserViews) {
      browserView.webContents.goBack();
    }
  }

  goForward(index = this.focusedTabIndex) {
    const { browserViews } = this;

    const browserView = browserViews[index];
    if (browserViews) {
      browserView.webContents.goForward();
    }
  }

  reload(index = this.focusedTabIndex) {
    const { browserViews } = this;

    const browserView = browserViews[index];
    if (browserViews) {
      browserView.webContents.reload();
    }
  }

  get tabsInfo(): TabInfo[] {
    const { browserViews, focusedTabIndex } = this;
    return browserViews.map(({ webContents }, index) => {
      const url = webContents.getURL();
      const title = webContents.getTitle();

      const canGoBack = webContents.canGoBack();
      const canGoForward = webContents.canGoForward();

      return {
        index,
        url,
        title: title || url,
        focused: index === focusedTabIndex,
        canGoBack,
        canGoForward,
      };
    });
  }
}
