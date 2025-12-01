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

- Files without view support by ARCitect will open a default view with a button allowing the user to open them with the default application. This feature was also added for all files in the context menu #455 (by @Thyra, @freymaurer)
- Auto save changes via Markdown editor when switching files or closing Markdown editor #428 (by @Thyra)

### 🔄 Changed

- Changed opinionated LFS behavior. LFS will now always push and never default on pul #413 #458 (by @Thyra) 

### 🐛 Fixed

- Fixed issue where LFS blacklist was not being applied correctly #431, #453 (by @Thyra)
- Fixed image reading from local file system (by @Thyra)

## 1.3.2 - 2024-10-26

### ✨ Added

- Last release before start of Changelog
