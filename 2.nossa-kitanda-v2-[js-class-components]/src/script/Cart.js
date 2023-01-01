import { addClassWithEffect, convertBrMoney } from './util/util.js'
import { ItemCarrinho } from './ItemCart.js'

const carrinho = document.querySelector("template#template-carrinho")
const btnCesta = document.querySelector("#btnCesta")

export class Carrinho {
    constructor() {
        this.DivCartWithBackground = carrinho.cloneNode(true).content.querySelector('div')
        this.btnCart = btnCesta
        this.btnCartCount = this.btnCart.querySelector('.btnCestaQuantidade')
        // this.carrinhoBackground = this.carrinhoWithBackgroundDiv.querySelector('.fundo-carrinho')
        this.cart = this.DivCartWithBackground.querySelector('.carrinho')
        this.isOpen = false

        this.divTitleQtdOFItems = this.cart.querySelector('.title span')
        this.itemsPlace = this.cart.querySelector('.itens-carrinho')
        this.divTotalAPrazo = this.cart.querySelector('.valor-total')
        this.divValorDasParcelas = this.cart.querySelector('.linha-parcelamento span')
        this.divTotalAvista = this.cart.querySelector('.linha-total-vista strong')
        this.divEconomia = this.cart.querySelector('.linha-economia span')

        this.items = []
        this.init()
    }

    init() {
        document.body.append(this.DivCartWithBackground)

        if (localStorage.getItem('cesta') && localStorage.getItem('cesta') !== {}) { // verificar se tem carrinho salvo no LocalStorage
            let data = JSON.parse(localStorage.getItem('cesta'))
            data.forEach(el => this.addItem(el, true))
        }
        this.setIsOpen(this.isOpen)
        this.btnCart.onclick = () => this.toggleIsOpen()
        this.updateFooter()
    }

    animateButtonCart() {
        console.log(this.items)
        this.btnCartCount.textContent = this.items.length > 0 ? this.items.length : '😢'
        addClassWithEffect(this.btnCart, 'shake')
    }

    toggleIsOpen() {
        this.setIsOpen(!this.isOpen)
    }

    setIsOpen(boolean) {
        this.isOpen = boolean

        if (this.isOpen) {
            this.cart.classList.add('open')
            document.body.classList.add('opens')
            this.animateButtonCart()
            // this.carrinhoBackground.style.display = 'block'
        } else {
            this.cart.classList.remove('open')
            document.body.classList.remove('opens')
            //this.carrinhoBackground.style.display = 'none'
        }
    }

    addItem(item, localStorage_ = false) {
        let exists = false

        this.items.forEach(el => {
            if (el.item.id === item.id) {
                addClassWithEffect(el.itemCart, 'item-destacado')
                el.incrementValue()
                exists = true
            }
        })
        this.setIsOpen(true)

        if (exists) return

        let qtd = localStorage_ ? item.qtd : 1
        let itemCarrinho = new ItemCarrinho(item, this, qtd)

        this.items.push(itemCarrinho)
        this.updateFooter()
        this.animateButtonCart()
    }

    removeItem(item) {
        this.items = this.items.filter(el => el.item !== item)

        if (this.items.length < 1) {
            this.setIsOpen(false)
        }
        this.updateFooter()
        this.animateButtonCart()
    }

    saveInLocalStorage() {
        let data = this.items.map(el => el.item)
        localStorage.setItem('cesta', JSON.stringify(data))
    }

    updateFooter() {
        let total = this.items.reduce((prev, curr) => {
            return (curr.item.preco * Number(curr.item.qtd)) + prev
        }, 0)

        this.divTotalAPrazo.textContent = convertBrMoney(1 * total)
        this.divValorDasParcelas.textContent = convertBrMoney((1 * total) / 12)
        this.divTotalAvista.textContent = convertBrMoney(0.9 * total)
        this.divEconomia.textContent = convertBrMoney(0.1 * total)
        this.divTitleQtdOFItems.textContent = this.items.length > 0 ? this.items.length : 'vazia'
        this.saveInLocalStorage()
        let data = this.items.map(el => el)
    }

}