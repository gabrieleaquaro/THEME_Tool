const {
  BrowserWindow,
  app,
  ipcMain
} = require("electron");
const { fstat } = require("fs");
const path = require("path");
const fs = require("fs");
const { config } = require("process");
const base_dir = './'


function newApp() {
  win = new BrowserWindow(
    {icon:base_dir + 'icon.ico',
      webPreferences: {
      nodeIntegration : true,
      contextIsolation : false,
      devTools: true  
    }, 
    autoHideMenuBar  : true
  });
  win.loadFile('./index.html');
  return 
}

app.whenReady().then(() => {
  
  const schedule = require('node-schedule');

  function pinger(){
    var config = JSON.parse(fs.readFileSync(base_dir + 'config'));
    config["ping"] = Date.now()
    fs.writeFileSync(base_dir + 'config', JSON.stringify(config, null, 4));
  }

  if (!fs.existsSync(base_dir + 'config')){
    fs.writeFileSync(base_dir + 'config', JSON.stringify({ "lastModifiedReport": "default", "openedWindows" : 0, "currentReports" : {0 : 'default'}}, null, 4));
  }

  var config = JSON.parse(fs.readFileSync(base_dir + 'config'));
  if(Date.now() - config["ping"] > 30000) {
    config["openedWindows"] = 0;
    config["currentReports"] = {0 : config['lastModifiedReport']}; 
    fs.writeFileSync(base_dir + 'config', JSON.stringify(config, null, 4));
  }
  
  const ping = schedule.scheduleJob('*/5 * * * * *', function(){
    pinger();
  });
  
  newApp();
})



app.on('window-all-closed', function () {
  var config = JSON.parse(fs.readFileSync(base_dir + 'config'));
  config["openedWindows"] -= 1;
  config["openedWindows"] = config["openedWindows"] < 0 ? 0 : config["openedWindows"];
  if(config["openedWindows"] == 0){
    config["currentReports"] = {0 : config['lastModifiedReport']}; 
  }
  fs.writeFileSync(base_dir + 'config', JSON.stringify(config, null, 4));
  if (process.platform !== 'darwin') app.quit()
})

