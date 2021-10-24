const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");
const { fstat } = require("fs");
const path = require("path");

function newApp() {
  win = new BrowserWindow({icon:'./icon.ico',
                           webPreferences: {
                            nodeIntegration : true,
                            contextIsolation : false
                          }, 
                          autoHideMenuBar  : true
                        });
  win.loadFile('./index.html');
  return win.name
}
app.whenReady().then(() => {
  newApp()
})

app.on('window-all-closed', function () {
  const fs = require("fs");
  var config = JSON.parse(fs.readFileSync('./config'));
  config["openedWindows"] -= 1;
  if(config["openedWindows"] == 0){
    config["currentReports"] = {0 : config['lastModifiedReport']}; 
  }
  fs.writeFileSync('./config', JSON.stringify(config, null, 4));
  if (process.platform !== 'darwin') app.quit()
})