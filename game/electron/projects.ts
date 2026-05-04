import path from 'node:path';
import { app, dialog } from 'electron';
import fs from 'node:fs/promises';

const EDITOR_VERSION: number = 1;

export interface IRecentProject {
    name: string;
    path: string;
    lastOpened: string;
}

class RecentManager {
    // Gets the file path to the recent.json file, storing recents.
    public filePath(): string {
        return path.join(app.getPath('userData'), 'recent.json');
    }

    public async init() {
        // If the recents doesn't already exist, just write an empty one
        try {
            await fs.access(this.filePath());
        } catch (e) {
            await this.save([]);
        }
    }

    // Gets all the recently opened worlds.
    public async getAll(): Promise<IRecentProject[] | null> {
        try {
            let content = await fs.readFile(this.filePath(), 'utf8');
            return JSON.parse(content);
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    // Adds a recent entry
    public async add(recent: IRecentProject): Promise<boolean> {
        try {
            let recents = await this.getAll();
            if (recents == null) {
                throw new Error("Could not load recents.");
            }
            recents.push(recent);
            await this.save(recents);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    // Removes a recent entry
    public async remove(recentPath: string): Promise<boolean> {
        try {
            let recents = await this.getAll();
            if (recents == null) {
                throw new Error("Could not load recents.");
            }
            recents = recents.filter(r => r.path !== recentPath);
            await this.save(recents);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    // Saves the given recents to the file, overriding.
    // This function throws if it fails.
    private async save(recents: IRecentProject[]): Promise<void> {
        let content = JSON.stringify(recents);
        await fs.writeFile(this.filePath(), content);
    }
}

export interface ProjectConfig {
    // What is the name of our world?
    name: string;

    // Where is it loaded on disk?
    path: string;

    // Which editor did we last build this with?
    // Very important if we add features to the game, 
    // we can load older versions later :)
    editorVersion: number;
}

export interface Project {
    config: ProjectConfig;
}

export class ProjectManager {
    public static recents: RecentManager = new RecentManager();

    public static async init() {
        await ProjectManager.recents.init();
    }

    public static async create(projectName: string) {
        const result = await dialog.showOpenDialog({
            title: "Choose Project Location",
            properties: ["openDirectory", "createDirectory"]
        });

        if (result.canceled || !result.filePaths[0]) return { error: "Failed to make new project." };

        const projectPath = path.join(result.filePaths[0], projectName);

        let project: Project = {
            config: {
                name: projectName,
                path: projectPath,
                editorVersion: EDITOR_VERSION
            }
        }

        // Make default folder paths.
        await fs.mkdir(projectPath);
        await fs.mkdir(path.join(projectPath, "terrains"));
        await fs.mkdir(path.join(projectPath, "data"));
        await fs.mkdir(path.join(projectPath, "assets"));

        // Every project must have a config which tells us about it.
        await fs.writeFile(
            path.join(projectPath, "project.json"),
            JSON.stringify(project)
        );

        await ProjectManager.recents.add({
            name: project.config.name,
            path: project.config.path,
            lastOpened: new Date().toISOString()
        });

        return project;
    }

    public static load() {

    }

    public static save() {

    }
}
