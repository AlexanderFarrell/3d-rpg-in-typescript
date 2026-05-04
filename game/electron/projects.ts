import path from 'node:path';
import {app, dialog, ipcMain} from 'electron';
import fs from 'node:fs/promises';

export interface IRecentProject {
    name: String;
    path: String;
    lastOpened: String;
}

export class ProjectFSManager {
    public static recentFilePath(): string {
        return path.join(app.getPath('userData'), 'recent.json');
    }

    public static async getRecents(): Promise<IRecentProject[] | null> {
        try {
            let content = await fs.readFile(ProjectFSManager.recentFilePath(), 'utf8')
            return JSON.parse(content);
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    public static async 
}