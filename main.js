const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')
const db = require('./database')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true
    }
})
  win.loadFile('templates/title.html')
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
        }
    })
 })

ipcMain.on('close-window', (event) => {
    BrowserWindow.fromWebContents(event.sender).close()
})

ipcMain.on('minimize-window', (event) => {
    BrowserWindow.fromWebContents(event.sender).minimize()
})

ipcMain.on('maximize-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)

    if (win.isMaximized()) {
        win.unmaximize()
    } else {
        win.maximize()
    }
})

ipcMain.handle('get-entries', () => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM entries ORDER BY created_at DESC`,
            (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            }
        )
    })
})

ipcMain.handle('get-entry', (event, id) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM entries WHERE id = ?`,
            [id],
            (err, row) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            }
        )
    })
})

ipcMain.handle('save-entry', (event, entry) => {
    if (entry.id) {
        return db.prepare(`
            UPDATE entries
            SET title = ?,
                content = ?,
                created_at = ?
            WHERE id = ?
        `).run(
            entry.title,
            entry.content,
            new Date().toISOString(),
            entry.id
        )
    }
    return db.prepare(`
        INSERT INTO entries
        (title, content, created_at)
        VALUES (?, ?, ?)
    `).run(
        entry.title,
        entry.content,
        new Date().toISOString()
    )
})

ipcMain.handle('delete-entry', (event, id) => {
    return db.prepare(`
        DELETE FROM entries
        WHERE id = ?
    `).run(id)
})