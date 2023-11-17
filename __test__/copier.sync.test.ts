import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { FileCopierSync } from '../src'
import path from 'path'
import fs from 'fs'

function setUpTestFiles() {
    const structure = {
        test1: 'test1.txt',
        test2: 'test2.txt',
        test3: 'test3.txt',
        testFolder1: {
            test1: 'test1.txt',
            test2: 'test2.txt',
            testFolder2: {
                test1: 'test1.txt',
                test2: 'test2.txt',
            },
            testFolder3: {
                test1: 'test1.txt',
                test2: 'test2.txt',
            }
        },
        testFolder2: {
            test1: 'test1.txt',
            test2: 'test2.txt',
        }
    }

    createStructure(path.join(__dirname, 'testFiles'), structure)

    function createFile(data: [string, string]) {
        const testContent = new Uint8Array(Buffer.from('Hello Node.js File Copier!'))
        
        if (!fs.existsSync(data[0])) {
            fs.mkdirSync(data[0], {recursive: true}) // create the folder/path
        }

        fs.writeFileSync(path.join(data[0], data[1]), testContent, {encoding: 'utf8', flag: 'w'})
    }

    function createStructure(base: string, structure: Record<string, unknown>) {
        const destructured = Object.entries(structure)
        destructured.forEach((data) => {
            if (typeof data[1] === 'object') {
                // Create a folder in the base folder
                createStructure(path.join(base, data[0]), data[1] as Record<string, unknown>)
            } else {
                // Create a file in the base folder
                createFile([base, data[1] as string])
            }
        })
    }
}

beforeAll(() => {
    setUpTestFiles()
})

afterAll(() => {
    fs.rmdirSync(path.join(__dirname, 'testFiles'), {recursive: true})
    fs.rmdirSync(path.join(__dirname, 'testFilesCopy'), {recursive: true})
})

describe('FileCopierSync', () => {
    const testFolder = path.join(__dirname, 'testFiles')
    const testFolderCopy = path.join(__dirname, 'testFilesCopy')
    const baseTestPath = (file: string) => path.join(testFolder, file)
    const baseCopyPath = (file: string) => path.join(testFolderCopy, file)

    const Copier = new FileCopierSync()

    it('should be able to queue a file', () => {
        Copier.queue(baseTestPath('test1.txt'), baseCopyPath(''))
        expect(Copier['_queue'].length).toBe(1)
    })

    it('should be able to copy a file and clear the queue', () => {
        Copier.exec()
        expect(Copier['_queue'].length).toBe(0)
    })

    it('should actually copy the file', () => {
        expect(fs.existsSync(baseCopyPath('test1.txt'))).toBe(true)
    })
    
    it('should be able to queue a folder', () => {
        Copier.queue(baseTestPath('testFolder1'), baseCopyPath('testFolder1'))
        expect(Copier['_queue'].length).toBe(1)
    })

    it('should be able to copy a folder and clear the queue', () => {
        Copier.exec()
        expect(Copier['_queue'].length).toBe(0)
    })

    it('should actually copy the folder', () => {
        expect(fs.existsSync(baseCopyPath('testFolder1'))).toBe(true)
        expect(fs.lstatSync(baseCopyPath('testFolder1')).isDirectory()).toBe(true)
    })
})