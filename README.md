# react-typewriter-hook
> ⌨️   Use react hooks for typing effect easily

## Sample
<img src="https://github.com/haowen737/react-typewriter-hook/blob/master/docs/example.gif" alt="examplegif" width="620">

## Install
```sh
npm i react-typewriter-hook --save
```

## Example
View example at [codesandbox](https://codesandbox.io/s/lr3q0q32vq)

## Usage
```js
// useTypewriter will do these things
// Once Word changed, typewritter will automatically erase last word
// Then type down new word
import useTypewriter from "react-typewriter-hook"

function MagicWriter(word) {
  const typing = useTypewriter(word)
  return typing
}

```
## What happens after call useTypewriter hook
- Typewriter accept the word, ready to write
- Typewriter write down your word and waiting for the word change
- Typewriter once accept the new word, it erases the last word, and write down next

