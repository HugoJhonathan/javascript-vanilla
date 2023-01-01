class TodoInput {

    constructor(todo) {
        this.todo = todo
        this.init()
    }

    init() {
        this.todo.element.append(this.createDOM())
    }
    createDOM() {
        let inputText = document.createElement("input")
        inputText.setAttribute("type", "text")
        inputText.setAttribute("placeholder", "Add new Task")
        if ((!idLastInput && !positionScroll) || (!idLastInput && positionScroll == 0)) {
            inputText.setAttribute("autofocus", "true")
        }

        let btnSubmit = document.createElement("button")
        btnSubmit.innerHTML = ' <i class="ph-plus-bold"></i>'

        let form = document.createElement("form")
        form.addEventListener('submit', e => {
            e.preventDefault()
            this.addTaskInTodoList(inputText)
        })

        form.append(inputText, btnSubmit)
        return form
    }
    addTaskInTodoList(input) {
        if (input.value.trim() == "") return input.focus()
        let data = { id: new Date().getTime(), txt: input.value, done: false }

        this.todo.createTodoItem(data)
        input.value = ""
        input.focus()
    }

}

class TodoItem {
    data
    todo
    element
    input
    btnDelete
    constructor(todo, data) {
        this.data = data || {}
        this.todo = todo
        this.element = this.createDOM()
    }
    createDOM() {
        let div = document.createElement("div")
        div.classList.add("todoItem")
        let spanData = document.createElement("span")
        spanData.textContent = new Date(this.data.id).toLocaleString()

        let checkbox = document.createElement("input")
        checkbox.addEventListener("change", e => this.changeCheck(e.target.checked))
        checkbox.setAttribute("type", "checkbox")
        checkbox.checked = this.data.done


        this.input = document.createElement("input")
        this.input.value = this.data.txt
        this.input.setAttribute("type", "text")
        this.input.setAttribute("class", "savePosition")
        this.input.disabled = this.data.done
        this.input.setAttribute("data-id", this.data.id)
        this.input.addEventListener("input", e => this.changeText(e))
        this.input.addEventListener("focusin", e => {
            todoConfig.lastInput = this.data.id
            this.todo.saveInLocalStorage()
        })

        this.btnDelete = document.createElement("button")
        this.btnDelete.innerHTML = '<i class="ph-trash-bold"></i>'
        this.btnDelete.onclick = () => this.removeTask(this)

        div.append(spanData, checkbox, this.input, this.btnDelete)
        this.todo.element.appendChild(div)
        this.changeCheck(this.data.done)
        return div

    }
    removeTask(task) {
        this.todo.removeTodoItem(task.data.id)
        console.log(this)
        this.element.remove()
    }
    changeText(txt) {
        this.data.txt = txt.target.value
        this.todo.saveInLocalStorage()
    }
    changeCheck(done) {
        this.data.done = done
        this.input.disabled = done
        if (!done) {
            this.btnDelete.classList.add("hidden")
        } else {
            this.btnDelete.classList.remove("hidden")
        }
        this.todo.saveInLocalStorage()
    }
}

class Todo {
    todoItems = []
    element
    todoFooter
    constructor(data_) {
        this.element = document.createElement("div")
        this.element.setAttribute("class", "todoBox")
        document.body.appendChild(this.element)
        new TodoInput(this)
        this.todoFooter = new TodoFooter(this)
        this.createTodoItem(data_)
    }
    deteleAll() {
        console.log(this.todoItems)
        this.todoItems.forEach(item => {
            item.removeTask(item)
        })
    }
    createTodoItem(dataObj) {
        if (!dataObj) return null
        if (Array.isArray(dataObj)) {
            dataObj.forEach(item => {
                let todo = new TodoItem(this, item)
                this.todoItems.push(todo)
            })
            this.saveInLocalStorage()
            return false
        }

        let todo = new TodoItem(this, dataObj)
        this.todoItems.push(todo)
        this.saveInLocalStorage()

    }
    removeTodoItem(id) {
        this.todoItems = this.todoItems.filter(el => el.data.id != id)
        this.saveInLocalStorage()
    }
    saveInLocalStorage() {
        window.localStorage.setItem("todoList", JSON.stringify(this.getData()))
        window.localStorage.setItem("todoConfig", JSON.stringify(todoConfig))
        this.todoFooter.update()
    }
    getData() {
        return this.todoItems.map(todoItem => todoItem.data)
    }
    getTasksDone() {
        return this.getData().filter(task => task.done)
    }

}

class TodoFooter {
    todo
    span
    constructor(todo) {
        this.todo = todo
        this.init()
    }
    init() {
        this.todo.element.append(this.createDOM())
    }
    createDOM() {
        let div = document.createElement("div")
        div.setAttribute("class", "footer")
        this.span = document.createElement("span")
        this.update()
        div.append(this.span)
        return div
    }
    update() {
        this.span.textContent = this.todo.getTasksDone().length + "/" + this.todo.getData().length
    }
}

window.document.addEventListener("click", e => {
    if (!e.target.classList.contains("savePosition")) {
        delete todoConfig.lastInput
        todo.saveInLocalStorage()
    }
})

window.addEventListener('scroll', e => {
    todoConfig.lastPositionScroll = window.scrollY
    todo.saveInLocalStorage()
})

const todoConfig = JSON.parse(window.localStorage.getItem("todoConfig")) || {}
const itensSalvos = JSON.parse(window.localStorage.getItem("todoList"))
const idLastInput = todoConfig.lastInput
const positionScroll = todoConfig.lastPositionScroll

let todo = new Todo(itensSalvos)
const input = document.querySelector(`input[data-id="${idLastInput}"]`)

window.scrollBy(0, positionScroll)

setTimeout(() => {
    if (!input) return null
    input.focus()
}, 200);