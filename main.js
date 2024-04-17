const { app, Tray, Menu, nativeImage, BrowserWindow, Notification, screen, ipcMain  } = require('electron')
const path = require('node:path')


let tray 
const imageIcone = path.join(__dirname, '..', 'assets', 'sa.png')


const createWindow = () => {

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({
        width: 260,
        height: 150,
        x: width - 360, // Largura da tela menos a largura da janela
        y: height - 170,
        resizable: false,
        fullscreen: false,
        fullscreenable: false,
        title: "Aplicativo",
        titleBarStyle: 'hidden',
        backgroundMaterial: 'acrylic',
        alwaysOnTop: true,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload.js'),
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')

    // win.webContents.openDevTools()

    
    
    win.on('blur', () => {
        win.focus();
    });

    return win

}

const createNotification = (title, body) => {
    const notification = new Notification({
        title: title || "Bem-vindo ao Sistema do Matheus",
        body: body || 'Carregamento concluído!'
    })

    notification.show()
}

app.whenReady().then(() => {

    const icon = nativeImage.createFromPath(imageIcone)
    
    tray = new Tray(icon)
    tray.on('double-click', () => {
        if(BrowserWindow.getAllWindows().length == 0) {
            createWindow()
        }
    })
    
    const newWindow = createWindow()
    
    ipcMain.handle('close', () => {
        newWindow.close()
    })
    
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Configurações', type: 'normal'},
        { label: 'Recarregar Página', type: 'normal'},
        { label: 'Sair do Aplicativo', type: 'normal', role: 'close'},
    ])
    
    tray.setContextMenu(contextMenu)
    
    tray.setToolTip('This is my application')
    tray.setTitle('This is my title')
}).catch((e) => console.log(e))

app.on('window-all-closed', () => {
    if(process.platform !== 'win32') {
        app.quit()
    }
})
