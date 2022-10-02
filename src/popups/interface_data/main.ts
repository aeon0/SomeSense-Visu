import * as remote from '@electron/remote'

export function createInterfaceDataWindow(initState: Function) {
  const win = new remote.BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadFile('./popups/interface_data/index.html');

  // Open the DevTools.
  win.webContents.on('did-frame-finish-load', () => {
    win.webContents.openDevTools();
    initState();
  });
}
