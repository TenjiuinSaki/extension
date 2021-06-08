// import fs from 'fs'
// import path from 'path'
const fs = window.require('fs')
const path = window.require('path')

class FileSystem {
    // 列出文件夹内容
    list_dir(dir_path: string): File[] {
        return fs.readdirSync(dir_path)
        .filter((el: string) => !el.startsWith('.'))
        .map((el: string) => {
            const abs_path = path.join(dir_path, el)
            const name = path.parse(el).name
            const stat = fs.statSync(abs_path)
            const isDir = stat.isDirectory()
            let ext = undefined
            if (stat.isFile()) {
                ext = el.split('.').pop()
            }
            return { abs_path, name, ext, isDir }
        })
    }
    // 创建文件夹, 创建目录, 文件夹名字
    make_dir(current_path: string, name: string) {
        const dir_path = path.join(current_path, name)
        if (!this.exist_dir(dir_path)) {
            fs.mkdirSync(dir_path)
        } 
    }

    // 删除文件夹
    remove_dir(path: string) {
        if (this.exist_dir(path)) {
            fs.rmdirSync(path)
        }
    }

    // 判断文件夹是否存在
    exist_dir(path: string): boolean {
        try {
            const stat = fs.statSync(path)
            return stat.isDirectory()
        } catch {}
        return false
    }

    // 判断是否为空文件夹
    is_empty_dir(path: string): boolean {
        if (this.exist_dir(path)) {
            return fs.readdirSync(path).length == 0
        } else {
            // 文件夹不存在，则创建空文件夹
            fs.mkdirSync(path)
            return true
        }
    }

    remove_all_empty_dir(path: string) {
        this.list_dir(path)
        .filter(el => el.isDir)
        .map(el => el.abs_path)
        .forEach(el => {
            if (this.is_empty_dir(el)) {
                this.remove_dir(el)
            }
        })
    }

    // 读取文件内容
    read_file(path: string): string {
        return fs.readFileSync(path, {encoding: 'utf-8'})
    }

    // 创建文件，保存目录，文件名，文件内容
    make_file(dir_path: string, name: string, content: string) {
        fs.writeFileSync(path.join(dir_path, name), content)
    }

    // 删除文件
    remove_file(path: string) {
        if (this.exist_file(path)) {
            fs.unlinkSync(path)
        }
    }

    // 判读文件是否存在
    exist_file(path: string): boolean {
        try {
            const stat = fs.statSync(path)
            return stat.isFile()
        } catch {}
        return false
    }
}

interface File {
    abs_path: string
    name: string
    ext: string | undefined
    isDir: boolean
}

export default new FileSystem()