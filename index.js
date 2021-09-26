const { app, BrowserWindow } = require("electron");
const url = require("url");

function newApp() {
  win = new BrowserWindow({icon:'./icon.ico',
                           webPreferences: {
                              nodeIntegration: true,
                              contextIsolation: false,
                          }, 
                          autoHideMenuBar  : true,
                        });
  win.loadFile('./index.html');
}

app.whenReady().then(() => {
  newApp()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})