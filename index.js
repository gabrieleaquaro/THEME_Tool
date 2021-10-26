const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");
const { fstat } = require("fs");
const path = require("path");

function newApp() {
  win = new BrowserWindow({icon:base_dir + 'icon.ico',
                           webPreferences: {
                            nodeIntegration : true,
                            contextIsolation : false
                          }, 
                          autoHideMenuBar  : true
                        });
  win.loadFile(base_dir + 'index.html');
  return win.name
}
app.whenReady().then(() => {
  newApp()
})

app.on('window-all-closed', function () {
  const fs = require("fs");
  var config = JSON.parse(fs.readFileSync(base_dir + 'config'));
  config["openedWindows"] -= 1;
  config["openedWindows"] = config["openedWindows"] < 0 ? 0 : config["openedWindows"];
  if(config["openedWindows"] == 0){
    config["currentReports"] = {0 : config['lastModifiedReport']}; 
  }
  fs.writeFileSync(base_dir + 'config', JSON.stringify(config, null, 4));
  if (process.platform !== 'darwin') app.quit()
})