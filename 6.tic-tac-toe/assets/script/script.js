import { JogoDaVelha } from "./JogoDaVelha.js"

const scoreboard = document.querySelector(".scoreboard")
const buttonOfRestart = document.querySelector("button#restart")
const inputSize = document.querySelector("#size")
const buttonIncrement = document.querySelector("button#button-increment")
const buttonDecrement = document.querySelector("button#button-decrement")

const game = new JogoDaVelha(3, buttonOfRestart, scoreboard)

window.onresize = () => adjustmentLayout()
buttonOfRestart.onclick = () => game.restart()
buttonIncrement.onclick = () => incrementSize()
buttonDecrement.onclick = () => decrementSize()

export function adjustmentLayout() {
    let divSize = document.querySelector("#sizeControl").offsetHeight
    let divButton = document.querySelector("#restart").offsetHeight
    let divScoreBoard = document.querySelector(".scoreboard").offsetHeight
    let divCurrentPlayer = document.querySelector("#currentPlayer").offsetHeight
    let board = document.querySelector(".board")
    let sizeOfAnotherItens = (divSize + divButton + divScoreBoard + divCurrentPlayer)
    let sizeOfGame = window.innerHeight - sizeOfAnotherItens;
    if (window.innerWidth < sizeOfGame) {
        board.classList.add("board2")
    } else {
        board.classList.remove("board2")
    }
    document.querySelectorAll(".board button").forEach(button => {
        button.style.fontSize = button.parentElement.offsetHeight * 0.6 + "px"
    })
}

inputSize.addEventListener('change', e => {
    let val = Number(inputSize.value) + 0
    if (val < 2) val = 2
    if (val > 10) val = 10
    changeSize(val)
})

const changeSize = (val) => {
    if (game.setSize(val)) {
        inputSize.value = val
    }
}

const incrementSize = () => {
    let val = Number(inputSize.value) + 1
    if (val > 10) return false
    changeSize(val)
}

const decrementSize = () => {
    let val = Number(inputSize.value) - 1
    if (val < 2) return false
    changeSize(val)
}