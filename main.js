


const Electron = require('electron');

const ProxyServer = require('./proxy');

let window = null;
let server = null;

Electron.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        Electron.app.quit();
    }
});

Electron.app.on('closed', function () {
    if (server) {
        server.stop();
        server = null;
    }
    window = null;
});

Electron.app.on('ready', function() {
    window = new Electron.BrowserWindow({
        title: 'Proxy',
        width: 800,
        height: 600
    });
    window.setMenu(null);    
    window.loadURL('file://'+__dirname+'/index.html');
});

Electron.ipcMain.on('cmd', (event, cmd, port)=> {
    switch(cmd) {
        case 'start': {
            if (server) {
                server.stop();
                server = null;
            }
            server = new ProxyServer(port);    
            server.start();
            server.on('log', message => {
                event.sender.send('log', new Date() + '\t' + message);
            });        
        }
    }
})