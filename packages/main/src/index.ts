import {app} from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';
import {LocalFileSystemService} from '/@/LocalFileSystemService';
import {DataHubService} from '/@/DataHubService';
// import {ArcCommanderService} from '/@/ArcCommanderService';
import {InternetService} from '/@/InternetService';
import {GitService} from '/@/GitService';
import {ArcControlService} from '/@/ArcControlService';
import os from 'os';

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


/**
 * Create app window when background process will be ready
 */
app.whenReady()
  .then(DataHubService.init)
  .then(LocalFileSystemService.init)
  .then(InternetService.init)
  .then(GitService.init)
  .then(ArcControlService.init)
  .then(restoreOrCreateWindow)
  .catch((e) => console.error('Failed create window:', e));

/**
 * Install Vue.js or some other devtools in development mode only
 */
if (import.meta.env.DEV) {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({default: installExtension, VUEJS3_DEVTOOLS}) => installExtension(VUEJS3_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    }))
    .catch(e => console.error('Failed install extension:', e));
}
