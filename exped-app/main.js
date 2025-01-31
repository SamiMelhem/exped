const path = require('path');
const { app, BrowserWindow, Menu, ipcMain } = require('electron');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

// Create about window
function createAboutWindow() {
    const aboutWindow = new BrowserWindow({
        title: 'About Exped',
        width: 600,
        height: 300,
    });

    aboutWindow.loadFile(path.join(__dirname, 'about.html'));
}

// Create the main window
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        title: 'Exped',
        width: isDev ? 1300 : 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, './renderer/js/preload.js'),
        }
    });

    // Open devtools if in dev env (Warning will show in the vs code terminal bc of openDevTools)
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

// App is ready
app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong');


    createWindow()

    // Implement menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})

// Menu template
const menu = [
    ...(isMac ? [{
        label: app.name,
        submenu: [ 
            {
                label: "About",
                click: createAboutWindow,
            }
        ]
    }] : []),
    {
        role: 'fileMenu',
    },
    ...(!isMac ? [{
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click: createAboutWindow,
            },
        ],
    }] : [])
]

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
})