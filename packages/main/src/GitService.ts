import {
  ipcMain,
  BrowserWindow
} from 'electron';
import { spawn } from 'child_process';

const PATH = require('path');

export const GitService = {

  run: (e,options) => {

    return new Promise( (resolve, reject) => {
      const args = typeof options === 'string' ? [options] : options.args;
      const o = typeof options === 'string' ? {} : options;
      o.env = Object.assign({}, o.env || {}, process.env);
      o.cwd = (o.cwd || '').split('/').join(PATH.sep);

      let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
      window.webContents.send('GitService.MSG', 'git '+args.join(' '));

      // o.env['GIT_TRACE'] = 1;
      // o.env['GIT_TRACE_PACKET'] = 1;
      // o.env['GIT_TRACE_PERFORMANCE'] = 1;
      // o.env['GIT_TRACE_SETUP'] = 1;
      // o.env['GIT_CURL_VERBOSE'] = 1;
      // o.env['GIT_TRANSFER_TRACE'] = 1;
      // o.stdio = 'inherit';


      // console.log(args, o)
      const p = spawn('git', args, o);

      let error = false;
      let output = '';
      let iii=0;
      const handleOutput = data => {
        if(!data) return;
        let dataAsString = data.toString();
        dataAsString = dataAsString.replace(/\n|\r/g, '\n');

        output += dataAsString;
        if(dataAsString.toLowerCase().includes('error'))
          error = true;

        for(let row of dataAsString.split('\n')){
          if(row==='') continue;
          window.webContents.send('GitService.MSG', row);
          // iii++;
          // console.log(">"+iii+">"+row+"<"+iii+"<");
        }
      };
      p.stdout.on('data', handleOutput);
      p.stderr.on('data', handleOutput);

      p.on('error', err => {
        console.error(err.toString());
      });

      p.on('exit', code => {
        resolve([code===0 && !error,output]);
      });
    });
  },

  init: async () => {
    ipcMain.handle('GitService.run', GitService.run );
  }
};
