const path = require('path');
const { app, BrowserWindow, nativeImage } = require('electron');

const TARGET_URL = 'https://cargox.dmadubai.com';
const APP_NAME = 'CargoXmanager';
const LOGO_PATH = path.join(__dirname, 'logo.png');
const SPLASH_PATH = path.join(__dirname, 'splash.html');
const SPLASH_DURATION_MS = 2500;

function getAppIcon() {
  const icon = nativeImage.createFromPath(LOGO_PATH);

  return icon.isEmpty() ? undefined : icon;
}

function createMainWindow(appIcon) {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    title: APP_NAME,
    icon: appIcon,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
    },
  });

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'self'; style-src 'unsafe-inline'; frame-src ${TARGET_URL};"
        />
        <title>${APP_NAME}</title>
        <style>
          html,
          body,
          webview {
            width: 100%;
            height: 100%;
            margin: 0;
          }

          body {
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <webview src="${TARGET_URL}" allowpopups></webview>
      </body>
    </html>
  `;

  win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

  return win;
}

function createSplashWindow(appIcon) {
  const splash = new BrowserWindow({
    width: 520,
    height: 360,
    frame: false,
    resizable: false,
    transparent: false,
    alwaysOnTop: true,
    show: true,
    title: APP_NAME,
    icon: appIcon,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  splash.loadFile(SPLASH_PATH);

  return splash;
}

app.setName(APP_NAME);

app.whenReady().then(() => {
  const appIcon = getAppIcon();
  let splash = createSplashWindow(appIcon);
  const mainWindow = createMainWindow(appIcon);

  setTimeout(() => {
    if (splash && !splash.isDestroyed()) {
      splash.close();
    }

    if (!mainWindow.isDestroyed()) {
      mainWindow.show();
    }

    splash = null;
  }, SPLASH_DURATION_MS);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow(appIcon).show();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
