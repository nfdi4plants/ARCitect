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
              console.error(response);
              resolve(null);
            }
          })
          request.end()
        } catch(err){
          console.error(err);
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
    DataHubService.auth_host  = host;
    const url_params = {
      response_type: 'code',
      redirect_uri: 'http://localhost:7890',
      client_id: '80f4fbff13c3a27713860b6e71755fb3cba7adf644cf71a7cfcc9c1f67ac3680',
      scope: `openid read_api email profile read_repository write_repository`
    };
    const auth_url = `https://${DataHubService.auth_host}/oauth/authorize?${querystring.stringify(url_params)}`;
    shell.openExternal(auth_url);
  },

  getParams: code=>{
    return querystring.stringify({
      client_id: '80f4fbff13c3a27713860b6e71755fb3cba7adf644cf71a7cfcc9c1f67ac3680',
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:7890',
      code: code
    });
  },

  getToken: async (e,code,host)=>{
    return await DataHubService.getWebPageAsJson(
        null,
        {
          host: host,
          path: `/oauth/token?` + DataHubService.getParams(code),
          port: 443,
          method: 'POST',
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

    authApp = express()
    authApp.get('/', async (req, res) => {
      if(!req.url || !req.url.startsWith('/?code=')){
        return res.send('Invalid Request.');
      }

      const code = req.url.split('/?code=')[1];
      const token = await DataHubService.getToken(null,code,DataHubService.auth_host);
      const user = await DataHubService.getUser(null,token.access_token,DataHubService.auth_host);
      user.tokens = {};
      user.tokens[DataHubService.auth_host] = token;

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
