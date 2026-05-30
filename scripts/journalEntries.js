window.addEventListener('DOMContentLoaded', async () => {
    const entriesList = document.getElementById('entries-list')
    const paginationDiv = document.getElementById('pagination')
    const entries = await window.api.getEntries()

    if (!entries || entries.length === 0) {
        entriesList.innerHTML = '<p>No saved entries yet.</p>'
        return
    }

    const entriesPerPage = 5
    let currentPage = 1

    function renderEntries() {
        entriesList.innerHTML = ''
        const start = (currentPage - 1) * entriesPerPage
        const end = start + entriesPerPage
        const pageEntries = entries.slice(start, end)

        pageEntries.forEach(entry => {
            const card = document.createElement('div')
            card.className = 'entry-card'

            card.innerHTML = `
                <img class="entry-thumb" src="../assets/icons/blank-icon.png" alt="Entry Thumbnail">
                <div class="entry-main">
                    <div class="entry-title">${entry.title}</div>
                    <div class="entry-preview">${entry.content.substring(0, 20)}...</div>
                </div>
                <div class="entry-spacer"></div>
                <div class="entry-meta">
                    <div class="entry-date">${new Date(entry.created_at).toLocaleDateString()}</div>
                    <div class="entry-time">${new Date(entry.created_at).toLocaleTimeString()}</div>
                </div>
                <div class="entry-actions">
                    <button class="edit-btn"><img src="../assets/icons/edit-icon.png" alt="Edit" draggable="false"></button>
                    <button class="lock-btn"><img src="../assets/icons/lock-icon.png" alt="Lock" draggable="false"></button>
                    <button class="delete-btn"><img src="../assets/icons/delete-icon.png" alt="Delete" draggable="false"></button>
                </div>
            `

            const editBtn = card.querySelector('.edit-btn')
            const deleteBtn = card.querySelector('.delete-btn')

            editBtn.addEventListener('click', () => {
                window.location.href = `journal.html?id=${entry.id}`
            })

            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation()
                await window.api.deleteEntry(entry.id)
                console.log(`Deleted entry with id ${entry.id}`)
                const index = entries.findIndex(en => en.id === entry.id)
                if (index > -1) entries.splice(index, 1)
                renderEntries()
            })
            entriesList.appendChild(card)
        })

        renderPaginationControls()
    }

    function renderPaginationControls() {
        const totalPages = Math.ceil(entries.length / entriesPerPage)
        paginationDiv.innerHTML = ''

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button')
            btn.textContent = i
            if (i === currentPage) btn.disabled = true
            btn.addEventListener('click', () => {
                currentPage = i
                renderEntries()
            })
            paginationDiv.appendChild(btn)
        }
    }
    renderEntries()
})