import { ipcRenderer } from 'electron';
import { exposeInMainWorld } from './exposeInMainWorld';

exposeInMainWorld(
  // Allowed 'ipcRenderer' methods.
  'ipc', {
      // From render to main.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      send: (channel: string, args: any[]) => {
        ipcRenderer.send(channel, args);
      },
      // From main to render.
      // eslint-disable-next-line @typescript-eslint/ban-types
      on: (channel: string, listener: Function) => {
        ipcRenderer.on(channel, (event, ...args) => listener(...args));
      },
      off: (channel: string, listener: Function) => {
        ipcRenderer.removeListener(channel, (event, ...args) => listener(...args));
      },
      // From render to main and back again.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invoke: (channel: string, args: any[]) => {
        return ipcRenderer.invoke(channel, args);
    },
  },
);
