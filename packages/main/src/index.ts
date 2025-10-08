import {app,ipcMain,BrowserWindow} from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';
import {LocalFileSystemService} from '/@/LocalFileSystemService';
import {DataHubService} from '/@/DataHubService';
import {SwateService} from '/@/SwateService';
import {InternetService} from '/@/InternetService';
import {GitService} from '/@/GitService';
import os from 'os';
import fs from 'fs';

/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);

/**
 * Windows Fix
 */
if(os.platform()==='win32')
  app.commandLine.appendSwitch('no-sandbox');

/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', restoreOrCreateWindow);

const initConfig = async ()=>{
  const userDataPath = app.getPath('userData');
  if(!fs.existsSync(userDataPath))
    fs.mkdirSync(userDataPath);

  for(let file of ['ARCitect.json','DataHubs.json']){
    const sourceFile = (import.meta.env.DEV ? 'resources' : process.resourcesPath)+'/'+file;
    const destinationFile = userDataPath+'/'+file;
    if (!fs.existsSync(destinationFile))
      fs.copyFileSync(sourceFile, destinationFile);
  }
};

const initCore = async () => {
  const PATH = require('path');
  if(process.platform === 'win32'){
      const process_path_separator = ';';
      process.env['PATH'] += process_path_separator + [process.resourcesPath,'git-binaries','win','cmd'].join(PATH.sep);
  } else if(process.platform === 'darwin'){
      process.env['PATH'] = [
        process.env['PATH'],
        '/usr/local/bin',      // Intel macOS Homebrew
        '/opt/homebrew/bin',   // Apple Silicon Homebrew
      ].join(':');
  }
  ipcMain.handle('CORE.exit', (e,code)=>{
    app.exit(code);
  });
  ipcMain.handle('CORE.log', (e,msg)=>console.log(msg));
  ipcMain.handle('CORE.getVersion', ()=>app.getVersion());
  ipcMain.handle('CORE.getTempPath', ()=>app.getPath('temp'));
  ipcMain.handle('CORE.getOS', ()=>os.platform());
  ipcMain.handle('CORE.reset', ()=>{
    LocalFileSystemService.remove( null, app.getPath('userData') );
    initConfig();
  });
  initConfig();
}

const runTests = async ()=>{
  if(import.meta.env.MODE==='test')
    BrowserWindow.getAllWindows().filter(w => !w.isDestroyed()).forEach(
      w=>w.webContents.send('CORE.runTests')
    );
};

/**
 * Do this to allow swate hosting with https
 */
if (!app.isPackaged)
  app.commandLine.appendSwitch('ignore-certificate-errors');

/**
 * Create app window when background process will be ready
 */
app.whenReady()
  .then(initCore)
  .then(DataHubService.init)
  .then(SwateService.init)
  .then(LocalFileSystemService.init)
  .then(InternetService.init)
  .then(GitService.init)
  .then(restoreOrCreateWindow)
  .then(runTests)
  .catch((e) => console.error('Failed create window:', e));

/**
 * Install Vue.js or some other devtools in development mode only
 */
if (import.meta.env.DEV) {
  app.whenReady()
    // .then(() => import('electron-devtools-installer'))
    // .then(({default: installExtension, VUEJS3_DEVTOOLS}) => installExtension(VUEJS3_DEVTOOLS, {
    //   loadExtensionOptions: {
    //     allowFileAccess: true,
    //   },
    // }))
    .catch(e => console.error('Failed install extension:', e));
}
