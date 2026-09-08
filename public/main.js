const { app, BrowserWindow } = require('electron');
require('@electron/remote/main').initialize()

function createWindow() {
    const win = new BrowserWindow({
        width: 1500,
        height: 900,
        webPreferences: {
            enableRemoteModule: true
        },
    });

    win.loadURL("http://192.168.10.157:3000");
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
