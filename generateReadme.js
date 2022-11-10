//
// just run this file
//
const excludeFolders = ['.git', 'images',]

function generateBase(folder) {
    return `
<p align="center">
<a href="https://hugojhonathan.github.io/projetos-de-treino/${folder}">
${folder}
</a>
<p align="center">
<a href="https://hugojhonathan.github.io/projetos-de-treino/${folder}" target="_blank">     
<img src="./${folder}/preview.png" width="600" align="center">
</a>
</p>
</p>
<br><br>
`
}

const fs = require("fs")

const getDirectories = source => {
    return fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
}

function WriteToFile() {

    let stringBase = `<h3 align=center>

__Live Demo__

</h3>
`

    const dirs = getDirectories("./").filter(dir => !excludeFolders.includes(dir))

    dirs.forEach(folder => {
        stringBase = stringBase.concat(generateBase(folder))
    })

    fs.writeFile("./README.md", stringBase, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })

    console.log(dirs)
    console.log("README.md gerado!")
}
WriteToFile()

