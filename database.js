const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./journal.db')

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    `)
})

module.exports = db