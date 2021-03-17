import path from 'path';
import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';


/**
 * This self-executing function should run as soon as possible in terms of
 * electron execution. Squirrel is used as the installer/updater for Windows OSes
 * And so when squirrel is performing an install and is running/placing shortcuts
 * we don't want the rest of the app to fire up. This tool prevents that.
 * 
 * See: https://github.com/mongodb-js/electron-squirrel-startup
 * See: https://github.com/Squirrel/Squirrel.Windows
 */
(function() {
  if (require("electron-squirrel-startup")) {
    app.quit();
  }
})();


function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then( async () => {
  createWindow();

  // Install React developer tools if in dev mode.
  if (isDev) {
    // Can't be 'import'ed because in production build these dev packages wont exist.
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

    try {
      let name = await installExtension(REACT_DEVELOPER_TOOLS);
      console.log(`Added Extension:  ${name}`);
    }
    catch(err) {
      console.log('An error occurred: ', err);
    }
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
