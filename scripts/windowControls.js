document.getElementById('min-btn')
    .addEventListener('click', () => {
        window.api.minimize()
    })

document.getElementById('max-btn')
    .addEventListener('click', () => {
        window.api.maximize()
    })

document.getElementById('close-btn')
    .addEventListener('click', () => {
        window.api.close()
    })