import {app,ipcMain} from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';
import {LocalFileSystemService} from '/@/LocalFileSystemService';
import {DataHubService} from '/@/DataHubService';
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
  } else if(process.platform === 'darwin') {
      const process_path_separator = ':';
      const architecture = process.arch === 'arm64' ? 'arm64' : 'amd64' ;
      process.env['PATH'] += process_path_separator + [process.resourcesPath,'git-binaries','mac',architecture].join(PATH.sep);
  }
  ipcMain.handle('CORE.getVersion', ()=>app.getVersion());
  ipcMain.handle('CORE.getTempPath', ()=>app.getPath('temp'));
  ipcMain.handle('CORE.reset', ()=>{
    LocalFileSystemService.remove( null, app.getPath('userData') );
    initConfig();
  });
  initConfig();
}

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
  .then(LocalFileSystemService.init)
  .then(InternetService.init)
  .then(GitService.init)
  .then(restoreOrCreateWindow)
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
