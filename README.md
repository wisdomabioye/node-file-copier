### Node File Copier

A simple and flexible Node.js utility for synchronously copying files and folders. This utility allows you to queue up copying tasks and execute them in a batch, making it easy to handle multiple file and folder copies in your Node.js applications.
Good for copying small files, async copier will be added soon.

### Installation

```bash
npm install node-file-copier
```

#### Usage

```javascript
import { FileCopierSync } from 'node-file-copier';

// Create a new instance of FileCopierSync
const fileCopier = new FileCopierSync();

// Queue up copy tasks
fileCopier
  .queue(path.join(__dirname, 'file.txt'), 'path/to/destination/')
  .queue('path/to/source/folder/', 'path/to/destination/folder/');

// Execute the copy tasks
fileCopier.exec();
```

##### Features

- Queue up file and folder copy tasks.
- Copy single files, entire folders, or a mix of both.
- Synchronously execute queued copy tasks.


##### Methods

```javascript
// Add a file or folder copy task to the queue.
.queue(src: string, dest: string): this

// Clear all queued copy tasks.
.clearQueue(): this

// Get the current copy task queue.
.getQueue: CopierQueueType

// Execute all the queued copy tasks.
.exec(): boolean

// Check if the given path points to a directory.
.isDirectory(path: string): boolean

// Copy a single file from the source to the destination.
.copySingleFile(src: string, dest: string): void

// Copy an entire folder from the source to the destination, including its subdirectories and files.
.copyFolder(src: string, dest: string): void

// Copy either a file or a folder based on the source path.
.copyAny(src: string, dest: string): void

// Copy multiple files and folders based on an array of source and destination pairs.
.copyFiles(copies: CopierQueueType): void

```

---
### License

This project is licensed under the MIT License. Feel free to use and modify this utility as needed. If you find any issues or have suggestions for improvements, please open an issue on GitHub. Contributions are welcome!