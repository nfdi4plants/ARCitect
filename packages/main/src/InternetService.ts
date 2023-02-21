import {
  ipcMain,
  shell
} from 'electron';

export const InternetService = {

  openExternalURL: async (e,url)=>{
    shell.openExternal(url);
    return;
  },

  init: async () => {
    ipcMain.handle('InternetService.openExternalURL', InternetService.openExternalURL );
  }

};
