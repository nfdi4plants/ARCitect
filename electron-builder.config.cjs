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
    "extraResources": ['git-binaries/win'],
    "target": ["zip"]
  },
  mac: {
    "extraResources": ['git-binaries/mac'],
    "target": ["dmg"],
    "x64ArchFiles": "*"
  },
  linux: {
    "target": ["AppImage"]
  }
};

module.exports = config;
