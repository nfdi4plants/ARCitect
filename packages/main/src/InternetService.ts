import {
  ipcMain,
  shell
} from 'electron';

import https from 'https';

let req = null;

export const InternetService = {

  callSwateAPI: (event, data)=>{
    return new Promise(
      (resolve, reject) => {
        const options = {
          host: 'swate-alpha.nfdi4plants.org',
          port: 443,
          path: `/api/IOntologyAPIv2/${data.method}`,
          method: 'POST',
          headers: {
            'accept':       'application/json',
            'Content-Type': 'application/json',
            'user-agent':   'node.js'
          }
        };

        if(req){
          req.destroy();
          req.resolve([]);
        }

        req = https.request(options, res => {
          let output = '';
          res.setEncoding('utf8');
          res.on('data', chunk => {
            output += chunk;
          });
          res.on('end', () => {
            resolve(JSON.parse(output));
          });
        });
        req.reject = reject;
        req.resolve = resolve;
        req.on('error', err => {
          resolve(err);
        });
        req.write(JSON.stringify(data.payload));
        req.end();
      }
    );
  },

  getTemplates: ()=>{
    return new Promise(
      (resolve, reject) => {
        fetch('https://github.com/nfdi4plants/Swate-templates/releases/download/latest/templates.json')
          .then(res => res.json())
          .then(json => {
            resolve(json)
          })
      }
    );
  },

  openExternalURL: async (e,url)=>{
    shell.openExternal(url);
    return;
  },

  init: async () => {
    ipcMain.handle('InternetService.openExternalURL', InternetService.openExternalURL );
    ipcMain.handle('InternetService.getTemplates', InternetService.getTemplates );
    ipcMain.handle('InternetService.callSwateAPI', InternetService.callSwateAPI );
  }

};
