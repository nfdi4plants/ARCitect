# ARCitect

The **ARCitect** is a cross-platform app to create and manage your **ARCs** and synchronize them with the **DataHUB**.

## Installation

To install ARCitect, navigate to the [releases page](https://github.com/nfdi4plants/ARCitect/releases/latest), and from ****Assets**** download the appropriate installer for your operating system. Open the installer and follow the instructions.

- **Windows**:  ARCitect-x.x.xx-win.zip
- **MacOS** ARCitect-x.x.xx-universal.dmg
- **Linux**: ARCitect-x.x.xx.AppImage
    <details>
    <summary>Installation on <b>Linux</b> might require additional steps</summary>

    #### Install Git dependencies

    ARCitect depends on [git](https://git-scm.com/download/linux) and [git-lfs](https://github.com/git-lfs/git-lfs/blob/main/INSTALLING.md). Please follow the linked guides for installation. 
    
    #### Make the ARCitect installer executable
    
    ##### (A) with the user interface
    
    - right-click the file and select properties
    - go to the "permissions" tab and tick the field "execute"
    - now double-clicking the AppImage should start the ARCitect
    
    ##### (B) from the command line (you might need specific rights for this)
    
    - open a terminal
    - move to the directory where you have saved your AppImage (e.g. Downloads)
    ```
    cd Downloads
    ```
    - make the file executable (use the appropriate name of the file)
    ```
    chmod u+x ARCitect-x.x.xx.AppImage
    ```
    - now double-clicking the AppImage should start the ARCitect
    
    </details>

:bulb: For more detailed instructions and ARCitect QuickStarts, please checkout the [DataPLANT Knowledge Base](https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/ARCitect-Manual/index.html).

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
