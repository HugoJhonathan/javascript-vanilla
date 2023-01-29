const onlyThisFolder = false
const deployBase = "https://hugojhonathan.github.io/javascript-vanilla/"


const excludeFolders = ['.git', 'images', '.github']
const { readFile } = require('fs/promises')
const fs = require("fs")
let submodulesFolders

const loadSubmodules = async () => await readFile('.gitmodules', 'utf-8')

loadSubmodules().then(data => {
    submodulesFolders = data
}).catch(err => {

}).finally(() => {
    WriteToFile()
})

const getLinkOfSubmodule = (folderName) => {
    if (!submodulesFolders) return null
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

function generateBase(folder = '') {

    let deployUrl = deployBase + folder
    let nameOfProject = folder ? folder.replace("/", "") : deployBase.split("/")[3]
    let source = getLinkOfSubmodule(folder) || './' + folder
    if (onlyThisFolder) {
        source = "#"
    }

    return `
<table>
<tr>
    <th width=350>
        <a href="${deployUrl}">
            <img src=${deployUrl + 'preview.png'} width=100%  height=auto>
        </a>
    </th>

<th width=700 valign=center align=left>
  
<div align="center">
<a href="${source}">${nameOfProject}</a>

<sub> __[🖥️ DEMO](${deployUrl})__ | __[📂 SOURCE](${source})__ </sub>     
</div>
  
</th>

</tr>
</table>
`
}



const getDirectories = source => {
    return fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
}

function WriteToFile() {

    let stringBase = '<h3 align="center">\n\n__Live Demo__\n\n<br></h3>'

    const dirs = getDirectories("./").filter(dir => !excludeFolders.includes(dir))

    if (!onlyThisFolder) {
        dirs.forEach((folder, index) => {
            stringBase = stringBase.concat(generateBase(folder + "/"))
        })
    } else {
        stringBase = stringBase.concat(generateBase())
    }


    fs.writeFile("./README.md", stringBase, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
    console.log("README.md gerado!")
}