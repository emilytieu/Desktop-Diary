const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    minimize: () =>  ipcRenderer.send('minimize-window'),
    maximize: () => ipcRenderer.send('maximize-window'),
    close: () => ipcRenderer.send('close-window'),
    getEntries: () => ipcRenderer.invoke('get-entries'),
    getEntry: (id) => ipcRenderer.invoke('get-entry', id),
    saveEntry: (entry) => ipcRenderer.invoke('save-entry', entry),
    deleteEntry: (id) => ipcRenderer.invoke('delete-entry', id)
})