import * as remote from '@electron/remote'

export function createRuntimeMeasWindow() {
  const win = new remote.BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadFile('./popups/runtime_meas/index.html');

  // Open the Console
  // win.webContents.on('did-frame-finish-load', () => {
  //   win.webContents.openDevTools();
  // });
}
