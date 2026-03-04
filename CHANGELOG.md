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

## 1.6.1 - 2026-03-04

### 🐛 Fixed

- Improve filewatcher handling when ARC files update. This should fix some issues with the file watcher updating the UI even after editing a ARC file with ARCitect. (by @Freymaurer)

## 1.6.0 - 2026-01-30

### ✨ Added
- Add new datahub entry for datahub.hhu.de by @Brilator in #489

### 🔄 Changed

- DataHUB view is now paginated to improve performance by @JonasLukasczyk
- Release notifications are only shown for releases that are not marked as drafts or prereleases @JonasLukasczyk
- The AddRemoteDialog now only shows DataHUB groups the current user is a member of @JonasLukasczyk
- Improve bug reporting instructions and button label by @Brilator in #487

### 🐛 Fixed

- Fix Datamap Functionality by @caroott in #494, #495

## 1.5.0 - 2025-12-15

### ✨ Added

- Added a button to the Bug Report View to open the developer console #454 (by @Thyra and @Brilator).
- Regularly check if updates are available on a remote and notify user, related to #450 (by @Thyra)
- Git operations (push, pull, commit, etc.) can now be minimized to run in the background. A floating button appears in the bottom-right corner showing the operation status with visual indicators (hourglass for running, checkmark for success, error icon for failure). Users can continue working while long-running operations complete, and can restore the dialog at any time to view progress. All git operation and LFS file download buttons are disabled while another git operation is running to prevent conflicts (by @Thyra)

### 🐛 Fixed

- Fixed an issue where text files would be re-created after deleting them while they were open for editing #474 (by @Thyra who also caused this problem).
- Image metadata browser component added to the ImageView component (by @kMutagene)
- Datamap imports from arctrl spelling (older versions had capitalized M) (by @kMutagene)
- ARC open failures now show detailed errors and release the loading overlay correctly (by @caroott)

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
