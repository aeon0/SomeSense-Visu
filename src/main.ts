import { app, BrowserWindow } from "electron";
import * as path from "path";
import { initialize, enable } from '@electron/remote/main'
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer';


function createMainWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "./index.html"));

  // Open the Console
  mainWindow.webContents.on('did-frame-finish-load', () => {
    mainWindow.webContents.openDevTools();
  });

  // Stuff needed for pop up windows with @electron/remote
  initialize();
  enable(mainWindow.webContents);
  mainWindow.on("closed", () => {
    app.quit();
  });
}

// These dont work...
app.whenReady().then(() => {
  installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createMainWindow();
  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
