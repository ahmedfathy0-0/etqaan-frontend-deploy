const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("etqaanApp", {
  getAppVersion: () => ipcRenderer.invoke("app:getVersion"),
  checkForUpdates: () => ipcRenderer.invoke("app:checkForUpdates"),
  downloadUpdate: () => ipcRenderer.invoke("app:downloadUpdate"),
  installUpdate: () => ipcRenderer.invoke("app:installUpdate"),
  onUpdateProgress: (callback) =>
    ipcRenderer.on("updater:progress", (_, progressObj) => callback(progressObj)),
  onUpdateDownloaded: (callback) =>
    ipcRenderer.on("updater:downloaded", () => callback()),
  onUpdateError: (callback) =>
    ipcRenderer.on("updater:error", (_, error) => callback(error)),
});
