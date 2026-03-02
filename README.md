# react-typewriter-hook
[![npm version](https://img.shields.io/npm/v/react-typewriter-hook)](https://www.npmjs.com/package/react-typewriter-hook)
[![npm downloads](https://img.shields.io/npm/dm/react-typewriter-hook)](https://www.npmjs.com/package/react-typewriter-hook)
[![react peer](https://img.shields.io/npm/dependency-version/react-typewriter-hook/peer/react?label=react)](https://www.npmjs.com/package/react-typewriter-hook)
[![bundle size](https://badgen.net/bundlephobia/minzip/react-typewriter-hook)](https://bundlephobia.com/package/react-typewriter-hook)
[![types](https://img.shields.io/npm/types/react-typewriter-hook)](https://www.npmjs.com/package/react-typewriter-hook)
[![CI](https://github.com/haowen737/react-typewriter-hook/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/haowen737/react-typewriter-hook/actions/workflows/ci.yml)
[![Coverage](https://codecov.io/gh/haowen737/react-typewriter-hook/graph/badge.svg?branch=master)](https://codecov.io/gh/haowen737/react-typewriter-hook)

React hooks for typewriter effects with configurable typing/deleting speed, plus multi-word sequence support.

## Demo
![typewriter demo](https://github.com/haowen737/react-typewriter-hook/blob/master/docs/example.gif)

- Live demo: [react-typewriter-hook](https://haowen737.github.io/react-typewriter-hook/)
- Local demo: `npm --prefix example install && npm --prefix example run dev`

## Install
```sh
npm i react-typewriter-hook
```

## Quick Start
```tsx
import useTypewriter, { useTypewriterSequence } from 'react-typewriter-hook'

function MagicWriter({ word }: { word: string }) {
  const typing = useTypewriter(word, {
    typingDelay: [90, 170],
    deletingDelay: [55, 120],
  })
  return <span>{typing ?? ''}</span>
}

function MagicSequence({ words }: { words: string[] }) {
  const typing = useTypewriterSequence(words, {
    pauseMs: 1700,
    loop: true,
    typingDelay: [90, 170],
    deletingDelay: [55, 120],
  })
  return <span>{typing ?? ''}</span>
}
```

## API
### `useTypewriter(text, options?)`

Returns `string | null`.

- `text: string`: target text to type.
- `options?.typingDelay`: `number | [minMs, maxMs]`, default `[90, 170]`.
- `options?.deletingDelay`: `number | [minMs, maxMs]`, default `[55, 120]`.

### `useTypewriterSequence(words, options?)`

Returns `string | null`.

- `words: readonly string[]`: words to cycle through.
- `options?.pauseMs`: pause after a word is fully typed. Default `1700`.
- `options?.loop`: continue cycling after the last word. Default `true`.
- `options?.typingDelay`: `number | [minMs, maxMs]`, default `[90, 170]`.
- `options?.deletingDelay`: `number | [minMs, maxMs]`, default `[55, 120]`.

## Behavior
- `useTypewriter` types the target text one character at a time.
- When target text changes, it deletes the current text to empty first, then types the next target.
- `useTypewriterSequence` starts from `words[0]`, types it, waits `pauseMs`, then transitions to the next word.
- With `loop: false`, sequence stops after the last word is fully typed.
- With `loop: true`, sequence wraps back to the first word after the last word.
- If `words` is empty, `useTypewriterSequence` returns `null`.
- Delay ranges are inclusive and order-safe: `[170, 90]` is treated the same as `[90, 170]`.

## Compatibility
- React peer dependency: `>=16.8` (Hooks).
- Package engines: Node `>=20`.
- Includes ESM/CJS builds and TypeScript declarations.
