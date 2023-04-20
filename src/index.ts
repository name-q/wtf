#!/usr/bin/env node

import inquirer from 'inquirer'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
// import path, { dirname } from 'path'
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const selects = {
    pageOrComponent: [
        {
            type: 'list',
            name: 'pageOrComponent',
            message: '添加页面还是组件?',
            choices: ['页面', '组件'],
        }
    ],
    pageName: [
        {
            type: 'input',
            name: 'pageName',
            message: '请输入页面名称:'
        }
    ],
    componentName: [
        {
            type: 'input',
            name: 'componentName',
            message: '请输入组件名称:'
        }
    ],
    storagePath: [
        {
            type: 'list',
            name: 'storagePath',
            message: '放在哪个目录下?',
            choices: ['pages', 'pages/package-A', 'pages/package-B', 'pages/package-C', 'pages/package-D'],
        }
    ],
}



const main = async () => {
    // 页面 或 组件
    const { pageOrComponent } = await inquirer.prompt(selects.pageOrComponent);
    // 存放目录 - 相对目录
    let { storagePath } = await inquirer.prompt(selects.storagePath);
    if (pageOrComponent === '页面') {
        // 询问页面名称
        let { pageName } = await inquirer.prompt(selects.pageName)
        let [camelCase, bigCamelCase] = util.getCamelCase(pageName)
        // 目标路径
        let target = `${process.env.PWD}/src/${storagePath}/${camelCase}`
        util.exist(target)
        // CP
        util.cp(`${process.env.PWD}/config/wtfdata/index`, target, (val) => console.log(` \n \n \n 😭::: ${val} 😭 \n \n \n `))

        let fileTarget = [
            `${target}/index.tsx`,
            `${target}/index.less`,
            `${target}/index.config.ts`,
            `${target}/constant.ts`,
            `${target}/actions/index.ts`,
            `${target}/actions/action.ts`,
            `${target}/selectors.ts`,
        ]

        let suffix = {
            'pages': 'P',
            'pages/package-A': 'A',
            'pages/package-B': 'B',
            'pages/package-C': 'C',
            'pages/package-D': 'D'
        }
        // 更改
        setTimeout(() => {
            // 更改内容
            util.batchRewriteFiles(fileTarget, 'PAGENAME', bigCamelCase + suffix[storagePath])
            // 写入路由
            let buoy = `// ###buoy ${storagePath}###`
            let router = `${storagePath === 'pages' ? "'pages/" + camelCase + "/index'," : "'" + camelCase + "/index',"}\n        ${buoy}`
            util.batchRewriteFiles([`${process.env.PWD}/src/app.config.ts`], buoy, router)
            console.log('🍺🍺🍺🎉🎉🎉')
        }, 500);
    }
    if (pageOrComponent === '组件') {
        // 询问页面名称
        let { pageName } = await inquirer.prompt(selects.pageName)
        // 询问组件名称
        let { componentName } = await inquirer.prompt(selects.componentName)
        let [camelCase, bigCamelCase] = util.getCamelCase(componentName)
        // 目标路径
        let targetTSX = `${process.env.PWD}/src/${storagePath}/${pageName}/components/${bigCamelCase}.tsx`
        let targetLESS = `${process.env.PWD}/src/${storagePath}/${pageName}/components/${bigCamelCase}.less`
        util.exist(targetTSX)
        util.exist(targetLESS)
        // CP
        fs.copyFileSync(`${process.env.PWD}/config/wtfdata/index/components/Test.tsx`, targetTSX)
        fs.copyFileSync(`${process.env.PWD}/config/wtfdata/index/components/Test.less`, targetLESS)

        let fileTarget = [
            targetTSX,
            targetLESS
        ]
        // 更改
        setTimeout(() => {
            // 更改内容
            util.batchRewriteFiles(fileTarget, 'Test', bigCamelCase)
            console.log('📦📦📦🎉🎉🎉')
        }, 500);
    }
}

const util = {
    // 或取驼峰
    getCamelCase: (val) => {
        // 小驼峰
        let camelCase = _.camelCase(val)
        if (!camelCase) throw ' \n \n \n 😭::: 名称错误 😭 \n \n \n '
        // 大驼峰
        const bigCamelCase =
            camelCase.charAt(0).toUpperCase()
            + camelCase.slice(1)
        return [camelCase, bigCamelCase]
    },

    // 目录已存在
    exist: (val) => { if (fs.existsSync(val)) throw ' \n \n \n 😭::: 目标已存在！不允许编辑 😭 \n \n \n ' },
    cp: (src, dest, rej) => {
        const copy = (copySrc, copyDest) => {
            fs.readdir(copySrc, (err, list) => {
                if (err) return rej(err);
                list.forEach((item) => {
                    const ss = path.resolve(copySrc, item);
                    fs.stat(ss, (err, stat) => {
                        if (err) return rej(err);
                        const curSrc = path.resolve(copySrc, item);
                        const curDest = path.resolve(copyDest, item);

                        if (stat.isFile()) {
                            // 文件，直接复制
                            fs.createReadStream(curSrc).pipe(fs.createWriteStream(curDest));
                            console.log('📃  ', curDest)
                        } else if (stat.isDirectory()) {
                            // 目录，进行递归
                            fs.mkdirSync(curDest, { recursive: true });
                            console.log('📁  ', curDest)
                            copy(curSrc, curDest);
                        }
                    });
                });
            });
        };

        fs.access(dest, (err) => {
            if (err) {
                // 若目标目录不存在，则创建
                fs.mkdirSync(dest, { recursive: true });
            }
            copy(src, dest);
        });
    },
    // 批量改写文件
    batchRewriteFiles: async (filesPath, target, value) => {

        const changeFiles = (fliePath) => new Promise((res, rej) => {
            fs.readFile(fliePath, 'utf8', function (err, data) {
                if (err) rej(err)
                // 修改文件内容
                data = String(data).replace(new RegExp(target, 'g'), value);
                fs.writeFile(fliePath, data, function (err) {
                    if (err) rej(err)
                    res('SUCCESS!')
                });
            });
        })

        for (const fliePath of filesPath) {
            try {
                await changeFiles(fliePath)
            } catch (error) {
                console.log(` \n \n \n ${fliePath}修改失败请注意排查😭 \n \n \n `)
            }
        }
    }

}

main()