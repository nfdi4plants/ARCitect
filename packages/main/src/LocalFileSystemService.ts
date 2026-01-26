import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import PATH from 'path';
import FS from 'fs';
import FSP from 'fs/promises';
import FSE from 'fs-extra';
import chokidar from 'chokidar';
import util from 'util';
import os from 'os';
// @ts-ignore
import mime from 'mime-types';
import ExifReader from 'exifreader';
import { DOMParser } from '@xmldom/xmldom';

// Provide global DOMParser for ExifReader (needed for XMP)
(global as any).DOMParser = DOMParser;

const changeListeners = new Map<string, chokidar.FSWatcher>();

const path_to_arcitect = (path: string) => path.split(PATH.sep).join('/');
const path_to_system = (path: string) => path.split('/').join(PATH.sep);

export const LocalFileSystemService = {
  LFS_POINTER_HEADER: 'version https://git-lfs.github.com/spec/',

  getAllXLSX_: (files, directory) => {
    const filesInDirectory = FS.readdirSync(directory);
    for (const file of filesInDirectory) {
      const absolute = PATH.join(directory, file);
      if (FS.statSync(absolute).isDirectory()) {
        LocalFileSystemService.getAllXLSX_(files, absolute);
      } else if (file.endsWith('.xlsx')) {
        files.push(absolute);
      }
    }
  },

  getAllXLSX: async (e, root) => {
    root = path_to_system(root);
    let xlsx_files = [];
    LocalFileSystemService.getAllXLSX_(xlsx_files, root);
    return xlsx_files.map(p => path_to_arcitect(p.replace(root + PATH.sep, '')));
  },

  getAllFiles: async (e, root) => {
    return FS.readdirSync(root, { recursive: true });
  },

  // isLFSPointer: async path => {
  //   const buffer = Buffer.alloc(LocalFileSystemService.LFS_POINTER_HEADER.length + 4);
  //   let fileHandle;
  //   try {
  //     fileHandle = await FSP.open(path, 'r');
  //     const { bytesRead } = await fileHandle.read(buffer, 0, buffer.length, 0);
  //     const content = buffer.toString('utf8', 0, bytesRead);
  //     return content.startsWith(LocalFileSystemService.LFS_POINTER_HEADER);
  //   } catch (err) {
  //     return false;
  //   } finally {
  //     if (fileHandle) await fileHandle.close();
  //   }
  // },

  readDir: async (e, path) => {
    path = path_to_system(path);
    const children = [];

    const labels = FS.readdirSync(path);
    for (const l of labels) {
      const path_ = PATH.join(path, l);
      const stat = FS.lstatSync(path_);
      if (
        (l.startsWith('isa.') && !l.endsWith('datamap.xlsx')) ||
        (l.startsWith('.git') && l !== '.gitignore' && l !== '.gitattributes') ||
        l.startsWith('.arc') ||
        l.startsWith('.DS_Store')
      )
        continue;

      stat.id = path_to_arcitect(path_);
      stat.isDirectory = stat.isDirectory();
      stat.isLFSPointer = false;
      // if(!stat.isDirectory)
      //   stat.isLFSPointer = await LocalFileSystemService.isLFSPointer(path_);

      children.push(stat);
    }

    return children;
  },

  selectDir: async (e, [title, message]) => {
    const window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
    const result = await dialog.showOpenDialog(window, {
      title: title,
      message: message,
      properties: ['openDirectory'],
      defaultPath: LocalFileSystemService.arc_root,
    });
    const path = result.filePaths[0];
    return path ? path_to_arcitect(path) : null;
  },

  selectAnyFiles: async (options: Electron.OpenDialogOptions = {}) => {
    options.properties = options.properties || ['openFile', 'multiSelections'];
    options.defaultPath = options.defaultPath || LocalFileSystemService.arc_root;
    const window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
    const result = await dialog.showOpenDialog(window, options);
    return result ? result.filePaths.map(path_to_arcitect) : null;
  },

  selectAnyDirectories: async (options: Electron.OpenDialogOptions = {}) => {
    options.properties = options.properties || ['openDirectory', 'multiSelections'];
    options.defaultPath = options.defaultPath || LocalFileSystemService.arc_root;
    const window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
    const result = await dialog.showOpenDialog(window, options);
    return result ? result.filePaths.map(path_to_arcitect) : null;
  },

  saveFile: async () => {
    const window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
    const result = await dialog.showSaveDialog(window, {
      defaultPath: LocalFileSystemService.arc_root,
    });
    return path_to_arcitect(result.filePath);
  },

  readFile: (e, parameters) => {
    let path = null;
    let options = { encoding: 'UTF8' };
    if (typeof parameters === 'string') {
      path = parameters;
    } else {
      path = parameters[0];
      options = parameters[1];
    }
    path = path_to_system(path);
    try {
      return FS.readFileSync(path, options);
    } catch (err) {
      return null;
    }
  },

  selectAndReadFile: async (_event: any) => {
    const window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
    const dialogResult = await dialog.showOpenDialog(window!, {
      properties: ['openFile'],
      defaultPath: LocalFileSystemService.arc_root,
    });

    if (dialogResult.canceled) return;

    const path = dialogResult.filePaths[0];
    const stats = FS.statSync(path);
    const content = FS.readFileSync(path, 'utf-8');
    const mimeType = mime.lookup(path);

    const fileInfo = {
      name: path_to_arcitect(path),
      size: stats.size,
      content: content,
      mimetype: mimeType || '',
    };

    return fileInfo;
  },

  readConfig: () => {
    const config = LocalFileSystemService.readFile(null, app.getPath('userData') + '/ARCitect.json');
    return JSON.parse(config as string) || {};
  },

  writeConfig: (e, config) => {
    LocalFileSystemService.writeFile(null, [app.getPath('userData') + '/ARCitect.json', config]);
  },

  readImage: async (e, path) => {
    try {
      path = path_to_system(path);

      const mimeType = mime.lookup(path);
      if (!mimeType || !mimeType.startsWith('image/')) return null;

      const imageData = FS.readFileSync(PATH.resolve(path));
      const base64 = imageData.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64}`;

      // Parse metadata (EXIF + XMP)
      let metadata = {};

      try {
        metadata = ExifReader.load(imageData, { expanded: true });
      } catch (err) {
        console.warn('Metadata parsing of image failed:', err);
        metadata = {};
      }

      const sortDirs = ['exif', 'xmp']; // array defining sort priority
      const filterDirs = ['Thumbnail']; // dirs to remove entirely
      const filterTags = { xmp: ['_raw'] }; // { dirName: [tags...] }

      let processed = {};

      // ---- 1. FILTER DIRECTORIES ----
      for (const [dirName, tags] of Object.entries(metadata)) {
        const lower = dirName.toLowerCase();

        if (filterDirs.map(d => d.toLowerCase()).includes(lower)) continue; // skip entire directory

        processed[dirName] = { ...tags };
      }

      // ---- 2. FILTER TAGS INSIDE DIRECTORIES ----
      for (const [dirName, tags] of Object.entries(processed)) {
        const lower = dirName.toLowerCase();

        if (filterTags[lower]) {
          const filteredSet = new Set(filterTags[lower].map(t => t.toLowerCase()));

          for (const tagName of Object.keys(tags)) {
            if (filteredSet.has(tagName.toLowerCase())) {
              delete processed[dirName][tagName];
            }
          }
        }
      }

      // ---- 3. SORT DIRECTORIES ----
      // convert to entries array to allow ordering
      let entries = Object.entries(processed).map(([name, tags]) => ({
        name,
        tags,
      }));

      entries.sort((a, b) => {
        const aIndex = sortDirs.indexOf(a.name.toLowerCase());
        const bIndex = sortDirs.indexOf(b.name.toLowerCase());

        const aRank = aIndex === -1 ? 999 : aIndex;
        const bRank = bIndex === -1 ? 999 : bIndex;

        if (aRank !== bRank) return aRank - bRank;

        return a.name.localeCompare(b.name);
      });

      // Convert back to object if needed
      const sortedMetadata = {};
      for (const e of entries) sortedMetadata[e.name] = e.tags;

      return {
        dataUrl,
        metadata: sortedMetadata,
      };
    } catch (err) {
      console.error('Error:', err.message);
      return null;
    }
  },

  copy: async (e, [src, dst]) => {
    src = path_to_system(src);
    dst = path_to_system(dst);
    try {
      FSE.copySync(src, PATH.join(dst, PATH.basename(src)), {
        overwrite: true,
      });
      return 1;
    } catch (err) {
      console.error(err);
      return 0;
    }
  },

  registerChangeListener: async (e, path) => {
    path = path_to_system(path);

    if (changeListeners.has(path)) await LocalFileSystemService.unregisterChangeListener(null, path);
    const listener = chokidar.watch(path, {
      ignoreInitial: true,
      usePolling: os.platform() === 'win32',
    });
    changeListeners.set(path, listener);

    const updatePath = async (path, type) => {
      const window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
      window?.webContents.send('LocalFileSystemService.updatePath', [path_to_arcitect(path), type]);
    };

    listener
      .on('add', path => updatePath(path, 'file_add'))
      .on('unlink', path => updatePath(path, 'file_rm'))
      .on('change', path => updatePath(path, 'file_ch'))
      .on('addDir', path => updatePath(path, 'dir_add'))
      .on('unlinkDir', path => updatePath(path, 'dir_rm'));

    return;
  },

  unregisterChangeListener: async (e, path) => {
    // console.log('ul',path)
    path = path_to_system(path);
    const watcher = changeListeners.get(path);
    if (!watcher) return;

    await watcher.unwatch(path);
    changeListeners.delete(path);
    return;
  },

  createEmptyFile: async (e, path) => {
    path = path_to_system(path);
    const fpath = path.slice(-3) === '.md' || path.slice(-4) === '.txt' ? path : path + '.md';
    FS.writeFileSync(fpath, '');
    return fpath;
  },

  enforcePath: async (e, path) => {
    try {
      FS.mkdirSync(path_to_system(path), { recursive: true });
    } catch (err) {}
  },

  writeFile: async (e, [path, data, options]): Promise<Result<string>> => {
    options = options || { encoding: 'UTF-8' };
    path = path_to_system(path);
    FS.mkdirSync(PATH.dirname(path), { recursive: true });
    if (data === '' && FS.existsSync(path))
      return {
        ok: false,
        error: 'File already exists and empty data was provided.',
      };
    try {
      FS.writeFileSync(path, data, options);
      return { ok: true };
    } catch (err) {
      let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
      const r = { ok: false, error: String(err) };
      window?.webContents.send('CORE.Error', r);
      return r;
    }
  },

  getPathSeparator: async e => {
    return PATH.sep;
  },

  getFileSizes: async (e, file_paths) => {
    const sizes = [];
    for (let file_path of file_paths) {
      file_path = path_to_system(file_path);
      let size = 0;
      try {
        size = FS.statSync(file_path).size;
      } catch {}
      sizes.push(size);
    }
    return sizes;
  },

  rename: async (e, [oldPath, newPath]) => {
    try {
      FS.renameSync(oldPath, newPath);
      return true;
    } catch {
      return false;
    }
  },

  exists: async (e, path) => {
    try {
      FS.statSync(path_to_system(path));
      return true;
    } catch {
      return false;
    }
  },

  remove: (e, path) => {
    try {
      FS.rmSync(path_to_system(path), { recursive: true, force: true });
      return true;
    } catch {
      return false;
    }
  },

  openPath: async (e, path: string) => {
    path = path_to_system(path);
    try {
      shell.openPath(path);
      return true;
    } catch {
      return false;
    }
  },

  setArcRoot: async (e, path: string) => {
    LocalFileSystemService.arc_root = path_to_system(path);
  },

  openFileNative: async (e: Electron.IpcMainInvokeEvent, path: string): Promise<Result<string>> => {
    const p = path_to_system(path);

    try {
      const err = await shell.openPath(p);

      // openPath returns "" on success, otherwise a *string error message*
      if (err === '') {
        return { ok: true };
      } else {
        return { ok: false, error: err };
      }
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },

  init: async () => {
    process.on('unhandledRejection', (reason, p) => {
      console.error(`Unhandled Rejection at: ${util.inspect(p)} reason: ${reason}`);
    });
    ipcMain.handle('LocalFileSystemService.openFileNative', LocalFileSystemService.openFileNative);
    ipcMain.handle('LocalFileSystemService.remove', LocalFileSystemService.remove);
    ipcMain.handle('LocalFileSystemService.readDir', LocalFileSystemService.readDir);
    ipcMain.handle('LocalFileSystemService.readFile', LocalFileSystemService.readFile);
    ipcMain.handle('LocalFileSystemService.selectAndReadFile', LocalFileSystemService.selectAndReadFile);
    ipcMain.handle('LocalFileSystemService.readImage', LocalFileSystemService.readImage);
    ipcMain.handle('LocalFileSystemService.readConfig', LocalFileSystemService.readConfig);
    ipcMain.handle('LocalFileSystemService.writeConfig', LocalFileSystemService.writeConfig);
    ipcMain.handle('LocalFileSystemService.enforcePath', LocalFileSystemService.enforcePath);
    ipcMain.handle('LocalFileSystemService.writeFile', LocalFileSystemService.writeFile);
    ipcMain.handle('LocalFileSystemService.selectDir', LocalFileSystemService.selectDir);
    ipcMain.handle('LocalFileSystemService.selectAnyFiles', LocalFileSystemService.selectAnyFiles);
    ipcMain.handle('LocalFileSystemService.selectAnyDirectories', LocalFileSystemService.selectAnyDirectories);
    ipcMain.handle('LocalFileSystemService.saveFile', LocalFileSystemService.saveFile);
    ipcMain.handle('LocalFileSystemService.copy', LocalFileSystemService.copy);
    ipcMain.handle('LocalFileSystemService.createEmptyFile', LocalFileSystemService.createEmptyFile);
    ipcMain.handle('LocalFileSystemService.registerChangeListener', LocalFileSystemService.registerChangeListener);
    ipcMain.handle('LocalFileSystemService.unregisterChangeListener', LocalFileSystemService.unregisterChangeListener);
    ipcMain.handle('LocalFileSystemService.getPathSeparator', LocalFileSystemService.getPathSeparator);
    ipcMain.handle('LocalFileSystemService.getAllXLSX', LocalFileSystemService.getAllXLSX);
    ipcMain.handle('LocalFileSystemService.getAllFiles', LocalFileSystemService.getAllFiles);
    ipcMain.handle('LocalFileSystemService.getFileSizes', LocalFileSystemService.getFileSizes);
    ipcMain.handle('LocalFileSystemService.exists', LocalFileSystemService.exists);
    ipcMain.handle('LocalFileSystemService.openPath', LocalFileSystemService.openPath);
    ipcMain.handle('LocalFileSystemService.rename', LocalFileSystemService.rename);
    ipcMain.handle('LocalFileSystemService.setArcRoot', LocalFileSystemService.setArcRoot);
  },
};
