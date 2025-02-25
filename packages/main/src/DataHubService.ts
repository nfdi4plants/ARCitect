import {
  app,
  ipcMain,
  BrowserWindow,
  shell,
  IpcMainInvokeEvent,
} from 'electron';

import fs from 'fs';
import {InternetService} from '/@/InternetService';
import {Credentials, User, CredentialStoreType, AuthIdOnly, AuthWithSecret, Hosts} from '/@/DataHubService.d';
export type {Hosts}
import {Request, Response} from 'express';
import querystring from 'query-string';
const express = require('express');
import { createHash, randomInt} from 'crypto';
let authApp = null;
const authPort = 7890;

// alphabets for random string generation
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const ALPHANUMERIC = (ALPHABET+ALPHABET.toUpperCase()+'0123456789').split('')

/** generates sha256 hash of input word and base64 encodes it urlsafe */
function sha256Base64UrlsafeEncode(word: string){
  // sha256 hash
  let sha256Digest = createHash('sha256').update(word).digest();
  // base64 encoding
  return sha256Digest.toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '');
}

/** generates a random string for a given set of strings of a given length */
function randomString(alphabet: Array<string>, string_length: number): string {
  return Array.from({length: string_length}, (_, i) => alphabet[randomInt(alphabet.length)]).join('');
}

export const CREDENTIALS_DATAPLANT = app.getPath('userData')+'/DataHubs.json'
export const CREDENTIALS_ADDITIONAL = app.getPath('userData')+'/AdditionalDataHubs.json' 

export const CredentialStore: CredentialStoreType = {
  /** manage credentials for different datahubs */
  credential_file_dataplant: CREDENTIALS_DATAPLANT, 
  credential_file_additional: CREDENTIALS_ADDITIONAL, 
  credentials: {dataplant: {}, additional: {}},

  init: ()=>{
    // read credentials from files
    // read dataplant credentials
    CredentialStore.credentials.dataplant = JSON.parse(fs.readFileSync(CredentialStore.credential_file_dataplant, 'utf-8'));
    
    // read additional credentials if file does not exist create it and credentials are empty
    if (fs.existsSync(CredentialStore.credential_file_additional)) {
      CredentialStore.credentials.additional = JSON.parse(fs.readFileSync(CredentialStore.credential_file_additional, 'utf-8'));
    } else {
      fs.writeFileSync(CredentialStore.credential_file_additional, '{}', 'utf-8');
      CredentialStore.credentials.additional = {};
    }
  },

  getCredentials: (key: string) => {
    if (key in CredentialStore.credentials.dataplant) {
      return CredentialStore.credentials.dataplant[key];
    }
    if (key in CredentialStore.credentials.additional) {
      return CredentialStore.credentials.additional[key];
    }
    throw new Error('No credentials found for: ' + key);
  },

  credentialsExist: (key: string) => {
    return key in CredentialStore.credentials.dataplant || key in CredentialStore.credentials.additional;
  },

  addCredentials: (key: string, credentials: AuthWithSecret | AuthIdOnly) => {
    if (CredentialStore.credentialsExist(key)) {
      throw new Error('Credentials already exist for: ' + key);
    }else {
      CredentialStore.credentials.additional[key] = credentials;
      fs.writeFileSync(CredentialStore.credential_file_additional, JSON.stringify(CredentialStore.credentials.additional), 'utf-8');
    }
  },

  removeCredentials: (key: string) => {
    if ( key in CredentialStore.credentials.additional ) {
      delete CredentialStore.credentials.additional[key];
      fs.writeFileSync(CredentialStore.credential_file_additional, JSON.stringify(CredentialStore.credentials.additional), 'utf-8');
    } else {
      throw new Error('No credentials found for: ' + key);
    }
 },

  getHosts: () => {
    return {dataplant: Object.keys(CredentialStore.credentials.dataplant), additional: Object.keys(CredentialStore.credentials.additional)};
  }

  }

