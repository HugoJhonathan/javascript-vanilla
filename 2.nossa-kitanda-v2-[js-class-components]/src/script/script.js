import { Item } from './Item.js'
import { Carrinho } from './Cart.js'

let arrayFrutas = []

const selectOrdem = document.querySelector("#ordem")
const btnUltrawideMode = document.querySelector('.ultrawideModeInput')

btnUltrawideMode.onchange = () => changeUltawide()
selectOrdem.onchange = e => ordenarFrutas(e.target.value)

let carrinho = new Carrinho()

if (localStorage.getItem('config')) {
    if (JSON.parse(localStorage.getItem('config')).ultrawide === true) {
        btnUltrawideMode.checked = true
        changeUltawide()
    }
}

function changeUltawide() {
    if (btnUltrawideMode.checked) {
        document.querySelector(".conteudo").classList.add('cont-ultrawide')
    } else {
        document.querySelector(".conteudo").classList.remove('cont-ultrawide')
    }
    localStorage.setItem('config', JSON.stringify({ ultrawide: btnUltrawideMode.checked }))
}

export const ordenarFrutas = x => {
    arrayFrutas.sort((a, b) => {
        if (!x || x == 'nomeCrescente') return a.fruta < b.fruta ? -1 : (a.fruta > b.fruta) ? 1 : 0
        if (x == 'nomeDecrescente') return a.fruta > b.fruta ? -1 : (a.fruta < b.fruta) ? 1 : 0
        if (x == 'precoCrescente') return a.preco < b.preco ? -1 : (a.preco > b.preco) ? 1 : 0
        if (x == 'precoDecrescente') return a.preco > b.preco ? -1 : (a.preco < b.preco) ? 1 : 0
    })
    listarFrutas()
}

export const listarFrutas = () => {
    let containerFrutas = document.querySelector(".container-frutas")
    containerFrutas.innerHTML = ''
    arrayFrutas.forEach(item => new Item(item, carrinho).render(containerFrutas))
}

async function loadData() {
    return fetch('./database/fruits.json')
        .then(response => response.json())
        .then(data => {
            arrayFrutas = data
        })
        .catch(error => console.warn(error));
}

loadData().then(e => listarFrutas())