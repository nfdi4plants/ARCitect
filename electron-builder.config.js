/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  asar: true,
  directories: {
    output: 'dist',
    buildResources: 'resources',
  },
  files: [
    'packages/**/dist/**',
  ],
  win: {
    "extraResources": ['bins/win'],
    // "target": ["portable"],
    // "target": ["dir"],
    "target": ["zip"],
  },
  mac: {
    "target": ["dmg"],
  },
  linux: {
    "extraResources": 'bins/linux',
    "target": ["AppImage"]
  }
};

module.exports = config;
