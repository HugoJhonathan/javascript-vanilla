import { convertBrMoney } from './util/util.js'

const itemCom = document.querySelector("template#item-prod")

export class Item {
    constructor(item, carrinho) {
        this.carrinho = carrinho
        this.itemComponent = itemCom.cloneNode(true).content.querySelector('div')
        this.item = item
    }
    render(local) {
        this.itemComponent.querySelector('h1').textContent = this.item.fruta
        this.itemComponent.querySelector('.imagem img').src = `./database/images/${this.item.fruta}.png`
        this.itemComponent.querySelector('.preco').textContent = convertBrMoney(this.item.preco) + "/Kg"
        this.itemComponent.querySelector('button').onclick = () => this.carrinho.addItem(this.item)
        local.append(this.itemComponent)
    }
    getItemComponent() {
        return this.itemComponent
    }

}