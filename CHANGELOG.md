# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Types of changes**

- ✨ `Added` for new features.
- 🔄 `Changed` for changes in existing functionality.
- 🗑️ `Deprecated` for soon-to-be removed features.
- 🔥 `Removed` for now removed features.
- 🐛 `Fixed` for any bug fixes.
- 🔒 `Security` in case of vulnerabilities.

Formatting note: Use the `###` header for each type of change, and use
bulleted lists for individual changes. Add references to issues or pull requests
where applicable. Add your name in the style of `(by @github-username)` at the end of each change.

## [Unreleased]

### ✨ Added

- Added a button to the Bug Report View to open the developer console #454 (by @Thyra and @Brilator).
- Regularly check if updates are available on a remote and notify user, related to #450 (by @Thyra)

### 🐛 Fixed
- Fixed an issue where text files would be re-created after deleting them while they were open for editing #474 (by @Thyra who also caused this problem).

## 1.4.0 - 2025-12-03

### ✨ Added

- Files without view support by ARCitect will open a default view with a button allowing the user to open them with the default application. This feature was also added for all files in the context menu #455 (by @Thyra, @Freymaurer)
- Auto save changes via Markdown editor when switching files or closing Markdown editor #428 (by @Thyra)
- Added error handling for file write operations. This will now show a modal if a file could not be written to disc, instead of printing to console. This can for example happen if a file should be written that is already open in another tool. (by @Freymaurer)
- When selecting LFS files which are not downloaded yet, ARCitect will display a view explaining that and allowing the user to download the file #466 (by @Thyra)

### 🔄 Changed

- Increased file watcher timeout behavior after saving an ARC (by @Etschbeijer)
- Changed opinionated LFS behavior. LFS will now always push and never default on pul #413 #458 (by @Thyra) 
- Simplified the commit user interface a bit (by @Thyra)

### 🐛 Fixed

- Fixed issue where LFS blacklist was not being applied correctly #431, #453 (by @Thyra)
- Fixed image reading from local file system (by @Thyra)
- Fixed update verification on investigation files (by @Freymaurer)
- Fixed swate view update after external file changes to correctly reflect changes (by @Freymaurer)

## 1.3.2 - 2025-11-20

### ✨ Added

- Last release before start of Changelog
