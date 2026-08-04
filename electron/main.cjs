const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");

let store;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    autoHideMenuBar: true,
    title: "دار الرحمن",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  const indexPath = path.join(app.getAppPath(), "out", "index.html");
  win.loadFile(indexPath);
  win.maximize();
}

app.whenReady().then(async () => {
  const StoreModule = await import("electron-store");
  const Store = StoreModule.default;
  store = new Store();

  ipcMain.handle("app:getVersion", () => {
    return app.getVersion();
  });

  ipcMain.handle("app:checkForUpdates", async () => {
    try {
      const result = await autoUpdater.checkForUpdates();
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  autoUpdater.autoDownload = false;

  ipcMain.handle("app:downloadUpdate", () => {
    autoUpdater.downloadUpdate();
  });

  ipcMain.handle("app:installUpdate", () => {
    autoUpdater.quitAndInstall(false, true);
  });

  autoUpdater.on("error", (error) => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) win.webContents.send("updater:error", error.message || error.toString());
  });

  autoUpdater.on("download-progress", (progressObj) => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) win.webContents.send("updater:progress", progressObj);
  });

  autoUpdater.on("update-downloaded", () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) win.webContents.send("updater:downloaded");
  });

  createWindow();

  autoUpdater.checkForUpdatesAndNotify().catch(console.error);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
