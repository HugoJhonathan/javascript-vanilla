//
// just run this file
//
const excludeFolders = ['.git', 'images',]
const deployBase = "https://hugojhonathan.github.io/projetos-de-treino/"

let config = [
    {
        msg: 'asasd asdasd asdasdasdasd __aasdasd__',
        source: 'https://github.com/HugoJhonathan/ti-academy-ciclo-02/tree/master/desafio1-kitanda',
        languages: ['html', 'css', 'react']
    },
    {
        msg: 'Simulação do comportamento de um carrinho de compras, com manipulação do DOM baseado em Object Class.',
        languages: ['html', 'css', 'js']
    },
]

function generateBase(folder, data, index) {
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

    return `
<table>
<tr>
<tH style='padding:none' padding=none width=350 align=right  valign="center">
<img src=./${folder + '/preview.png'} width='400px'  height="auto"></tH>
<tH width=700 valign="center" align=left>
  
<p align="center">
<a href="./${folder}">
${folder}
</a>
<div align="center">
  
</div>
  
<div align="center">
   
<sub> __[🖥️ DEMO](${deployBase + folder})__ </sub> <sub> | 📂</sub> <sub> __[SOURCE](./${folder})__ </sub>
     
</div>
      
</tH>
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
        stringBase = stringBase.concat(generateBase(folder, config[index]))
    })

    fs.writeFile("./README.md", stringBase, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
    console.log("README.md gerado!")
}
WriteToFile()