export const DataHubService = {

  auth_host: null,
  code_verifier: '',
  code_challenge: '',
  pkce_state: '',

  generateCodeChallenge: (): void => {
    DataHubService.pkce_state = randomString(ALPHANUMERIC, 48);
    DataHubService.code_verifier = randomString(ALPHANUMERIC.concat(['-','.','_','~']), 128);
    DataHubService.code_challenge = sha256Base64UrlsafeEncode(DataHubService.code_verifier);
  },

  getPublicationByDOI: async (e: IpcMainInvokeEvent, doi: string ) => {
    return await InternetService.getWebPageAsJson(
      null,
      {
        host: 'api.crossref.org',
        path: '/works/'+ doi,
        method: 'GET'
      }
    );
  },

  getPublicationByPubMedID: async ( e: IpcMainInvokeEvent, id: string ) => {
    return await InternetService.getWebPageAsJson(
      null,
      {
        host: 'api.ncbi.nlm.nih.gov',
        path: '/lit/ctxp/v1/pubmed/?format=csl&id=' + id,
        method: 'GET'
      }
    );
  },

  getPersonByORCID: async (e: IpcMainInvokeEvent, id: string)=>{
    return await InternetService.getWebPageAsJson(
      null,
      {
        host: 'pub.orcid.org',
        path: `/v3.0/${id}/record`,
        method: 'GET'
      }
    );
  },

  getArcs: async (e: IpcMainInvokeEvent, [host, token]:[string, string]) => {
    let arcs = [];
    const page_limit = 100;
    let n = page_limit;
    let p = 1;
    while(n==page_limit){
      const arcs_page = await InternetService.getWebPageAsJson(
        null,
        {
          host: host,
          path: `/api/v4/projects?page=${p}&per_page=${page_limit}${token ? `&access_token=${token}` : ''}`,
          method: 'GET'
        }
      );
      n = arcs_page.length;
      p++;
      arcs = arcs.concat(arcs_page);
    }
    return arcs;
  },

  inspectArc: async (e: IpcMainInvokeEvent, url: string) => {
    shell.openExternal(url);
    return;
  },

  authenticate: async (e: IpcMainInvokeEvent, host: any) => {
    if (!CredentialStore.credentialsExist(host)) return false;
    //if(!CREDENTIALS[host]) return false;
    let credentials = CredentialStore.getCredentials(host);
    DataHubService.auth_host = host;
    let auth_url = '';

    if ('secret' in credentials) {
      const url_params = {
        response_type: 'code',
        redirect_uri: 'http://localhost:7890',
        client_id: credentials.id,
        scope: `openid read_api email profile read_repository write_repository`
      };
      auth_url = `https://${host}/oauth/authorize?${querystring.stringify(url_params)}`;
    } else {
      DataHubService.generateCodeChallenge();
      const url_params = {
        response_type: 'code',
        redirect_uri: 'http://localhost:7890',
        client_id: credentials.id,
        scope: `openid read_api email profile read_repository write_repository`,
        state: DataHubService.pkce_state,
        code_challenge: DataHubService.code_challenge,
        code_challenge_method:"S256"
      };
      auth_url = `https://${host}/oauth/authorize?${querystring.stringify(url_params)}`;
    }
    shell.openExternal(auth_url);
    return true;
  },

  getToken: async ( e: IpcMainInvokeEvent | null, code: string, host: string ) => {
    if (!CredentialStore.credentialsExist(host)) return null;
    let credentials = CredentialStore.getCredentials(host);
    let path = '';

    if ('secret' in credentials) {
      const url_params = {
        code: code,
        client_id: credentials.id,
        client_secret: credentials.secret,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:7890'
      };
      path = `/oauth/token?${querystring.stringify(url_params)}`;
    } else {
      const url_params = {
        code: code,
        client_id: credentials.id,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:7890',
        code_verifier: DataHubService.code_verifier
      };
      path = `/oauth/token?${querystring.stringify(url_params)}`;
    }

    let returnvalue = await InternetService.getWebPageAsJson(
      null,
      {
        host: host,
        path: path,
        port: 443,
        method: 'POST'
      }
    );
    return returnvalue
  },

  getGroups: async ( e: IpcMainInvokeEvent, [host, token, page]: [string, string, number] ) => {
    return await InternetService.getWebPageAsJson(
        null,
        {
          host: host,
          path: `/api/v4/groups/?${querystring.stringify({
            access_token: token,
            all_available: true,
            per_page: 100,
            page: page
          })}`,
          port: 443,
          method: 'GET'
        }
      );
  },

  getUser: async ( e: IpcMainInvokeEvent | null, token: string, host: string ): Promise<User> => {
    return await InternetService.getWebPageAsJson(
        null,
        {
          host: host,
          path: `/api/v4/user/?access_token=${token}`,
          port: 443,
          method: 'GET'
        }
      );
  },

  getHosts: ()=>{
    return CredentialStore.getHosts();
  },

  addHost: ( e: IpcMainInvokeEvent, args: [string, AuthIdOnly | AuthWithSecret] ) => {
    /** add host with url and AuthData and store in config dir */
    try {
        CredentialStore.addCredentials(args[0], args[1]);
      }
    catch(err){
      throw err;
    }
  },

  
  deleteHost: ( e: IpcMainInvokeEvent, host: string ) => {
    /** delete host  by URL*/
    try {
      CredentialStore.removeCredentials(host);
    }
    catch(err){
      throw err;
    }
  },

  init: async () => {
    CredentialStore.init();

    ipcMain.handle('DataHubService.getArcs', DataHubService.getArcs );
    ipcMain.handle('DataHubService.inspectArc', DataHubService.inspectArc );
    ipcMain.handle('DataHubService.authenticate', DataHubService.authenticate );
    ipcMain.handle('DataHubService.getGroups', DataHubService.getGroups );
    ipcMain.handle('DataHubService.getPublicationByDOI', DataHubService.getPublicationByDOI );
    ipcMain.handle('DataHubService.getPublicationByPubMedID', DataHubService.getPublicationByPubMedID );
    ipcMain.handle('DataHubService.getPersonByORCID', DataHubService.getPersonByORCID );
    ipcMain.handle('DataHubService.getHosts', DataHubService.getHosts );
    ipcMain.handle('DataHubService.addHost', DataHubService.addHost );
    ipcMain.handle('DataHubService.deleteHost', DataHubService.deleteHost );

    authApp = express()
    authApp.get('/', async (req: Request, res: Response) => {
      if(!req.url || !req.url.startsWith('/?code=')){
        return res.send('Invalid Request.');
      }

      if(DataHubService.auth_host === null){
        return res.send('<h1>Authentification Failed.</h1>');
      }

      const code = req.url.split('/?code=')[1].split('&')[0];
      const token = await DataHubService.getToken(null, code, DataHubService.auth_host);

      if (token === null) {
        return res.send('<h1>Authentification Failed.</h1>');
      }

      const user = await DataHubService.getUser(null, token.access_token, DataHubService.auth_host);
      user.token = token;
      user.host = DataHubService.auth_host;

      res.send('<h1>Login and Authorization Complete. You can now return to ARCitect.</h1><script>window.close()</script>');
      let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

      if( window !== undefined){
        window.webContents.send('DataHubService.authentificationData', user);
        window.focus();
      }

    });
    authApp.listen(authPort, () => {
      console.log(`Authentification service listening on port ${authPort}`);
    });
  }

};
