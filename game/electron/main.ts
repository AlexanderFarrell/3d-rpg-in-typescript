import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProjectManager } from './projects';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    // win.removeMenu();

    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, "../renderer/index.html"))
    } else {
        win.loadURL('http://localhost:5173')
    }
}

ipcMain.handle('project:create', async (_event, projectName: string) => {
    return ProjectManager.create(projectName);
})
ipcMain.on('quit', () => app.quit());

app.whenReady().then(async () => {
    await ProjectManager.init();
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    app.quit();
})
