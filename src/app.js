const path = require('path');
const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const {dialog} = electron;

let win;

function createWindow() {
  win = new BrowserWindow({width: 400, height: 422});
  win.loadURL(`file://${path.resolve(__dirname, '../index.html')}`);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});