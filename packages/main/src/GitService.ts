import {
  ipcMain,
  BrowserWindow
} from 'electron';
import { spawn } from 'child_process';
import FS from 'fs';
import {LocalFileSystemService} from './LocalFileSystemService.ts';

const PATH = require('path');


export const GitService = {
  queue: [],
  processing: false,

  process: ()=>{
    if(GitService.queue.length<1){
      GitService.processing = false;
      return;
    }

    const [args,o,resolve] = GitService.queue.shift();
    console.log(GitService.queue.length, 'git '+args.join(' '));

    let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
    window.webContents.send('GitService.MSG', 'git '+args.join(' '));

    try {
      const p = spawn('git', args, o);

      let error = false;
      let output = '';
      if(o.pipe) {
        console.log(o.pipe)
        LocalFileSystemService.enforcePath(null,o.pipe.split('/').slice(0,-1).join('/'));
        const write_stream = FS.createWriteStream(o.pipe, {flags: 'w'});
        p.stdout.pipe(write_stream);
        p.stderr.pipe(write_stream);
      } else {
        const handleOutput = data => {
          if(!data) return;
          let dataAsString = data.toString();
          dataAsString = dataAsString.replace(/\n|\r/g, '\n');

          output += dataAsString;
          if(dataAsString.toLowerCase().includes('error'))
            error = true;

          for(let row of dataAsString.split('\n')){
            if(row==='' || o.silent) continue;
            window.webContents.send('GitService.MSG', row);
          }
        };
        p.stdout.on('data', handleOutput);
        p.stderr.on('data', handleOutput);
      }

      // This hits when the child process cannot be spawned
      p.on('error', err => {
          console.error("[Git spawn error]", err.toString());
          resolve([false, err.toString()]);
          GitService.process();
      });
      // This hits whenever process can be spawned, can still fail or resolve.
      p.on('exit', code => {
        resolve([code===0 && !error,output]);
        GitService.process();
      });
    } catch (e){
      resolve([false,e]);
      GitService.process();
    }
  },

  run: (e,options) => {

    return new Promise( (resolve, reject) => {
      let args = typeof options === 'string' ? [options] : options.args;
      const o = typeof options === 'string' ? {} : options;
      o.env = Object.assign({}, o.env || {}, process.env);

      // adjust terminal prompts
      o.env['GIT_TERMINAL_PROMPT']=0;
      o.env['GIT_ASKPASS']=true;
      o.env['GIT_LFS_FORCE_PROGRESS']=1;
      o.detached=false;
      o.shell = true;

      if(o.debug){
        o.env['GIT_TRACE'] = 1;
        o.env['GIT_CURL_VERBOSE'] = 1;
      }

      o.cwd = (o.cwd || '').split('/').join(PATH.sep);

      GitService.queue.push([args, o, resolve]);
      if(!GitService.processing){
        GitService.processing = true;
        GitService.process();
      }
    });
  },

  init: async () => {
    ipcMain.handle('GitService.run', GitService.run );
  }
};
