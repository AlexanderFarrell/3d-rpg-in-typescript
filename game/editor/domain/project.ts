

export class Project {
    public directory: FileSystemDirectoryHandle;

    public constructor(directory: FileSystemDirectoryHandle) {
        this.directory = directory;
    }
}