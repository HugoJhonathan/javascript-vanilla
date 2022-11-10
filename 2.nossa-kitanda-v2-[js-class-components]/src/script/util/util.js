export const convertBrMoney = value => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export const addClassWithEffect = (element, _class) => {
    if (element.classList.contains(_class)) {
        element.classList.remove(_class)
    }
    setTimeout(() => {
        element.classList.add(_class)
    }, 100);
}