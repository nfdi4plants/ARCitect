import {
  ipcMain,
  shell,
  net
} from 'electron';

import https from 'https';

let req = null;

const default_header = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'user-agent': 'node.js'
};

export const InternetService = {

  getWebPageAsJson: (e,options) => {
    return new Promise(
      (resolve, reject) => {
        try {
          const request = net.request(options);
          const header = options.header || default_header;
          for(let h in header)
            request.setHeader(h,header[h]);

          request.on('response', (response) => {
            if(response.statusCode===200){
              let output = '';
              response.on('data', chunk => {
                output += chunk;
              });
              response.on('end', () => {
                resolve(JSON.parse(output));
              });
            } else {
              // console.error('response',response);
              resolve(null);
            }
          })
          request.end()
        } catch(err){
          console.error('catch',err);
          resolve(null);
        }
      }
    );
  },

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

  getArcitectVersions: async (e)=>{
    return await InternetService.getWebPageAsJson(
      null,
      {
        host: 'api.github.com',
        path: '/repos/nfdi4plants/ARCitect/tags',
        method: 'GET'
      }
    );
  },

  init: async () => {
    ipcMain.handle('InternetService.openExternalURL', InternetService.openExternalURL );
    ipcMain.handle('InternetService.getTemplates', InternetService.getTemplates );
    ipcMain.handle('InternetService.callSwateAPI', InternetService.callSwateAPI );
    ipcMain.handle('InternetService.getArcitectVersions', InternetService.getArcitectVersions );
  }

};
