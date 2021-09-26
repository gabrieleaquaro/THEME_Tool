const { app, BrowserWindow } = require("electron");
const url = require("url");

function newApp() {
  win = new BrowserWindow({icon:'./images/icon.png',
                           webPreferences: {
                              nodeIntegration: true,
                              contextIsolation: false,
                          }
                        });
  win.loadURL(
    url.format({
      pathname: "index.html",
      slashes: true
    })    
  );
}

app.on("ready", newApp);
