type CopierType = [string, string];
type CopierQueueType = CopierType[];
export default class FileCopierSync {
    private _queue;
    constructor();
    queue(src: string, dest: string): this;
    clearQueue(): this;
    get getQueue(): CopierQueueType;
    exec(): boolean;
    isDirectory(path: string): boolean;
    copySingleFile(src: string, dest: string): void;
    copyFolder(src: string, dest: string): void;
    copyAny(src: string, dest: string): void;
    copyFiles(copies: CopierQueueType): void;
}
export {};
