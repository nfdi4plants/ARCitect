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

      // let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

      const p = spawn('git', args, o);
      let error = false;
      let output = '';
      const handleOutput = data => {
        if(!data) return;
        const dataAsString = data.toString();
        // console.log(dataAsString);
        output += dataAsString;
        if(dataAsString.toLowerCase().includes('error'))
          error = true;
        // window.webContents.send('GitService.MSG', dataAsString);
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
