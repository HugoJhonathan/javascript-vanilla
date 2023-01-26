const buttonChangeTheme = document.querySelector("#theme-toggle")

const getTheme = () => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme:dark)").matches) {
        return "dark"
    } else {
        return "light"
    }
}

let currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : getTheme()

const changeTheme = () => {
    document.body.setAttribute('data-theme', currentTheme)
    localStorage.setItem("theme", currentTheme)
}

changeTheme()

buttonChangeTheme.addEventListener('click', e => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark'
    changeTheme()
})
