import type { Project } from "../domain/project";
import { EditorEvents } from "./events";

export class EditorProjectManager {
    private _project: Project | null = null;

    public static setup() {
        EditorEvents.on('new', () => {
            EditorProjectManager.new();
        })

        EditorEvents.on('load', () => {
            EditorProjectManager.load();
        })

        EditorEvents.on('save', () => {
            EditorProjectManager.save();
        })
    }

    public static async new() {

    }

    public static async load() {
        // const directory = await window.showDirectoryPicker();
    }

    public static async save() {

    }

    public static async getRecent() {

    }
}
