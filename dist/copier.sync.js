"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var FileCopierSync = /** @class */ (function () {
    function FileCopierSync() {
        this._queue = [];
        return this;
    }
    FileCopierSync.prototype.queue = function (src, dest) {
        this._queue.push([src, dest]);
        return this;
    };
    FileCopierSync.prototype.clearQueue = function () {
        this._queue = [];
        return this;
    };
    Object.defineProperty(FileCopierSync.prototype, "getQueue", {
        get: function () {
            return this._queue;
        },
        enumerable: false,
        configurable: true
    });
    FileCopierSync.prototype.exec = function () {
        var _this = this;
        if (this._queue.length) {
            this._queue.forEach(function (q) { return (_this.copyAny(q[0], q[1])); });
            this.clearQueue();
        }
        return true;
    };
    FileCopierSync.prototype.isDirectory = function (path) {
        return fs.lstatSync(path).isDirectory();
    };
    FileCopierSync.prototype.copySingleFile = function (src, dest) {
        if (!fs.existsSync(src))
            throw new Error('File does not exist');
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true }); // create the folder
        }
        var content = fs.readFileSync(src, 'utf8');
        fs.writeFileSync(path.join(dest, path.basename(src)), content, { encoding: 'utf8', flag: 'w' });
    };
    FileCopierSync.prototype.copyFolder = function (src, dest) {
        var _this = this;
        if (!fs.existsSync(src))
            throw new Error('Folder not found');
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true }); // create the folder
        }
        var _a = fs.readdirSync(src).reduce(function (prev, curr) {
            if (_this.isDirectory(path.join(src, curr))) {
                prev.folders.push(curr);
            }
            else {
                prev.files.push(curr);
            }
            ;
            return prev;
        }, { files: [], folders: [] }), files = _a.files, folders = _a.folders;
        // copy all the files
        files.forEach(function (file) { return _this.copySingleFile(path.join(src, file), dest); });
        // handle folders here
        if (folders.length) {
            folders.forEach(function (folder) { return _this.copyFolder(path.join(src, folder), path.join(dest, folder)); });
        }
    };
    /*
    * @param src: Source file or folder
    * @param dest: Destination folder
    */
    FileCopierSync.prototype.copyAny = function (src, dest) {
        if (this.isDirectory(src)) {
            this.copyFolder(src, dest);
        }
        else {
            this.copySingleFile(src, dest);
        }
    };
    FileCopierSync.prototype.copyFiles = function (copies) {
        var _this = this;
        copies.forEach(function (_a) {
            var src = _a[0], dest = _a[1];
            _this.copyAny(src, dest);
        });
    };
    return FileCopierSync;
}());
exports.default = FileCopierSync;
