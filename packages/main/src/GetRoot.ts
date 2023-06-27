import PATH from 'path';

import os from 'os';

const getBinRoot = ()=>{

  const electronRoot = PATH.join(__dirname, '..', '..', '..');

  let platform = null;

  switch (os.platform()) {
    case 'win32':
      return PATH.join(electronRoot, 'resources', 'bins', 'win');
    case 'darwin':
      break;
    case 'linux':
      return PATH.join(electronRoot, 'resources', 'bins', 'win');
  }

  // if (isPackaged) {
  //   const packagedNodeModulesPath = '/node_modules/electron-root-path/lib';

  //   let dirname = __dirname;
  //   if (!doesStringEndsWith(dirname, packagedNodeModulesPath)) {
  //     dirname = path.join(__dirname, packagedNodeModulesPath);
  //   }

  //   // renderer and main process - packaged build
  //   if (electronEnv.isWindows) {
  //     // windows platform
  //     rootPath = path.join(dirname, '..', '../../../../');
  //   } else {
  //     // non windows platform
  //     rootPath = path.join(dirname, '..', '../../../../../');
  //   }
  // } else if (IS_PROD) {
  //   // renderer and main process - prod build
  //   if (electronEnv.isRenderer) {
  //     // renderer process - prod build
  //     rootPath = path.join(__dirname, '..', '..', '..');
  //   } else if (!module.parent) {
  //     // main process - prod build (case: run "start")
  //     rootPath = path.join(__dirname, '..', '..', '..');
  //   } else {
  //     // main process - prod (case: run "build")
  //     rootPath = path.join(__dirname, '..', '..', '..');
  //   }
  // } else if (electronEnv.isRenderer) {
  //   // renderer process - dev build
  //   rootPath = path.join(__dirname, '..', '..', '..');
  // } else {
  //   // main process - dev build
  //   rootPath = path.join(__dirname, '..', '..', '..');
  // }
}

export default getElectronRoot;
