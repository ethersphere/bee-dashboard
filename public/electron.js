const { app, BrowserWindow } = require('electron')

app.setName('Bee Dashboard')

function createWindow() {
  // Start hidden, maximize, then show to avoid flickering
  const browserWindow = new BrowserWindow({
    show: false,
  })
  browserWindow.maximize()
  browserWindow.show()

  browserWindow.loadFile('./build/index.html')

  // Fixes blank page when window.location.reload() is called
  browserWindow.webContents.on('did-fail-load', () => {
    browserWindow.loadFile('./build/index.html')
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // Retain OS X behaviour
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  // Retain OS X behaviour
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
