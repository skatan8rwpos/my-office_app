'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'


//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"
log.info('App starting...', app.getVersion())

//-------------------------------------------------------------------
// Standard scheme must be registered before the app is ready
//-------------------------------------------------------------------
protocol.registerStandardSchemes(['myOffice'], { secure: true })

//-------------------------------------------------------------------
// Open a window that displays the version
//
// THIS SECTION IS NOT REQUIRED
//
// This isn't required for auto-updates to work, but it's easier
// for the app to show a window than to have to click "About" to see
// that updates are working.
//-------------------------------------------------------------------

let win

function sendStatusToWindow(eventType, message) {
  log.info(eventType);
  win.webContents.send('updaterMsg', eventType);
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  if (isDevelopment) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('myOffice')
    // Load the index.html when not in development
    win.loadFile('index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

const { appId } = require('../electron-builder.json')
app.setAppUserModelId(appId)
//-------------------------------------------------------------------
// Electron application Event Listeners
//-------------------------------------------------------------------
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) { createWindow() }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) 
    await installVueDevtools() // Install Vue Devtools
  
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  process.on('message', data => {
    if (data === 'graceful-exit') app.quit()
  })
}


//-------------------------------------------------------------------
// Auto updater Event Listeners
//-------------------------------------------------------------------
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('checking-for-update');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('update-available', info);
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('update-not-available', info);
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('update-error' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';

  percent = progressObj.percent / 100
  win.setProgressBar(percent)
  sendStatusToWindow('download-progress', log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  win.setProgressBar(-1)
  sendStatusToWindow('update-downloaded', info);
  
  setTimeout(() => autoUpdater.quitAndInstall(), 5000) 
})


//
// CHOOSE one of the following options for Auto updates
//

//-------------------------------------------------------------------
// Auto updates - Option 1 - Simplest version
//
// This will immediately download an update, then install when the
// app quits.
//-------------------------------------------------------------------
app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();
});

//-------------------------------------------------------------------
// Auto updates - Option 2 - More control
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------
// app.on('ready', function()  {
//   autoUpdater.checkForUpdates();
// });
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (info) => {
// })
// autoUpdater.on('update-not-available', (info) => {
// })
// autoUpdater.on('error', (err) => {
// })
// autoUpdater.on('download-progress', (progressObj) => {
// })
// autoUpdater.on('update-downloaded', (info) => {
//   autoUpdater.quitAndInstall();  
// })