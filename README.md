# ARCitect

The **ARCitect** is an **electron-app** to create, manage and share your **ARCs**.

:construction: Note, that the **ARCitect** is currently being developed and not ready for standard users, yet. :construction: 

## Installation

It is only necesary to download and run one of the provided standalone **Releases** for **Windows** (suffix: win.zip), **MacOS** (suffix: dmg), and **Linux** (suffix: AppImage). The releases do not require you to install any dependencies (except `git` for the MacOS and Linux releases).

:bulb: Check out the [DataPLANT knowledge base](https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/ARCitect-Manual/index.html) for details.

## Building from Source 

To build ARCitect from source, you first need to clone this repository, then install its dependencies via npm, and finally start ARCitect via npm, i.e.,
```
git clone https://github.com/nfdi4plants/ARCitect
cd ARCitect
npm install
npm start
```

## Contribution

The following quick guide is intended to help content contributors find a starting point.

### Release 

1. Increase `package.json` semver.
2. Any commit with release tag `git tag <Placeholder>`, where `<Placeholder>` must be equal to `package.json` version, will trigger release pipeline in GitHub actions.
3. Push tag with `git push --follow-tags`

### Issues

Feel free to [raise an issue](https://github.com/nfdi4plants/ARCitect/issues/new/choose) to let us know what feature is missing or if anything is buggy.

### Help texts

Changes to the help texts can be adjusted in the corresponding document located in the following folder: 

[packages/renderer/src/docs](packages/renderer/src/docs)

### Images

Relevant images can be placed in the following folder: 

[packages/renderer/assets](packages/renderer/assets)

:bulb: Images currently occupy 100% of the width of the help text window.
