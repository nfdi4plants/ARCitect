import {
  ipcMain,
  BrowserWindow
} from 'electron';
import { spawn } from 'child_process';
import os from 'os';

const PATH = require('path');

// import getRoot from '/@/GetRoot';
// const binRoot = getRoot()
// console.log(binRoot)

export const ArcCommanderService = {

  getExecEnvironment: ()=>{
    let env = process.env;
    if(process.env['MODE']){
      switch (os.platform()) {
        case 'win32':
          break;
        case 'darwin':
          break;
        case 'linux':
          env['PATH'] = env['PATH'].concat(":", PATH.join(process.cwd(), 'bins', 'linux'));
          break;
      }
    } else {
      switch (os.platform()) {
        case 'win32':
          // env['PATH'] = env['PATH'].concat(";", PATH.join(config.arc_commander.path, "PortableGit\\bin"));
          env['PATH'] = env['PATH'].concat(";", PATH.join(process.resourcesPath, 'bins', 'win'));
          env['PATH'] = env['PATH'].concat(";", PATH.join(process.resourcesPath, 'bins', 'win', 'PortableGit', 'cmd'));
          break;
        case 'darwin':
          break;
        case 'linux':
          env['PATH'] = env['PATH'].concat(":", PATH.join(process.resourcesPath, 'bins', 'linux'));
          break;
      }
    }

    return env;
  },

  run: (e,options) => {

    return new Promise( (resolve, reject) => {
      const args = typeof options === 'string' ? [options] : options.args;
      const o = typeof options === 'string' ? {} : options;
      o.env = ArcCommanderService.getExecEnvironment();

      let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
      window.webContents.send('ArcCommanderService.MSG', JSON.parse(JSON.stringify(o.env)));

      const p = spawn('arc', args, o);
      let error = false;
      let output = '';
      p.stdout.on('data', data => {
        const dataAsString = data.toString();
        output += dataAsString;
        if(dataAsString.toLowerCase().includes('error'))
          error = true;
        window.webContents.send('ArcCommanderService.MSG', dataAsString);
      });

      p.stderr.on('data', data => {
        error = true;
        const dataAsString = data.toString();
        output += dataAsString;
        console.error('e',dataAsString);
        window.webContents.send('ArcCommanderService.MSG', dataAsString);
      });

      p.on('error', err => {
        console.error(err.toString());
        resolve([false,err.toString()]);
      });

      p.on('exit', code => {
        resolve([code===0 && !error,output]);
      });
    });
  },

  // isReady: async ()=>{
  //   const status = await ArcCommanderService.run('--version');
  //   return status[0];
  // },

  // getArc: async data=>{
  //   // const status = await ArcCommanderService.run('--version');
  //   // return status[0];
  // },

  init: async () => {
    // ipcMain.handle('ArcCommanderService.isReady', ArcCommanderService.isReady );
    ipcMain.handle('ArcCommanderService.run', ArcCommanderService.run );
  }
};
