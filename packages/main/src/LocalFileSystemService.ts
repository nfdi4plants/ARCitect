import { BrowserWindow, ipcMain, dialog } from 'electron';
import PATH from 'path';
import FS from 'fs';
import chokidar from 'chokidar';
import util from 'util';

let uniqueLabelCounter = 0;

const changeListeners = {};

export const LocalFileSystemService = {

  readDir: (e,path) => {
    const labels = FS.readdirSync(path);
    const children = [];
    const parent = path.split('/').pop().toLowerCase();
    const isSARW = l=>{
      return ['studies','assays'].includes(l)
    };
    const sarwMap = {
      'studies': 'Study',
      'assays': 'Assay'
    };

    for(const l of labels){
      const stat = FS.lstatSync(PATH.join(path,l));
      if(l.startsWith('isa.') || l.startsWith('.git') || l.startsWith('.arc'))
        continue;

      stat.label = l;
      stat.isDirectory = stat.isDirectory();
      stat.lazy = stat.isDirectory;
      if(isSARW(parent)){
        stat.type = 'node_edit_'+sarwMap[parent];
        stat.icon = 'edit_square';
        stat.selectable = true;
      // } else if(isSARW(l)){
      //   stat.type = 'node_add_'+sarwMap[l];
      //   stat.icon = 'add_box';
      //   stat.selectable = true;
      } else {
        stat.selectable = false;
        stat.type = 'node';
      }
      stat.id = path+'/'+stat.label;
      children.push(stat);
    }

    if(isSARW(parent)){
      children.push({
        type: 'node_add_'+sarwMap[parent],
        label: 'Add '+sarwMap[parent],
        isDirectory: false,
        lazy: false,
        icon: 'add_box',
        id: path+'/'+'add$'+(uniqueLabelCounter++),
        selectable: true
      });
    }

    if(children.length<1){
      children.push({
        type: 'empty',
        label: 'empty',
        isDirectory: false,
        lazy: false,
        icon: 'block',
        id: path+'/'+'empty$'+(uniqueLabelCounter++),
        selectable: false
      });
    }

    children.sort((a,b)=>{
      if(a.isDirectory && !b.isDirectory){
        return -1;
      } else if (!a.isDirectory && b.isDirectory){
        return 1;
      }
      return a.label.localeCompare(b.label);
    });

    return children;
  },

  selectDir: async ()=>{
    const window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed())
    const result = await dialog.showOpenDialog(window, {
      properties: ['openDirectory']
    });
    return result.filePaths[0];
  },

  saveFile: async ()=>{
    const window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed())
    const result = await dialog.showSaveDialog(window);
    return result.filePath;
  },

  readFile: (e,path)=>{
    return FS.readFileSync(path,{encoding:'UTF-8'});
  },

  registerChangeListener: async (e,path)=>{
    console.log('rl',path)
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
    console.log('ul',path)
    const watcher = changeListeners[path];
    if(!watcher)
      return;

    await chokidar.unwatch();
    delete changeListeners[path];
    return;
  },

  init: async () => {
    process.on('unhandledRejection', (reason, p) => {
      console.error(`Unhandled Rejection at: ${util.inspect(p)} reason: ${reason}`);
    });

    ipcMain.handle('LocalFileSystemService.readDir', LocalFileSystemService.readDir)
    ipcMain.handle('LocalFileSystemService.readFile', LocalFileSystemService.readFile)
    ipcMain.handle('LocalFileSystemService.selectDir', LocalFileSystemService.selectDir)
    ipcMain.handle('LocalFileSystemService.saveFile', LocalFileSystemService.saveFile)
    ipcMain.handle('LocalFileSystemService.registerChangeListener', LocalFileSystemService.registerChangeListener)
    ipcMain.handle('LocalFileSystemService.unregisterChangeListener', LocalFileSystemService.unregisterChangeListener)
  }
}
