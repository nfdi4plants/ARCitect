import {
  ipcMain,
  BrowserWindow,
  dialog,
  shell
} from 'electron';

import https from 'https';
import querystring from 'query-string';
// import express from 'express';
const express = require('express');
let authApp = null;
const authPort = 7890;

export const DataHubService = {

  getWebPageAsJson: (e,options) => {
    return new Promise(
      (resolve, reject) => {

        const req = https.request(options, res => {
          let output = '';
          res.setEncoding('utf8');
          res.on('data', chunk => {
            output += chunk;
          });
          res.on('end', () => {
            // console.log(output);
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

  getArcs: async (e,token)=>{
    return await DataHubService.getWebPageAsJson(
      null,
      {
        host: 'git.nfdi4plants.org',
        path: '/api/v4/projects/?per_page=1000'+ (token ? `&access_token=${token}` : ''),
        port: 443,
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
    // try {
    //   open(url);
    // } catch(e) {}
    return;
  },

  authenticate: async (e,code)=>{
    const url_params = {
      response_type: 'code',
      redirect_uri: 'http://localhost:7890',
      client_id: '80f4fbff13c3a27713860b6e71755fb3cba7adf644cf71a7cfcc9c1f67ac3680',
      scope: `openid read_api email profile read_repository write_repository`
    };
    const auth_url =
      // 'https://auth.nfdi4plants.org/realms/dataplant/protocol/openid-connect/auth'
      'https://git.nfdi4plants.org/oauth/authorize'
      +'?'
      +querystring.stringify(url_params)
    ;
    shell.openExternal(auth_url);

  },

  init: async () => {
    ipcMain.handle('DataHubService.getArcs', DataHubService.getArcs );
    ipcMain.handle('DataHubService.inspectArc', DataHubService.inspectArc );
    ipcMain.handle('DataHubService.selectImportDestination', DataHubService.selectImportDestination );
    ipcMain.handle('DataHubService.authenticate', DataHubService.authenticate );

    authApp = express()
    authApp.get('/', async (req, res) => {
      // console.log(req.url);
      if(!req.url || !req.url.startsWith('/?code=')){
        return res.send('Invalid Request.');
      }

      const code = req.url.split('/?code=')[1];
      const params = querystring.stringify({
        client_id: '80f4fbff13c3a27713860b6e71755fb3cba7adf644cf71a7cfcc9c1f67ac3680',
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:7890',
        code: code
      });
      const token_data = await DataHubService.getWebPageAsJson(
        null,
        {
          host: 'git.nfdi4plants.org',
          path: `/oauth/token?` + params,
          port: 443,
          method: 'POST',
          headers: {
            'user-agent': 'node.js',
            'Content-Type': 'application/json'
          }
        }
      );

      const user_data = await DataHubService.getWebPageAsJson(
        null,
        {
          host: 'git.nfdi4plants.org',
          path: `/api/v4/user/?access_token=${token_data.access_token}`,
          port: 443,
          method: 'GET',
          headers: {
            'user-agent': 'node.js',
            'Content-Type': 'application/json'
          }
        }
      );
      user_data.token = token_data;

      res.send('<h1>Login and Authorization Complete. You can now return to ARCitect.</h1><script>window.close()</script>');
      let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
      window.webContents.send('DataHubService.authentificationData', user_data);
      window.focus();
    });
    authApp.listen(authPort, () => {
      console.log(`Authentification service listening on port ${authPort}`);
    });
  }

};
