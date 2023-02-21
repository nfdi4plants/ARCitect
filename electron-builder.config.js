/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  asar: true,
  directories: {
    output: 'dist',
    buildResources: 'buildResources',
  },
  files: [
    'packages/**/dist/**',
  ],
  win: {
    "target": ["portable"],
  },
  mac: {
    "target": ["dmg"],
  },
  linux: {
    "target": ["AppImage"]
  }
};

module.exports = config;
