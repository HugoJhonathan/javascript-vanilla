//
// just run this file
//
const excludeFolders = ['.git', 'images', '.github']
const deployBase = "https://hugojhonathan.github.io/javascript-vanilla/"
const { readFile } = require('fs/promises');

let submodulesFolders

const loadSubmodules = async () => await readFile('.gitmodules', 'utf-8')

loadSubmodules().then(data => {
    submodulesFolders = data
    WriteToFile()
})

const getLinkOfSubmodule = (folderName) => {
    let link
    var array = submodulesFolders.toString().split("\n");
    let i = 0
    while (i < array.length) {
        if (array[i].includes(folderName)) {
            link = /[(https)].*[(.git)]/g.exec(array[i + 2])[0]
            i += 2
        } else {
            i++
        }
    }
    return link
}

function generateBase(folder) {

    // let [msg, languages, source] = ''

    // if (data.msg) {
    //     msg = '<div align="center">\n\n*' + data.msg + '*\n\n</div>'
    // }
    // source = "https://hugojhonathan.github.io/projetos-de-treino/" + folder
    // if (data.source) {
    //     source = data.source
    // }
    // if (data.languages) {
    //     let langs = data.languages.map(el => `__${el.toUpperCase()}__`).toString().replaceAll(',', ' | ')
    //     languages = '<div align=center>\n<sub>\n\n' + langs + '</sub>\n</div>'
    // }

    let source = getLinkOfSubmodule(folder) || './' + folder

    return `
<table>
<tr>
    <th width=350>
        <a href="${deployBase + folder}">
            <img src=${deployBase + folder + '/preview.png'} width=100%  height=auto>
        </a>
    </th>

<th width=700 valign=center align=left>
  
<div align="center">
<a href="./${folder}">${folder}</a>

<sub> __[🖥️ DEMO](${deployBase + folder})__ | __[📂 SOURCE](${source})__ </sub>     
</div>
  
</th>

</tr>
</table>
`
}

const fs = require("fs")

const getDirectories = source => {
    return fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
}

function WriteToFile() {

    let stringBase = '<h3 align="center">\n\n__Live Demo__\n\n<br></h3>'

    const dirs = getDirectories("./").filter(dir => !excludeFolders.includes(dir))

    dirs.forEach((folder, index) => {
        stringBase = stringBase.concat(generateBase(folder))
    })

    fs.writeFile("./README.md", stringBase, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
    console.log("README.md gerado!")
}