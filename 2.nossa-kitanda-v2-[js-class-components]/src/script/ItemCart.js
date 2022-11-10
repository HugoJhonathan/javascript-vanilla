import { convertBrMoney } from './util/util.js'

const itemCart = document.querySelector("template#item-cart")

export class ItemCarrinho {
    constructor(item, carrinho, qtd = 1) {
        this.carrinho = carrinho
        this.item = item
        this.itemCart = itemCart.cloneNode(true).content.querySelector('div')
        this.total = this.itemCart.querySelector('.total')
        this.imagem = this.itemCart.querySelector('.imagem img')
        this.nome = this.itemCart.querySelector('.nome')
        this.btnAdd = this.itemCart.querySelector('.btn-add')
        this.btnDec = this.itemCart.querySelector('.btn-dec')
        this.inputQtd = this.itemCart.querySelector('input.input_quantidade')
        this.btnExcluir = this.itemCart.querySelector('.btn-excluir')
        this.item.qtd = qtd
        this.init()
    }
    incrementValue(val = 1) {
        this.inputQtd.value = Number(this.inputQtd.value) + val
        this.item.qtd = Number(this.inputQtd.value) + val
        this.atualizarTotal()
        this.carrinho.animateButtonCart()
    }

    init() {
        this.inputQtd.value = this.item.qtd

        this.nome.textContent = this.item.fruta
        this.imagem.src = `./database/images/${this.item.fruta}.png`

        this.btnAdd.onclick = () => this.changeValue('increment')
        this.btnDec.onclick = () => this.changeValue('decrement')
        this.btnExcluir.onclick = () => {
            this.carrinho.removeItem(this.item)
            this.itemCart.remove()
            this.atualizarTotal()
        }

        this.inputQtd.onchange = e => {
            if (e.target.value < 1) {
                this.inputQtd.value = 1
                this.item.qtd = 1
            }
            this.changeValue('change', e.target.value)
        }

        this.carrinho.itemsPlace.appendChild(this.itemCart)
        this.atualizarTotal()
    }

    changeValue(action, value) {
        let val = (Number(this.inputQtd.value) + 0.1).toFixed(1)
        if (action === 'decrement') {
            if (this.inputQtd.value == 1) return
            val = (Number(this.inputQtd.value) - 0.1).toFixed(1)
        }
        if (value) {
            val = value
        }
        this.inputQtd.value = Number(val)
        this.item.qtd = Number(val)
        this.atualizarTotal()
    }

    atualizarTotal() {
        this.total.textContent = convertBrMoney(this.item.preco * this.item.qtd)
        this.carrinho.updateFooter()
    }
}