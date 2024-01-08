import {
  ipcMain,
  BrowserWindow,
  dialog,
  shell,
  net
} from 'electron';

import querystring from 'query-string';
const express = require('express');
let authApp = null;
const authPort = 7890;

const CREDENTIALS = {
  'git.nfdi4plants.org': {
    id: '80f4fbff13c3a27713860b6e71755fb3cba7adf644cf71a7cfcc9c1f67ac3680',
    secret: null,
  },
  'gitlab.nfdi4plants.de': {
    id: '63068e329ba2bba4a5077c29d19996e4b9440fa47ee00da3f79f53f63558a8a8',
    secret: 'a5c722995c5b7f6b43e337694f84a7af6ecea61a8486817b1be3d2fa87b4354c',
  },
  'gitlab.plantmicrobe.de': {
    id: '36ccd7924db8cf3548ee422b084dfdb28e0353cb99bbe7c0f236ae2b5f6c1bcb',
    secret: 'bbdd7493a1beb223d6345101d839b8aebfd81f889fd8e851d6674a9994cdab0c',
  },
}

export const DataHubService = {

  auth_host: null,

  getWebPageAsJson: (e,options) => {
    return new Promise(
      (resolve, reject) => {
        try {
          const request = net.request(options)
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
              console.error('response',response);
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

  getArcs: async (e,[host,token])=>{
    return await DataHubService.getWebPageAsJson(
      null,
      {
        host: host,
        path: '/api/v4/projects/?per_page=1000'+ (token ? `&access_token=${token}` : ''),
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'user-agent': 'node.js'
        }
      }
    );
  },

  inspectArc: async (e,url)=>{
    shell.openExternal(url);
    return;
  },

  authenticate: async (e,host)=>{
    if(!CREDENTIALS[host]) return false;

    DataHubService.auth_host  = host;
    const url_params = {
      response_type: 'code',
      redirect_uri: 'http://localhost:7890',
      client_id: CREDENTIALS[host].id,
      scope: `openid read_api email profile read_repository write_repository`
    };
    const auth_url = `https://${host}/oauth/authorize?${querystring.stringify(url_params)}`;
    shell.openExternal(auth_url);

    return true;
  },

  getToken: async (e,code,host)=>{
    if(!CREDENTIALS[host]) return null;

    const url_params = {
      code: code,
      client_id: CREDENTIALS[host].id,
      client_secret: CREDENTIALS[host].secret,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:7890'
    };

    const path = `/oauth/token?${querystring.stringify(url_params)}`;

    return await DataHubService.getWebPageAsJson(
        null,
        {
          host: host,
          path: path,
          port: 443,
          method: 'POST',
          headers: {
            'user-agent': 'node.js',
            'Content-Type': 'application/json'
          }
        }
      );
  },

  getGroups: async (e,[host,token])=>{
    return await DataHubService.getWebPageAsJson(
        null,
        {
          host: host,
          path: `/api/v4/groups/?${querystring.stringify({
            access_token: token,
            all_available: true
          })}`,
          port: 443,
          method: 'GET',
          headers: {
            'user-agent': 'node.js',
            'Content-Type': 'application/json'
          }
        }
      );
  },

  getUser: async (e,token,host)=>{
    return await DataHubService.getWebPageAsJson(
        null,
        {
          host: host,
          path: `/api/v4/user/?access_token=${token}`,
          port: 443,
          method: 'GET',
          headers: {
            'user-agent': 'node.js',
            'Content-Type': 'application/json'
          }
        }
      );
  },

  init: async () => {
    ipcMain.handle('DataHubService.getArcs', DataHubService.getArcs );
    ipcMain.handle('DataHubService.inspectArc', DataHubService.inspectArc );
    ipcMain.handle('DataHubService.authenticate', DataHubService.authenticate );
    ipcMain.handle('DataHubService.getGroups', DataHubService.getGroups );

    authApp = express()
    authApp.get('/', async (req, res) => {
      if(!req.url || !req.url.startsWith('/?code=')){
        return res.send('Invalid Request.');
      }

      const code = req.url.split('/?code=')[1];
      const token = await DataHubService.getToken(null,code,DataHubService.auth_host);
      const user = await DataHubService.getUser(null,token.access_token,DataHubService.auth_host);
      user.token = token;
      user.host = DataHubService.auth_host;

      res.send('<h1>Login and Authorization Complete. You can now return to ARCitect.</h1><script>window.close()</script>');
      let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
      window.webContents.send('DataHubService.authentificationData', user);
      window.focus();
    });
    authApp.listen(authPort, () => {
      console.log(`Authentification service listening on port ${authPort}`);
    });
  }

};
