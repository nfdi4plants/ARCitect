import { BrowserWindow, ipcMain, dialog } from 'electron';
import PATH from 'path';
import FS from 'fs';
import FSE from 'fs-extra'
import chokidar from 'chokidar';
import util from 'util';

const changeListeners = {};

export const LocalFileSystemService = {

  readDir: (e,path) => {
    const children = [];

    const labels = FS.readdirSync(path);
    for(const l of labels){
      const stat = FS.lstatSync(PATH.join(path,l));
      if(l.startsWith('isa.') || l.startsWith('.git') || l.startsWith('.arc'))
        continue;

      stat.id = path+'/'+l;
      stat.isDirectory = stat.isDirectory();
      children.push(stat);
    }

    return children;
  },

  selectDir: async ()=>{
    const window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed())
    const result = await dialog.showOpenDialog(window, {
      properties: ['openDirectory']
    });
    return result.filePaths[0];
  },

  selectAny: async ()=>{
    const window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed())
    const result = await dialog.showOpenDialog(window, {
      properties: ['openFile','multiSelections']
    });
    return result.filePaths;
  },

  saveFile: async ()=>{
    const window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed())
    const result = await dialog.showSaveDialog(window);
    return result.filePath;
  },

  readFile: (e,path)=>{
    return FS.readFileSync(path,{encoding:'UTF-8'});
  },

  copy: async (e,[src,dst])=>{
    const name = src.split('/').pop();
    try {
      FSE.copySync(src, dst+'/'+name, { overwrite: true })
      return 1;
    } catch (err) {
      console.error(err);
      return 0;
    }
  },

  registerChangeListener: async (e,path)=>{
    // console.log('rl',path)
    changeListeners[path] = chokidar.watch(path,{ignoreInitial:true});

    const updatePath = path => {
      const window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
      window.webContents.send('LocalFileSystemService.updatePath', path);
    };
    const updateParentPath = path => {
      updatePath( path.split('/').slice(0,-1).join('/') );
    };

    changeListeners[path]
      // .on('all', (event, path) => {
      //   // console.log(event,path);
      // })
      .on('add', updateParentPath)
      .on('unlink', updateParentPath)
      .on('addDir', updateParentPath)
      .on('unlinkDir', updateParentPath)
    ;

    return;
  },

  unregisterChangeListener: async (e,path)=>{
    // console.log('ul',path)
    const watcher = changeListeners[path];
    if(!watcher)
      return;

    await watcher.unwatch();
    delete changeListeners[path];
    return;
  },

  createEmptyFile: async (e,path)=>{
    const fpath = (path.slice(-3)==='.md' || path.slice(-4)==='.txt') ? path : path +'.md';
    FS.writeFileSync(fpath,"");
    return fpath;
  },

  writeFile: async (e,[path,data])=>{
    return FS.writeFileSync(path,data,{encoding:'UTF-8'});
  },

  init: async () => {
    process.on('unhandledRejection', (reason, p) => {
      console.error(`Unhandled Rejection at: ${util.inspect(p)} reason: ${reason}`);
    });

    ipcMain.handle('LocalFileSystemService.readDir', LocalFileSystemService.readDir)
    ipcMain.handle('LocalFileSystemService.readFile', LocalFileSystemService.readFile)
    ipcMain.handle('LocalFileSystemService.writeFile', LocalFileSystemService.writeFile)
    ipcMain.handle('LocalFileSystemService.selectDir', LocalFileSystemService.selectDir)
    ipcMain.handle('LocalFileSystemService.selectAny', LocalFileSystemService.selectAny)
    ipcMain.handle('LocalFileSystemService.saveFile', LocalFileSystemService.saveFile)
    ipcMain.handle('LocalFileSystemService.copy', LocalFileSystemService.copy)
    ipcMain.handle('LocalFileSystemService.createEmptyFile', LocalFileSystemService.createEmptyFile)
    ipcMain.handle('LocalFileSystemService.registerChangeListener', LocalFileSystemService.registerChangeListener)
    ipcMain.handle('LocalFileSystemService.unregisterChangeListener', LocalFileSystemService.unregisterChangeListener)
  }
}
