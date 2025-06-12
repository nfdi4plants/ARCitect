const path = require('path');
const express = require('express');
const swatePort = 7891;

export const SwateService = {
  init: async () => {
    const swateApp = express();
    swateApp.use(express.static((import.meta.env.DEV ? 'resources' : process.resourcesPath)+'/swate/'));
    swateApp.listen(swatePort, () => {
      console.log(`Swate service listening on port ${swatePort}`);
    });
  }
};
