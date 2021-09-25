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
  //report is a JSON dictionary containing all the current data 
  report = JSON.parse("{}")
  report["creation_date"] = new Date().getDate() + "_" + new Date().getMonth();
}

app.on("ready", newApp);
