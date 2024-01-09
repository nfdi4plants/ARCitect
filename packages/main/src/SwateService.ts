import {
  ipcMain,
} from 'electron';

export const SwateService = {

  // Swate will try to connect to this method. If it gets a return value Swate will switch to ARCitect mode.
  EstablishConnection: async ()=>{
    return true;
  },

  init: async () => {
    ipcMain.handle('SwateService.establishConnection', SwateService.EstablishConnection );
  }
}