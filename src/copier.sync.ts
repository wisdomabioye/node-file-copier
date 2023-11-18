import * as fs from 'fs';
import * as path from 'path';

type CopierType = [string, string];
type CopierQueueType = CopierType[];

export default class FileCopierSync {
    private _queue: CopierQueueType;

    constructor() {
        this._queue = [];
        return this;
    }

    public queue(src: string, dest: string): this {
        this._queue.push([src, dest])
        return this;
    }

    public clearQueue(): this {
        this._queue = [];
        return this;
    }

    public get getQueue(): CopierQueueType {
        return this._queue;
    }

    public exec() {
        if (this._queue.length) {
            this._queue.forEach((q) => (
                this.copyAny(q[0], q[1])
            ))

            this.clearQueue();
        }
        
        return true;
    }

    public isDirectory(path: string) {
        return fs.lstatSync(path).isDirectory();
    }

    public copySingleFile(src: string, dest: string) {
        if (!fs.existsSync(src)) throw new Error('File does not exist');
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, {recursive: true}); // create the folder
        }
        const content = fs.readFileSync(src, 'utf8');
        fs.writeFileSync(path.join(dest, path.basename(src)), content, {encoding: 'utf8', flag: 'w'});
    }

    public copyFolder(src: string, dest: string) {
        if (!fs.existsSync(src)) throw new Error('Folder not found');
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, {recursive: true}); // create the folder
        }

        const {files, folders} = fs.readdirSync(src).reduce((prev, curr) => {
            if (this.isDirectory(path.join(src, curr))) {
                prev.folders.push(curr)
            } else {
                prev.files.push(curr)
            };
            return prev;
        }, {files: [], folders: []} as {files: string[], folders: string[]})

        // copy all the files
        files.forEach(file => this.copySingleFile(path.join(src, file), dest));
        // handle folders here
        if (folders.length) {
            folders.forEach(folder => this.copyFolder(
                path.join(src, folder), 
                path.join(dest, folder)
            ));
        }
    }

    /* 
    * @param src: Source file or folder
    * @param dest: Destination folder
    */
    public copyAny(src: string, dest: string) {
        if (this.isDirectory(src)) {
            this.copyFolder(src, dest);
        } else {
            this.copySingleFile(src, dest);
        }
    }

    public copyFiles(copies: CopierQueueType) {
        copies.forEach(([src, dest]) => {
            this.copyAny(src, dest);
        })
    }
}