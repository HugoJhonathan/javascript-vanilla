import { adjustmentLayout } from './script.js'

export class JogoDaVelha {
    #player1 = { name: 'X', score: 0 }
    #player2 = { name: 'O', score: 0 }
    #currentPlayer
    #game
    #fields
    #finished
    size
    moviesCount = 0
    startTime
    constructor(size, buttonRestart, scoreboard) {
        this.size = size
        this.buttonRestart = buttonRestart
        this.scoreboard = scoreboard
        this.render()
        this.init()
    }

    render() {
        let board = document.querySelector(".board")
        document.querySelector(':root').style.setProperty('--qtd', this.size)
        board.innerHTML = ''
        for (let i = 0; i < this.size ** 2; i++) {
            const div = document.createElement("div")
            const button = document.createElement("button")
            button.classList.add("field" + i)
            div.appendChild(button)
            board.appendChild(div)
        }
        this.#fields = document.querySelectorAll(".board button")
        let a = 0;
        for (let i = 0; i < this.size; i++) {
            for (let y = 0; y < this.size; y++) {
                this.#fields[a].setAttribute("data-x", i)
                this.#fields[a].setAttribute("data-y", y)
                this.#fields[a].classList.remove("done")
                this.#fields[a].addEventListener('click', (e) => {
                    let x = e.target.getAttribute("data-x")
                    let y = e.target.getAttribute("data-y")
                    this.makePlay(Number(x), Number(y))
                })
                a++;
            }
        }
        this.cssBorderRemove()
        adjustmentLayout()
    }

    cssBorderRemove() {
        this.#fields.forEach((el, i) => {
            if (i < this.size) {
                el.parentElement.style.borderTop = 'none'
            }
            if (i >= (this.size ** 2) - this.size) {
                el.parentElement.style.borderBottom = 'none'
            }
            if (((i + 1) % this.size) === 0) {
                el.parentElement.style.borderRight = 'none'
            }
            if (((i) % this.size) === 0) {
                el.parentElement.style.borderLeft = 'none'
            }
        })
    }

    restart() {
        if (this.#finished) {
            this.init()
        } else {
            alert("Só é possivel reiniciar depois que a partida acabar!")
        }
    }

    setSize(size) {
        if (this.moviesCount > 0 && !this.#finished) return alert("Finalize a partida primeiro!")
        this.size = size
        this.render()
        this.init()
        return true
    }

    init() {
        this.moviesCount = 0
        this.buttonRestart.classList.add("hidden")
        this.#finished = false
        this.#currentPlayer = this.#player1;
        this.#game = []
        let a = 0;
        for (let i = 0; i < this.size; i++) {
            this.#game.push([new Array(3)])
            for (let y = 0; y < this.size; y++) {
                this.#fields[a].classList.remove("done")
                this.#game[i][y] = ""
                a++;
            }
        }
        this.showValuesOnBoard()
        this.updateScoreboard()
    }

    updateScoreboard() {
        let player1Name = this.scoreboard.querySelector(".player1 .name")
        let player2Name = this.scoreboard.querySelector(".player2 .name")
        let player1Score = this.scoreboard.querySelector(".player1 .score")
        let player2Score = this.scoreboard.querySelector(".player2 .score")
        player1Score.textContent = this.#player1.score;
        player2Name.textContent = this.#player2.name
        player1Name.textContent = this.#player1.name
        player2Score.textContent = this.#player2.score;
    }

    showValuesOnBoard() {
        document.querySelector("#currentPlayer").innerHTML = "Vez de " + this.#currentPlayer.name
        let arrayOfMatrizGame = this.#game.flat()
        this.#fields.forEach((el, i) => {
            el.innerHTML = arrayOfMatrizGame[i]
        })
    }

    makePlay(x, y) {
        if (this.#finished) return false
        if (this.moviesCount === 1) this.startTime = new Date()
        this.moviesCount++
        if (this.#game[x][y]) throw new Error("Jogada Inválida!")
        this.#game[x][y] = this.#currentPlayer.name
        this.showValuesOnBoard()
        this.checkWinner()
    }

    toggleCurrentPlayer() {
        this.#currentPlayer = this.#currentPlayer === this.#player1 ? this.#player2 : this.#player1
        document.querySelector("#currentPlayer").innerHTML = "Vez de " + this.#currentPlayer.name
    }

    checkWinner() {
        let horizontalLine = []
        let verticalLine = []
        let diagonalLine1 = []
        let diagonalLine2 = []
        for (let i = 0; i < this.size; i++) {

            /* VERIFICAR HORIZONTAL */
            horizontalLine = []
            for (let x = 0; x < this.size; x++) {
                horizontalLine.push({ x: i, y: x, player: this.#game[i][x] })
            }

            /* VERIFICAR VERTICAL */
            verticalLine = []
            for (let x = 0; x < this.size; x++) {
                verticalLine.push({ x: x, y: i, player: this.#game[x][i] })
            }

            /*  DIAGONAL */
            for (let x = 0; x < this.size; x++) {
                if (x === i) diagonalLine1.push({ x: x, y: i, player: this.#game[x][i] })
            }

            /** DIAGONAL 2 */
            let aux = this.size - i - 1;
            diagonalLine2.push({ x: i, y: aux, player: this.#game[i][aux] })

            if (JogoDaVelha.allValueOfArrayIsEqual(horizontalLine)) return this.endGame(horizontalLine)
            if (JogoDaVelha.allValueOfArrayIsEqual(verticalLine)) return this.endGame(verticalLine)
        }

        if (JogoDaVelha.allValueOfArrayIsEqual(diagonalLine1)) return this.endGame(diagonalLine1)
        if (JogoDaVelha.allValueOfArrayIsEqual(diagonalLine2)) return this.endGame(diagonalLine2)

        let arrayOfGame = this.#game.flat().filter(el => el != '')
        if (arrayOfGame.length === this.size ** 2) {
            this.#finished = true
            this.buttonRestart.classList.remove("hidden")
            return document.querySelector("#currentPlayer").textContent = "VELHA!"
        }
        this.toggleCurrentPlayer()
    }

    endGame(obj) {
        let endTime = new Date() - this.startTime
        document.querySelector("#currentPlayer").textContent = this.#currentPlayer.name + " venceu em " + JogoDaVelha.differTime(endTime)
        this.#finished = true
        obj.forEach(el => {
            document.querySelector(`button[data-x = "${el.x}"][data-y= "${el.y}"]`).classList.add("done")
        })
        this.buttonRestart.classList.remove("hidden")

        this.#currentPlayer.score = this.#currentPlayer.score + 1
        this.updateScoreboard()
    }

    static allValueOfArrayIsEqual(arr) {
        return arr.every((num, i, arr) => {
            if (!num.player) return false
            return num.player == arr[0].player
        })
    }

    static differTime(millis) {
        let a = new Date(millis)
        let minutes = String(a.getMinutes()).padStart(2, "0")
        let seconds = String(a.getSeconds()).padStart(2, "0")
        let milliss = String(a.getMilliseconds()).padStart(3, '0')
        return `${minutes}:${seconds}:${milliss}`
    }
}