import { BrowserWindow,Menu,shell,ipcMain } from 'electron';
import path from 'path';
import { join } from 'path';
import { URL } from 'url';

import {exec,execSync,spawn} from 'child_process';

const contextMenu = require('electron-context-menu');
contextMenu({
  showSaveImageAs: true
});

async function createWindow() {
  const mainWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      webviewTag: true, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      nodeIntegration: true,
    },
    width:1280,
    height:700,
    icon: join(__dirname, './../../renderer/assets/dpLogo2.png')
  });
  /**
  * If you install `show: true` then it can cause issues when trying to close the window.
  * Use `show: false` and listener events `ready-to-show` to fix these issues.
  *
  * @see https://github.com/electron/electron/issues/25012
  */
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();

    // if (import.meta.env.DEV) {
    //   mainWindow?.webContents.openDevTools();
    // }
  });

  /**
  * URL for main window.
  * Vite dev server for development.
  * `file://../renderer/index.html` for production and test
  */
  const pageUrl = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();


  await mainWindow.loadURL(pageUrl);
  // mainWindow.webContents.loadURL("https://www.google.com");

  return mainWindow;
}

const isCommandAvailable = command=>{
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// -------------------------------------------------------------------------

/**
* Restore existing BrowserWindow or Create new BrowserWindow
*/
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
  const template = [
    {
      label: 'Window',
      submenu: [
        { role: 'quit' },
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'toggleDevTools' },
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Command Window',
          click: () => {
            window.webContents.send('CORE.getArcRoot', 'CORE.openTerminal');
          }
        },
        {
          label: 'Visual Studio Code',
          click: () => {
            window.webContents.send('CORE.getArcRoot', 'CORE.openVSCode');
          }
        },
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Tutorials',
          click: async () => {
            shell.openExternal('https://nfdi4plants.org/nfdi4plants.knowledgebase/start-here');
          }
        },
        {
          label: 'Helpdesk',
          click: async () => {
            shell.openExternal('https://helpdesk.nfdi4plants.org');
          }
        },
        {
          label: 'Knowledge Base',
          click: async () => {
            shell.openExternal('https://nfdi4plants.org/nfdi4plants.knowledgebase/index.html');
          }
        },
      ]
    }
  ];

  // add shortcut support for macos
  if(process.platform === 'darwin'){
    template.splice(1,0,
      {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
      }
    );
  }

  ipcMain.handle('CORE.openVSCode', (e,path)=>{
    if(!path) return window.webContents.send('CORE.messagePrompt', 'No ARC Open');

    const command = `code ${path}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        const msg = `Error opening VS Code: ${error.message}`;
        console.error(msg);
        window.webContents.send('CORE.messagePrompt', msg);
      }
    });
  });

  ipcMain.handle('CORE.openTerminal', (e,path)=>{
    if(!path) return window.webContents.send('CORE.messagePrompt', 'No ARC Open');

    let command;
    // Detect platform and assign the correct terminal command
    if (process.platform === 'win32') {
      command = `start cmd.exe /k "cd /d ${path}"`;
    } else if (process.platform === 'darwin') {
      // macOS: Use 'open' to open Terminal app in the specified directory
      command = `open -a Terminal "${path}"`;
    } else if (process.platform === 'linux') {

      let terminal;

      if (isCommandAvailable('gnome-terminal')) {
        terminal = 'gnome-terminal';
      } else if (isCommandAvailable('xterm')) {
        terminal = 'xterm';
      } else if (isCommandAvailable('konsole')) {
        terminal = 'konsole';
      } else {
        const msg = 'No supported terminal emulator found.';
        console.error(msg);
        return window.webContents.send('CORE.messagePrompt', msg);
      }

      // Linux: Set up terminal command depending on the emulator found
      if (terminal === 'gnome-terminal') {
        command = `gnome-terminal -- bash -c "cd '${path}' && exec bash"`;
      } else if (terminal === 'xterm') {
        command = `xterm -ls -e "cd '${path}' && exec bash"`;
      } else if (terminal === 'konsole') {
        command = `konsole --workdir '${path}' -e bash -c "exec bash"`;
      }
    } else {
      const msg = 'Platform not supported.';
      console.error(msg);
      return window.webContents.send('CORE.messagePrompt', msg);
    }

    // Execute the terminal opening command
    exec(command, { env: Object.create(process.env) }, (error, stdout, stderr) => {
      if (error) {
        const msg = `Error: ${error.message}`;
        console.error(msg);
        return window.webContents.send('CORE.messagePrompt', msg);
      }
    });
  });

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
