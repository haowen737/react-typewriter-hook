# react-typewriter-hook
> ⌨️   Use react hooks for typing effect easily

## Sample
<img src="https://github.com/haowen737/react-typewriter-hook/blob/master/docs/example.gif" alt="examplegif" width="620">

## Install
```sh
npm i react-typewriter-hook --save
```

## Example
- Live Demo: [react-typewriter-hook](https://haowen737.github.io/react-typewriter-hook/)
- Local demo: `npm --prefix example install && npm --prefix example run dev`

## Usage
```js
import useTypewriter from "react-typewriter-hook"
import { useTypewriterSequence } from "react-typewriter-hook"

function MagicWriter(word) {
  const typing = useTypewriter(word, {
    typingDelay: [90, 170],
    deletingDelay: [55, 120],
  })
  return typing ?? ""
}

function MagicSequence(words) {
  const typing = useTypewriterSequence(words, {
    pauseMs: 1700,
    loop: true,
    typingDelay: [90, 170],
    deletingDelay: [55, 120],
  })
  return typing ?? ""
}

```
## Behavior
- When `word` changes, it erases the previous word then types the new word.
