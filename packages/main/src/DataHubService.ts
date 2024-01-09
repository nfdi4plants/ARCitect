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

const https_cert = `
-----BEGIN CERTIFICATE-----
MIIDWTCCAkECFGu9BoV4gaUjsE8/sKywpN2pW7neMA0GCSqGSIb3DQEBCwUAMGkx
CzAJBgNVBAYTAkRFMQswCQYDVQQIDAJSUDEXMBUGA1UEBwwOS2Fpc2Vyc2xhdXRl
cm4xITAfBgNVBAoMGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDERMA8GA1UEAwwI
QVJDaXRlY3QwHhcNMjQwMTA4MTg0NzQwWhcNMjQwMjA3MTg0NzQwWjBpMQswCQYD
VQQGEwJERTELMAkGA1UECAwCUlAxFzAVBgNVBAcMDkthaXNlcnNsYXV0ZXJuMSEw
HwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQxETAPBgNVBAMMCEFSQ2l0
ZWN0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnvafoTKEmRhlr9s6
YscenJeR9zpuhJHD+a8dDykgpqYWZJmyaMPr6vrgCrBK2Lknbtw7CERunoofb8/B
mJxIM8E4fMWSB9k4vce8OBs9YZTawLyMYUyxgqV+QsSATs6EDfgaNPCuajjGFKoE
i5Yad5yKQaYMNePliP5dLxpB5vD1+Shl517dMxIAdqPn8tpBheYwAxucZm3+8pd2
Oy/XvByUa//XFU7xcYL6IlJBk15q6l578AAtx80Et9tYyQIHvwY+ALSBFJmU/YDa
A9e9lsrTtL3ZJi1a2lHXRe9gr0kIQ2/ioxv6wfZIYHAo5mzWHWnoPEXIE9AXIMMQ
HH74kQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAEjA8Hv3jHXqAb4MmZoHGZk1lx
7OlysJqrA2FTllq9Gvs16CVy4ocLFeLtAPwobgyiI6udT/Ei1DgE0EjDpnASk5EI
EFgV6H4K4gyLzI9G2z/GDrruRM2fKHK12pZ3tXgK7pXLGHq5t2cWlnYJVr3GcgQk
1fUwco5d6RrVW4VeiD43a5tGsoFxp6hnQDTtusXuE2B01sTTp0Tyw0jIFbbLuO+m
3HugCQmVL0X/ynKh5dgLqioDpcEH2eOTc3LGGF7/xmp668eWDetypVPPns2VmIxo
BS46Ws1/CXzYfHS71dLFljpzeKs8VY8oZxK9i2lh4si3KMqPNSU1M0eTPF38
-----END CERTIFICATE-----
`;
const https_key = `
-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCe9p+hMoSZGGWv
2zpixx6cl5H3Om6EkcP5rx0PKSCmphZkmbJow+vq+uAKsErYuSdu3DsIRG6eih9v
z8GYnEgzwTh8xZIH2Ti9x7w4Gz1hlNrAvIxhTLGCpX5CxIBOzoQN+Bo08K5qOMYU
qgSLlhp3nIpBpgw14+WI/l0vGkHm8PX5KGXnXt0zEgB2o+fy2kGF5jADG5xmbf7y
l3Y7L9e8HJRr/9cVTvFxgvoiUkGTXmrqXnvwAC3HzQS321jJAge/Bj4AtIEUmZT9
gNoD172WytO0vdkmLVraUddF72CvSQhDb+KjG/rB9khgcCjmbNYdaeg8RcgT0Bcg
wxAcfviRAgMBAAECggEAFHqbSA4VDRAakZRBqlYSuIPCV0Jc2JFa2QDZUomu3ilJ
ez5dwKd07jnRwS7DBbacwOh4ZnFCewQ6VpJCU6HWn2xGFbTyQjaW28QumF/SAY9G
u0vPHf3eZIFjicB88yoh0xbicW2MWrzjr+fTXBRDZqNxIFH/ArZQbNywLpBIazLt
uB+t8HlUDmIwq2zIKHHMVEFFHRCsjSMw70gvltySiEnxYTAA+1Ot8V8F6aif6NmG
Q7CLETzgr/5Ntx3MbnXsMLytIUGEIs5pj4wOKztMGbUJbGo4l9tDcSaup+tdwJnC
peoP3+01DUds4RPHRd7G5ygWNWavFVw1KSPkZerifQKBgQDXAGPfTdBGobPx4JmO
cmn9pA2KmdN00fubRFSMsbUMhXDvjBPOMq+shHzEoPXKxAHB4HXzURWzq+qOHekL
9KBgttdcOg/JvhZdsS51wyA7zuXRD7SyScKg9CD9MGh67TmtqpjBC5+oXKtnt0nu
eswUZ9YFfmCVmu2j2H4hxgdyowKBgQC9RqZyCZ19cMPQA+jy0/liK9dz04hyW2u/
NJRjfI7atjdnSfFdtps6dq65cQg+2noB7u2yE4ByYYg8pS4Tk2SS6L6L+Dqcdrol
gD402jfBLo6m+H1m9Qq4jXAELoLA44TPT/UgA/D3oVgINuFEhyhravVD/yY4kL0E
uLKlc7APOwKBgE2R8XaWn4dsPf0NmLlhJEaD0vLnrvgd7pZFX+/nCbg7yNRUiKzD
cshegJl8rVF7yFqHvmaMIbVSWGzv864Bk39xWGAI/rs93tns3CNWxCFv81CrRvlw
TU0+50wSFBAN2NqEi1pS9EaNMLZZ1c259jmCgSA4SWaQoB6WNGPBC9zbAoGAewa/
DYSeb3iqbjz8X0nU4TCp/ElUeTBfGossoHXHzPV/kY2Ia2dUAm4+J58GwwPzJeqN
aaAvbyliCjk7d9HoH21U3VndjvHFELcIuAXXE6QVaQY/THqeG1MjqjQpHQNFwhKw
u7yUFgEzXTN+vLI1XYzKGwZva3j4w2biB5TorR0CgYA4iUUaenMDrQrSNMiEywj8
GxT8aQcRveOngspf7c4GAxVJy32oMEzxTKenTlNfRMaziBO8CkVUWDz2hdBiXOB0
V8ZrCrmuRsBzDS3B4Vgbfi3VnwB0F/3S4P11sgwmmq8D5KmfN3bcBy8xTbI/D2VE
qZqjn4G10mEcLKSgf51iaQ==
-----END PRIVATE KEY-----
`;




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

      console.log(req.url);

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
