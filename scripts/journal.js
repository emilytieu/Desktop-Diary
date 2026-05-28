window.addEventListener('DOMContentLoaded', async () => {
    const titleInput =  document.getElementById('entry-title')
    const contentInput = document.getElementById('entry-content')
    const saveBtn = document.getElementById('save-btn')

    const params = new URLSearchParams(window.location.search)
    const entryId = params.get('id')

    // If there's an entryId param, we're editing an existing entry, so we should load its data
    if (entryId) {
        const entry = await window.api.getEntry(entryId)

        if (entry) {
            titleInput.value = entry.title
            contentInput.value = entry.content
        }
    }

    console.log(saveBtn)
    saveBtn.addEventListener('click', async () => {
        const entryData = {
            id: entryId,
            title: titleInput.value || 'Untitled',
            content: contentInput.value
        }
        await window.api.saveEntry(entryData)
    })
})