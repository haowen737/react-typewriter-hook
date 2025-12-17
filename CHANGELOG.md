# Changelog

## 2.0.1 (2025-12-17)

### Fixed
- `useTypewriterSequence`: avoid restarting on every render when delay options are passed as array literals.

## 2.0.0 (2025-12-17)

### Breaking changes
- Build output moved from `build/` to `dist/`, and the package now uses an `exports` map.
- Node support is now `>=18 <=22` (`engines.node`).

### Added
- New hook: `useTypewriterSequence(words, options)` for cycling through an array of strings with configurable `pauseMs` and `loop`.
- New options for delays: `typingDelay` / `deletingDelay` (number or `[minMs, maxMs]`).

### Changed
- Reworked the internal typewriter engine and scheduling to avoid idle interval loops.
- Example site migrated to Vite and deploys to GitHub Pages.
