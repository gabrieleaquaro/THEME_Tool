const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");
const { fstat } = require("fs");
const path = require("path");
//const base_dir = './'
const base_dir = './resources/app/'

function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
      return false;
  }

  const ChildProcess = require('child_process');
  
  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
      let spawnedProcess, error;

      try {
          spawnedProcess = ChildProcess.spawn(command, args, {
              detached: true
          });
      } catch (error) {}

      return spawnedProcess;
  };

  const spawnUpdate = function(args) {
      return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':
          // Optionally do things such as:
          // - Add your .exe to the PATH
          // - Write to the registry for things like file associations and
          //   explorer context menus

          // Install desktop and start menu shortcuts
          spawnUpdate(['--createShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-uninstall':
          // Undo anything you did in the --squirrel-install and
          // --squirrel-updated handlers

          // Remove desktop and start menu shortcuts
          spawnUpdate(['--removeShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-obsolete':
          // This is called on the outgoing version of your app before
          // we update to the new version - it's the opposite of
          // --squirrel-updated

          application.quit();
          return true;
  }
};

function newApp() {
  win = new BrowserWindow({icon:base_dir + 'icon.ico',
                           webPreferences: {
                            nodeIntegration : true,
                            contextIsolation : false,
                            devTools: true
                          }, 
                          autoHideMenuBar  : true
                        });
  win.loadFile('./index.html');
  return win.name
}

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
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