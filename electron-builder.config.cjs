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
    "extraResources": [{"from": "resources/","to": "."},'git-binaries/win'],
    "target": ["zip"]
  },
  mac: {
    "extraResources": [{"from": "resources/","to": "."},'git-binaries/mac'],
    "target": ["dmg"],
    "x64ArchFiles": "*"
  },
  linux: {
    "extraResources": [{"from": "resources/","to": "."}],
    "target": ["deb"]
  }
};

module.exports = config;
