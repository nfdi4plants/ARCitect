# ARCitect

The **ARCitect** is a cross-platform app to create and manage your **ARCs** and synchronize them with the **DataHUB**.

## Installation

1. Navigate to the [releases page](https://github.com/nfdi4plants/ARCitect/releases/latest)
2. From ****Assets**** download the appropriate installer for your operating system.

    - **Windows**:  ARCitect-x.x.xx-win.zip
    - **macOS**: ARCitect-x.x.xx-universal.dmg
    - **Linux**: ARCitect-x.x.xx_amd64.deb

3. Follow the installation instructions in the [Knowledge Base](https://nfdi4plants.org/nfdi4plants.knowledgebase/arcitect).

## Building from source

To build ARCitect from source you need to have <a href="https://nodejs.org/en/download" target="_blank">Node.js</a>, <a href="https://git-scm.com/downloads" target="_blank">Git</a> and <a href="https://git-lfs.github.com/" target="_blank">Git LFS</a> installed first.

1. Clone this repository and install its dependencies via npm
```bash
git clone https://github.com/nfdi4plants/ARCitect
cd ARCitect
npm install
```

2. Start the app in debugging mode

```bash
npm start
```

3. (optional) Compile the app for your operating system

```bash
npm run compile # for linux
npm run compilew # for windows
npm run compilem # for mac    
```

The compiled installer is created in `dist/`.

## Contribution

The following quick guide is intended to help content contributors find a starting point.

### Issues

Feel free to [raise an issue](https://github.com/nfdi4plants/ARCitect/issues/new/choose) to let us know what feature is missing or if anything is buggy.

### Pull requests welcome

Please feel free to propose changes and fixes via pull requests.
ARCitect builds on [ARCtrl](https://github.com/nfdi4plants/ARCtrl) and integrates [Swate](https://github.com/nfdi4plants/Swate). So please check out these repositories as well.

#### Release

1. Increase `package.json` semver.
2. (OPTIONAL) Update `TAG_NAME` in `scripts/downloadSwate.sh` to the latest Swate release tag.
2. Commit and push any changes!
2. Any commit with release tag `git tag <Placeholder>`, where `<Placeholder>` must be equal to `package.json` version, will trigger release pipeline in GitHub actions.
3. Push tag with `git push origin <Placeholder>`.

#### Help texts

Changes to the help texts can be adjusted in the corresponding document located in the following folder: 

[packages/renderer/src/docs](packages/renderer/src/docs)

#### Images

Relevant images can be placed in the following folder:

[packages/renderer/assets](packages/renderer/assets)

:bulb: Images currently occupy 100% of the width of the help text window.
