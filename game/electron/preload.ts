import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
	isElectron: true,
	platform: process.platform,
	quit: () => ipcRenderer.send('quit')
});

