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
    "extraResources": ['bins/git-binaries-win'],
    "target": ["zip"]
  },
  mac: {
    "target": ["dmg"]
  },
  linux: {
    "target": ["AppImage"]
  }
};

module.exports = config;
