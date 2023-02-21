import {
  ipcMain,
  BrowserWindow
} from 'electron';
import {
  spawn
} from 'child_process';

export const ArcCommanderService = {

  run: (e,options) => {

    return new Promise( (resolve, reject) => {
      const args = typeof options === 'string' ? [options] : options.args;
      const o = typeof options === 'string' ? {} : options;

      let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
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
    // console.log(cmd,o);
    // try {
    //   const test = execSync(`arc ${cmd}`, o).toString();
    //   return [true,test];
    // } catch (e) {
    //   console.error(e);
    //   return [false,e];
    // }
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
