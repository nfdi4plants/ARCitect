import {
  ipcMain,
  BrowserWindow,
  dialog,
  shell
} from 'electron';

import https from 'https';

const httpsOptions = {
  host: 'git.nfdi4plants.org',
  port: 443,
  path: '',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'user-agent': 'node.js'
  }
};

export const DataHubService = {

  getWebPageAsJson: (e,url) => {
    return new Promise(
      (resolve, reject) => {
        httpsOptions.path = url;

        const req = https.request(httpsOptions, res => {
          let output = '';
          res.setEncoding('utf8');
          res.on('data', chunk => {
            output += chunk;
          });
          res.on('end', () => {
            resolve(JSON.parse(output));
          });
        });
        req.on('error', err => {
          console.error(err);
          reject(err);
        });
        req.end();
      }
    );
  },

  selectImportDestination: async ()=>{
    const window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
    const result = await dialog.showOpenDialog(window, {
      title: 'Select Destination of ARC Import',
      message: 'Select Destination of ARC Import',
      properties: ['openDirectory']
    });
    return result.filePaths[0];
  },

  getArcs: async e=>{
    return await DataHubService.getWebPageAsJson(null,"/api/v4/projects/");
  },

  inspectArc: async (e,url)=>{
    shell.openExternal(url);
    // try {
    //   open(url);
    // } catch(e) {}
    return;
  },

  init: async () => {
    ipcMain.handle('DataHubService.getArcs', DataHubService.getArcs );
    ipcMain.handle('DataHubService.inspectArc', DataHubService.inspectArc );
    ipcMain.handle('DataHubService.selectImportDestination', DataHubService.selectImportDestination );
  }

};
